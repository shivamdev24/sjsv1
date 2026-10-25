import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

import {
  createProductSchema,
  type CreateProductInput,
} from "@/backend/validators/product.validator";

import {
  uploadProductImage,
  deleteProductImage,
} from "@/backend/services/product-image.service";

import * as productRepository from "@/backend/repositories/product.repository";

type UploadedProductImage = {
  url: string;
  publicId: string;
  position: number;
};

function normalizeProductInput(input: CreateProductInput): CreateProductInput {
  return {
    ...input,
    images: [],
    variants:
      input.type === "PHYSICAL"
        ? input.variants
        : input.variants.map((variant) => ({
            ...variant,
            trackInventory: false,
            stockQuantity: 0,
          })),
  };
}

async function validateProductInput(
  id: string | undefined,
  input: CreateProductInput,
) {
  const data = createProductSchema.parse(normalizeProductInput(input));

  if (new Set(data.categoryIds).size !== data.categoryIds.length) {
    throw new Error("A category cannot be selected more than once.");
  }

  const skus = data.variants.map((variant) => variant.sku);

  if (new Set(skus).size !== skus.length) {
    throw new Error("Variant SKUs must be unique.");
  }

  if (data.categoryIds.length > 0) {
    const categories = await prisma.productCategory.findMany({
      where: {
        id: { in: data.categoryIds },
        isActive: true,
      },
      select: { id: true },
    });

    if (categories.length !== data.categoryIds.length) {
      throw new Error("One or more categories are invalid or inactive.");
    }
  }

  const existingSlug = await prisma.product.findFirst({
    where: {
      slug: data.slug,
      ...(id ? { id: { not: id } } : {}),
    },
    select: { id: true },
  });

  if (existingSlug) {
    throw new Error("A product with this slug already exists.");
  }

  const existingSkus = await prisma.productVariant.findMany({
    where: {
      sku: { in: skus },
      ...(id ? { productId: { not: id } } : {}),
    },
    select: { sku: true },
  });

  if (existingSkus.length > 0) {
    throw new Error("One or more SKUs already exist.");
  }

  return data;
}

async function uploadImages(
  files: File[],
  startPosition = 0,
): Promise<UploadedProductImage[]> {
  const uploaded: UploadedProductImage[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const image = await uploadProductImage(file);

      uploaded.push({
        url: image.url,
        publicId: image.publicId,
        position: startPosition + index,
      });
    }

    return uploaded;
  } catch (error) {
    await Promise.allSettled(
      uploaded.map((image) => deleteProductImage(image.publicId)),
    );

    throw error;
  }
}

async function cleanupUploadedImages(images: UploadedProductImage[]) {
  const results = await Promise.allSettled(
    images.map((image) => deleteProductImage(image.publicId)),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Failed to clean up uploaded image:", result.reason);
    }
  });
}

function normalizeDatabaseError(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new Error(
      "A product slug or variant SKU already exists. Please use unique values.",
    );
  }

  throw error;
}

export async function createProduct(
  input: CreateProductInput,
  imageFiles: File[] = [],
) {
  const data = await validateProductInput(undefined, input);

  if (imageFiles.length === 0) {
    throw new Error("Please upload at least one product image.");
  }

  const uploadedImages = await uploadImages(imageFiles);

  try {
    return await productRepository.createProduct({
      ...data,
      images: uploadedImages,
    });
  } catch (error) {
    await cleanupUploadedImages(uploadedImages);
    normalizeDatabaseError(error);
  }
}

export async function updateProduct(
  id: string,
  input: CreateProductInput,
  imageFiles: File[] = [],
) {
  const existingProduct = await productRepository.getProductById(id);

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const data = await validateProductInput(id, input);

  const uploadedImages = await uploadImages(
    imageFiles,
    existingProduct.images.length,
  );

  try {
    return await productRepository.updateProductById(id, {
      ...data,
      images: uploadedImages,
    });
  } catch (error) {
    await cleanupUploadedImages(uploadedImages);
    normalizeDatabaseError(error);
  }
}

export async function deleteProduct(id: string) {
  const existingProduct = await productRepository.getProductById(id);

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const deletedProduct = await productRepository.deleteProductById(id);

  const imagesWithPublicIds = deletedProduct.images.filter(
    (image) => image.publicId,
  );

  const results = await Promise.allSettled(
    imagesWithPublicIds.map((image) => deleteProductImage(image.publicId!)),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Failed to delete product image from Cloudinary:",
        result.reason,
      );
    }
  });

  return deletedProduct;
}

export async function listProducts() {
  return productRepository.getProducts();
}

export async function getProduct(id: string) {
  const product = await productRepository.getProductById(id);

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
}
