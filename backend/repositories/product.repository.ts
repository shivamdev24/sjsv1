import { AccountDelegate } from "./../../generated/prisma/models/Account";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { CreateProductInput } from "@/backend/validators/product.validator";

export async function createProduct(data: CreateProductInput) {
  return prisma.$transaction(async (tx) => {
    const { categoryIds, images, variants, ...productData } = data;

    return tx.product.create({
      data: {
        ...productData,

        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },

        images: {
          create: images,
        },

        variants: {
          create: variants.map((variant) => ({
            ...variant,
            attributes: variant.attributes as Prisma.InputJsonValue,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice ?? null,
          })),
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        images: true,
        variants: true,
      },
    });
  });
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
      categories: {
        include: { category: true },
      },
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
      categories: {
        include: { category: true },
      },
    },
  });
}
export async function updateProductById(id: string, data: CreateProductInput) {
  return prisma.$transaction(async (tx) => {
    const { categoryIds, images, variants, ...productData } = data;

    return tx.product.update({
      where: { id },
      data: {
        ...productData,

        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },

        // Preserve existing images and append newly uploaded images.
        images: {
          create: images,
        },

        // Replacing variants can be unsafe if order records reference them.
        variants: {
          deleteMany: {},
          create: variants.map((variant) => ({
            ...variant,
            attributes: variant.attributes as Prisma.InputJsonValue,
            price: variant.price,
            compareAtPrice: variant.compareAtPrice ?? null,
          })),
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        images: {
          orderBy: { position: "asc" },
        },
        variants: true,
      },
    });
  });
}
export async function deleteProductById(id: string) {
  return prisma.product.delete({
    where: { id },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
      variants: true,
      categories: {
        include: { category: true },
      },
    },
  });
}
