import "server-only";

import cloudinary from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export async function uploadProductImage(file: File) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select a product image.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Product image must be smaller than 5 MB.");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, and AVIF images are allowed.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary returned no upload result."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    stream.end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

export async function deleteProductImage(publicId: string) {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error("Unable to delete the uploaded product image.");
  }
}
