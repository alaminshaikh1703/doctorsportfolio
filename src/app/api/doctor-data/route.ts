import { NextResponse } from "next/server";
import { getDoctorData, updateInMemoryData, invalidateDoctorDataCache } from "../../../lib/getDoctorData";
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
    const { doctor, services, gallery, testimonials, blog, databaseUrl } = body;

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
    updateInMemoryData({ doctor, services, gallery, testimonials, blog });
    invalidateDoctorDataCache();

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
              emergency_phone = ?,
              whatsapp_number = ?,
              email = ?, 
              address = ?,
              seo_title = ?,
              seo_description = ?,
              seo_keywords = ?,
              og_image = ?,
              og_image_public_id = ?
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
              doctor.contact?.emergencyPhone || "",
              doctor.contact?.whatsappNumber || doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
              doctor.seoTitle || "",
              doctor.seoDescription || "",
              doctor.seoKeywords || "",
              doctor.ogImage || "",
              doctor.ogImagePublicId || null,
            ]
          );
        } else {
          await query(
            `INSERT INTO doctor_profile (id, name, title, hero_image, hero_image_public_id, about_image, about_image_public_id, bio, phone, emergency_phone, whatsapp_number, email, address, seo_title, seo_description, seo_keywords, og_image, og_image_public_id)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              doctor.name,
              doctor.title,
              doctor.heroImage,
              doctor.heroImagePublicId || null,
              doctor.aboutImage,
              doctor.aboutImagePublicId || null,
              doctor.bio,
              doctor.contact?.phone || "",
              doctor.contact?.emergencyPhone || "",
              doctor.contact?.whatsappNumber || doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
              doctor.seoTitle || "",
              doctor.seoDescription || "",
              doctor.seoKeywords || "",
              doctor.ogImage || "",
              doctor.ogImagePublicId || null,
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

        // Sync blog articles to database and delete removed blog items
        if (blog && Array.isArray(blog)) {
          if (blog.length > 0) {
            const blogIds = blog.map((b) => b.id);
            const placeholders = blogIds.map(() => "?").join(",");
            await query(`DELETE FROM blog WHERE id NOT IN (${placeholders})`, blogIds).catch(() => {});
          } else {
            await query(`DELETE FROM blog`).catch(() => {});
          }

          for (const post of blog) {
            await query(
              `INSERT INTO blog (id, title, slug, category, read_time, date, excerpt, content, featured_image, featured_image_public_id, author_name, author_role)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                slug = VALUES(slug),
                category = VALUES(category),
                read_time = VALUES(read_time),
                date = VALUES(date),
                excerpt = VALUES(excerpt),
                content = VALUES(content),
                featured_image = VALUES(featured_image),
                featured_image_public_id = VALUES(featured_image_public_id),
                author_name = VALUES(author_name),
                author_role = VALUES(author_role)`,
              [
                post.id,
                post.title,
                post.slug || post.id,
                post.category || "Dental Health",
                post.readTime || "5 min read",
                post.date || "Recent",
                post.excerpt || "",
                post.content || "",
                post.featuredImage || "",
                post.featuredImagePublicId || null,
                post.author?.name || doctor.name,
                post.author?.role || doctor.title,
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
