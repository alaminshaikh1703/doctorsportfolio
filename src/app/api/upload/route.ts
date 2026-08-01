import { NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

// Allowed MIME types
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

// Max file size: 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST /api/upload
 * Handles direct image upload to Cloudinary CDN
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "doctors";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No image file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Allowed formats: JPG, JPEG, PNG, WEBP, AVIF, GIF, SVG.",
        },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds the 10 MB limit.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload directly to Cloudinary CDN
    const result = await uploadImage(buffer, folder);

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully to Cloudinary CDN!",
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Cloudinary upload failed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/upload
 * Deletes asset from Cloudinary using publicId
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "publicId parameter is required" },
        { status: 400 }
      );
    }

    const success = await deleteImage(publicId);

    return NextResponse.json({
      success,
      message: success
        ? "Asset deleted from Cloudinary successfully"
        : "Failed to delete asset from Cloudinary",
    });
  } catch (error) {
    console.error("Delete API Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || "Deletion failed" },
      { status: 500 }
    );
  }
}
