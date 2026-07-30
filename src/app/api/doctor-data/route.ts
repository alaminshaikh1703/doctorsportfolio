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
              about_image = ?, 
              bio = ?, 
              phone = ?, 
              email = ?, 
              address = ? 
            WHERE id = 1`,
            [
              doctor.name,
              doctor.title,
              doctor.heroImage,
              doctor.aboutImage,
              doctor.bio,
              doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
            ]
          );
        } else {
          await query(
            `INSERT INTO doctor_profile (id, name, title, hero_image, about_image, bio, phone, email, address)
             VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              doctor.name,
              doctor.title,
              doctor.heroImage,
              doctor.aboutImage,
              doctor.bio,
              doctor.contact?.phone || "",
              doctor.contact?.email || "",
              doctor.location?.address || "",
            ]
          );
        }

        // Sync services to database
        if (services && Array.isArray(services)) {
          for (const serv of services) {
            await query(
              `INSERT INTO services (id, title, short_description, image, estimated_duration)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                short_description = VALUES(short_description),
                image = VALUES(image),
                estimated_duration = VALUES(estimated_duration)`,
              [serv.id, serv.title, serv.shortDescription, serv.image, serv.estimatedDuration]
            );
          }
        }

        // Sync gallery photos to database
        if (gallery && Array.isArray(gallery)) {
          for (const item of gallery) {
            await query(
              `INSERT INTO gallery (id, title, category, image, caption)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                category = VALUES(category),
                image = VALUES(image),
                caption = VALUES(caption)`,
              [item.id, item.title, item.category, item.image, item.caption || ""]
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
