import { z } from "zod";

const productVariantSchema = z
  .object({
    name: z.string().trim().min(1, "Variant name is required").max(100),

    sku: z
      .string()
      .trim()
      .min(1, "SKU is required")
      .max(100)
      .transform((value) => value.toUpperCase()),

    price: z.coerce
      .number()
      .finite()
      .positive("Price must be greater than 0")
      .refine(
        (value) => Math.round(value * 100) === value * 100,
        "Price can have at most two decimal places",
      ),

    compareAtPrice: z.coerce
      .number()
      .finite()
      .positive()
      .refine(
        (value) => Math.round(value * 100) === value * 100,
        "Compare-at price can have at most two decimal places",
      )
      .optional()
      .nullable(),

    stockQuantity: z.coerce.number().int().min(0).default(0),

    trackInventory: z.boolean().default(true),

    attributes: z.record(z.string(), z.unknown()).default({}),

    isDefault: z.boolean().default(false),

    isActive: z.boolean().default(true),
  })
  .refine(
    (variant) =>
      variant.compareAtPrice == null || variant.compareAtPrice > variant.price,
    {
      message: "Compare-at price must be greater than the selling price",
      path: ["compareAtPrice"],
    },
  );

export const createProductSchema = z
  .object({
    name: z.string().trim().min(2).max(200),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug"),

    description: z.string().trim().min(1, "Description is required"),

    type: z.enum(["PHYSICAL", "DIGITAL", "SERVICE"]),

    status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]).default("DRAFT"),

    categoryIds: z
      .array(z.cuid())
      .refine((ids) => new Set(ids).size === ids.length, {
        message: "A category cannot be selected more than once",
      })
      .default([]),

    images: z
      .array(
        z.object({
          url: z.url(),
          publicId: z.string().min(1).optional().nullable(),
          altText: z.string().trim().max(200).optional().nullable(),
          position: z.number().int().min(0).default(0),
        }),
      )
      .refine(
        (images) =>
          new Set(images.map((image) => image.position)).size === images.length,
        { message: "Image positions must be unique" },
      )
      .default([]),

    variants: z.array(productVariantSchema).min(1, "Add at least one variant"),
  })
  .refine(
    (product) =>
      product.variants.filter((variant) => variant.isDefault).length === 1,
    {
      message: "Exactly one variant must be the default",
      path: ["variants"],
    },
  )
  .refine(
    (product) => {
      const skus = product.variants.map((variant) => variant.sku);
      return new Set(skus).size === skus.length;
    },
    {
      message: "Each variant must have a unique SKU",
      path: ["variants"],
    },
  )
  .superRefine((product, ctx) => {
    if (product.type !== "PHYSICAL") {
      product.variants.forEach((variant, index) => {
        if (variant.trackInventory) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "trackInventory"],
            message: "Only physical products can track inventory",
          });
        }

        if (variant.stockQuantity !== 0) {
          ctx.addIssue({
            code: "custom",
            path: ["variants", index, "stockQuantity"],
            message: "Nonphysical products must have zero stock",
          });
        }
      });
    }
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
