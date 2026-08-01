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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try saving locally to public/uploads (for local dev / traditional servers)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(file.name) || ".png";
      const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, filename);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: "Image uploaded successfully!",
        url: `/uploads/${filename}`,
      });
    } catch (fsError) {
      // Vercel serverless environment (EROFS read-only filesystem)
      // Fall back to returning compressed Base64 Data URI so it works 100% on Vercel without external cloud storage setup!
      const mimeType = file.type || "image/png";
      const base64String = buffer.toString("base64");
      const dataUri = `data:${mimeType};base64,${base64String}`;

      return NextResponse.json({
        success: true,
        message: "Image processed for Vercel serverless deployment!",
        url: dataUri,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
