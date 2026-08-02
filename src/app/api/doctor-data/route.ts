import { NextResponse } from "next/server";
import { getDoctorData, updateInMemoryData } from "../../../lib/getDoctorData";
import { query, getPool, autoInitDatabaseTables, setCurrentDatabaseUrl, getCurrentDatabaseUrl } from "../../../lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getDoctorData();
  return NextResponse.json({
    ...data,
    databaseUrl: getCurrentDatabaseUrl(),
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { doctor, services, gallery, testimonials, databaseUrl } = body;

    // If new databaseUrl was provided, configure and initialize remote database
    if (databaseUrl !== undefined) {
      setCurrentDatabaseUrl(databaseUrl);
      const pool = getPool(databaseUrl);
      if (pool) {
        const initResult = await autoInitDatabaseTables(pool);
        if (!initResult.success) {
          return NextResponse.json(
            { success: false, error: `MySQL Connection Failed: ${initResult.error}` },
            { status: 400 }
          );
        }
      }
    }

    // Update in-memory state for immediate fallback responsiveness
    updateInMemoryData({ doctor, services, gallery, testimonials });

    // Save/Update doctor details & image URLs to destination MySQL database
    if (doctor) {
      const dbPool = getPool();
      if (dbPool) {
        await autoInitDatabaseTables(dbPool);

        // Check if row 1 exists
        const existing = await query<any[]>("SELECT id FROM doctor_profile WHERE id = 1");
        if (existing && existing.length > 0) {
          await query(
            `UPDATE doctor_profile SET 
              name = ?, 
              title = ?, 
              hero_image = ?, 
              hero_image_public_id = ?,
              about_image = ?, 
              about_image_public_id = ?,
              bio = ?, 
              phone = ?, 
              email = ?, 
              address = ? 
            WHERE id = 1`,
            [
              doctor.name,
              doctor.title,
              doctor.heroImage,
              doctor.heroImagePublicId || null,
              doctor.aboutImage,
              doctor.aboutImagePublicId || null,
              doctor.bio,
              doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
            ]
          );
        } else {
          await query(
            `INSERT INTO doctor_profile (id, name, title, hero_image, hero_image_public_id, about_image, about_image_public_id, bio, phone, email, address)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              doctor.name,
              doctor.title,
              doctor.heroImage,
              doctor.heroImagePublicId || null,
              doctor.aboutImage,
              doctor.aboutImagePublicId || null,
              doctor.bio,
              doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
            ]
          );
        }

        // Sync services to database and delete removed services
        if (services && Array.isArray(services)) {
          if (services.length > 0) {
            const serviceIds = services.map((s) => s.id);
            const placeholders = serviceIds.map(() => "?").join(",");
            await query(`DELETE FROM services WHERE id NOT IN (${placeholders})`, serviceIds).catch(() => {});
          } else {
            await query(`DELETE FROM services`).catch(() => {});
          }

          for (const serv of services) {
            await query(
              `INSERT INTO services (id, title, short_description, image, image_public_id, estimated_duration)
               VALUES (?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                short_description = VALUES(short_description),
                image = VALUES(image),
                image_public_id = VALUES(image_public_id),
                estimated_duration = VALUES(estimated_duration)`,
              [serv.id, serv.title, serv.shortDescription, serv.image, serv.imagePublicId || null, serv.estimatedDuration]
            );
          }
        }

        // Sync gallery photos to database and delete removed gallery items
        if (gallery && Array.isArray(gallery)) {
          if (gallery.length > 0) {
            const galleryIds = gallery.map((g) => g.id);
            const placeholders = galleryIds.map(() => "?").join(",");
            await query(`DELETE FROM gallery WHERE id NOT IN (${placeholders})`, galleryIds).catch(() => {});
          } else {
            await query(`DELETE FROM gallery`).catch(() => {});
          }

          for (const item of gallery) {
            await query(
              `INSERT INTO gallery (id, title, category, image, image_public_id, caption)
               VALUES (?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                category = VALUES(category),
                image = VALUES(image),
                image_public_id = VALUES(image_public_id),
                caption = VALUES(caption)`,
              [item.id, item.title, item.category, item.image, item.imagePublicId || null, item.caption || ""]
            );
          }
        }

        // Sync testimonials to database and delete removed testimonials
        if (testimonials && Array.isArray(testimonials)) {
          if (testimonials.length > 0) {
            const testimonialIds = testimonials.map((t) => t.id);
            const placeholders = testimonialIds.map(() => "?").join(",");
            await query(`DELETE FROM testimonials WHERE id NOT IN (${placeholders})`, testimonialIds).catch(() => {});
          } else {
            await query(`DELETE FROM testimonials`).catch(() => {});
          }

          for (const item of testimonials) {
            await query(
              `INSERT INTO testimonials (id, patient_name, patient_role_or_condition, patient_avatar, patient_avatar_public_id, rating, review_text, date, verified_google_review)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                patient_name = VALUES(patient_name),
                patient_role_or_condition = VALUES(patient_role_or_condition),
                patient_avatar = VALUES(patient_avatar),
                patient_avatar_public_id = VALUES(patient_avatar_public_id),
                rating = VALUES(rating),
                review_text = VALUES(review_text),
                date = VALUES(date),
                verified_google_review = VALUES(verified_google_review)`,
              [
                item.id,
                item.patientName,
                item.patientRoleOrCondition,
                item.patientAvatar,
                item.patientAvatarPublicId || null,
                item.rating,
                item.reviewText,
                item.date,
                item.verifiedGoogleReview ? 1 : 0,
              ]
            );
          }
        }
      }
    }

    const updatedData = await getDoctorData();
    return NextResponse.json({
      success: true,
      message: "Portfolio data, images & destination MySQL database synced successfully!",
      data: {
        ...updatedData,
        databaseUrl: getCurrentDatabaseUrl(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
