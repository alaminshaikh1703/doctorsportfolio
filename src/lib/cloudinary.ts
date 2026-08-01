import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary SDK with environment variables or fallback configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "111111111111111",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo_secret",
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Uploads a file Buffer directly to Cloudinary in the specified folder.
 * @param fileBuffer The raw binary image buffer
 * @param folder Target folder (e.g. 'doctors', 'services', 'gallery', 'testimonials', 'blogs')
 */
export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = "doctors"
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `doctor_portfolio/${folder}`,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" }
        ],
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          return reject(error || new Error("Failed to upload image to Cloudinary"));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
}

/**
 * Deletes an image from Cloudinary using its public_id.
 * @param publicId The Cloudinary asset public_id
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Cloudinary delete asset error:", error);
    return false;
  }
}

/**
 * Replaces an existing Cloudinary image asset with a new image.
 * Deletes the old asset if `oldPublicId` is provided, then uploads the new image.
 */
export async function replaceImage(
  newFileBuffer: Buffer,
  oldPublicId: string | null | undefined,
  folder: string = "doctors"
): Promise<CloudinaryUploadResult> {
  if (oldPublicId) {
    await deleteImage(oldPublicId).catch(() => {});
  }
  return uploadImage(newFileBuffer, folder);
}

export { cloudinary };
