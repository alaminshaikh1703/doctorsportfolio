import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file format. Please upload JPG, PNG, WEBP, SVG, or GIF images." },
        { status: 400 }
      );
    }

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Sanitize and generate unique filename
    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Convert file arrayBuffer to Buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully!",
      url: publicUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
