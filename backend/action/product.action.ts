// "use server";

// import { revalidatePath } from "next/cache";

// import { getCurrentUser } from "@/lib/auth/current-user";
// import { createProduct } from "@/backend/services/product.service";
// import { createProductSchema } from "@/backend/validators/product.validator";
// import type { ProductActionState } from "@/backend/validators/product-action-state";

// export type { ProductActionState } from "@/backend/validators/product-action-state";

// async function requireProductAdmin() {
//   const user = await getCurrentUser();

//   if (!user) {
//     throw new Error("Please sign in to continue.");
//   }

//   if (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN")) {
//     throw new Error("You are not authorized to manage products.");
//   }

//   return user;
// }

// export async function createProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const rawInput = formData.get("product");

//     if (typeof rawInput !== "string") {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     let parsedJson: unknown;

//     try {
//       parsedJson = JSON.parse(rawInput);
//     } catch {
//       return {
//         success: false,
//         message: "Product data must be valid JSON.",
//       };
//     }

//     // Ignore client-supplied image URLs and metadata.
//     if (
//       typeof parsedJson !== "object" ||
//       parsedJson === null ||
//       Array.isArray(parsedJson)
//     ) {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     const productInput = {
//       ...parsedJson,
//       images: [],
//     };

//     const validation = createProductSchema.safeParse(productInput);

//     if (!validation.success) {
//       return {
//         success: false,
//         message: validation.error.issues
//           .map((issue) => issue.message)
//           .join(" "),
//       };
//     }

//     const imageEntries = formData.getAll("images");
//     const imageFiles: File[] = [];

//     for (const entry of imageEntries) {
//       if (!(entry instanceof File)) {
//         return {
//           success: false,
//           message: "Invalid product image submission.",
//         };
//       }

//       // Ignore empty file inputs, but reject if no real image is supplied.
//       if (entry.size > 0) {
//         imageFiles.push(entry);
//       }
//     }

//     if (imageFiles.length === 0) {
//       return {
//         success: false,
//         message: "Please upload at least one product image.",
//       };
//     }

//     await createProduct(validation.data, imageFiles);

//     revalidatePath("/admin/product");
//     revalidatePath("/dashboard");

//     return {
//       success: true,
//       message: "Product created successfully.",
//     };
//   } catch (error) {
//     console.error("Create product action failed:", error);

//     const knownErrors = [
//       "Please sign in to continue.",
//       "You are not authorized to manage products.",
//       "A product with this slug already exists.",
//       "One or more categories are invalid or inactive.",
//       "One or more SKUs already exist.",
//       "A category cannot be selected more than once.",
//       "Please upload at least one product image.",
//     ];

//     return {
//       success: false,
//       message:
//         error instanceof Error && knownErrors.includes(error.message)
//           ? error.message
//           : "Unable to create the product. Please check the details and try again.",
//     };
//   }
// }
// export async function updateProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const rawInput = formData.get("product");

//     if (typeof rawInput !== "string") {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     let parsedJson: unknown;

//     try {
//       parsedJson = JSON.parse(rawInput);
//     } catch {
//       return {
//         success: false,
//         message: "Product data must be valid JSON.",
//       };
//     }

//     // Ignore client-supplied image URLs and metadata.
//     if (
//       typeof parsedJson !== "object" ||
//       parsedJson === null ||
//       Array.isArray(parsedJson)
//     ) {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     const productInput = {
//       ...parsedJson,
//       images: [],
//     };

//     const validation = createProductSchema.safeParse(productInput);

//     if (!validation.success) {
//       return {
//         success: false,
//         message: validation.error.issues
//           .map((issue) => issue.message)
//           .join(" "),
//       };
//     }

//     const imageEntries = formData.getAll("images");
//     const imageFiles: File[] = [];

//     for (const entry of imageEntries) {
//       if (!(entry instanceof File)) {
//         return {
//           success: false,
//           message: "Invalid product image submission.",
//         };
//       }

//       // Ignore empty file inputs, but reject if no real image is supplied.
//       if (entry.size > 0) {
//         imageFiles.push(entry);
//       }
//     }

//     if (imageFiles.length === 0) {
//       return {
//         success: false,
//         message: "Please upload at least one product image.",
//       };
//     }

//     await createProduct(validation.data, imageFiles);

//     revalidatePath("/admin/product");
//     revalidatePath("/dashboard");

//     return {
//       success: true,
//       message: "Product created successfully.",
//     };
//   } catch (error) {
//     console.error("Create product action failed:", error);

//     const knownErrors = [
//       "Please sign in to continue.",
//       "You are not authorized to manage products.",
//       "A product with this slug already exists.",
//       "One or more categories are invalid or inactive.",
//       "One or more SKUs already exist.",
//       "A category cannot be selected more than once.",
//       "Please upload at least one product image.",
//     ];

//     return {
//       success: false,
//       message:
//         error instanceof Error && knownErrors.includes(error.message)
//           ? error.message
//           : "Unable to create the product. Please check the details and try again.",
//     };
//   }
// }
// export async function deleteProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const rawInput = formData.get("product");

//     if (typeof rawInput !== "string") {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     let parsedJson: unknown;

//     try {
//       parsedJson = JSON.parse(rawInput);
//     } catch {
//       return {
//         success: false,
//         message: "Product data must be valid JSON.",
//       };
//     }

//     // Ignore client-supplied image URLs and metadata.
//     if (
//       typeof parsedJson !== "object" ||
//       parsedJson === null ||
//       Array.isArray(parsedJson)
//     ) {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     const productInput = {
//       ...parsedJson,
//       images: [],
//     };

//     const validation = createProductSchema.safeParse(productInput);

//     if (!validation.success) {
//       return {
//         success: false,
//         message: validation.error.issues
//           .map((issue) => issue.message)
//           .join(" "),
//       };
//     }

//     const imageEntries = formData.getAll("images");
//     const imageFiles: File[] = [];

//     for (const entry of imageEntries) {
//       if (!(entry instanceof File)) {
//         return {
//           success: false,
//           message: "Invalid product image submission.",
//         };
//       }

//       // Ignore empty file inputs, but reject if no real image is supplied.
//       if (entry.size > 0) {
//         imageFiles.push(entry);
//       }
//     }

//     if (imageFiles.length === 0) {
//       return {
//         success: false,
//         message: "Please upload at least one product image.",
//       };
//     }

//     await createProduct(validation.data, imageFiles);

//     revalidatePath("/admin/product");
//     revalidatePath("/dashboard");

//     return {
//       success: true,
//       message: "Product created successfully.",
//     };
//   } catch (error) {
//     console.error("Create product action failed:", error);

//     const knownErrors = [
//       "Please sign in to continue.",
//       "You are not authorized to manage products.",
//       "A product with this slug already exists.",
//       "One or more categories are invalid or inactive.",
//       "One or more SKUs already exist.",
//       "A category cannot be selected more than once.",
//       "Please upload at least one product image.",
//     ];

//     return {
//       success: false,
//       message:
//         error instanceof Error && knownErrors.includes(error.message)
//           ? error.message
//           : "Unable to create the product. Please check the details and try again.",
//     };
//   }
// }
// export async function deleteProductActionById(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const rawInput = formData.get("product");

//     if (typeof rawInput !== "string") {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     let parsedJson: unknown;

//     try {
//       parsedJson = JSON.parse(rawInput);
//     } catch {
//       return {
//         success: false,
//         message: "Product data must be valid JSON.",
//       };
//     }

//     // Ignore client-supplied image URLs and metadata.
//     if (
//       typeof parsedJson !== "object" ||
//       parsedJson === null ||
//       Array.isArray(parsedJson)
//     ) {
//       return {
//         success: false,
//         message: "Invalid product submission.",
//       };
//     }

//     const productInput = {
//       ...parsedJson,
//       images: [],
//     };

//     const validation = createProductSchema.safeParse(productInput);

//     if (!validation.success) {
//       return {
//         success: false,
//         message: validation.error.issues
//           .map((issue) => issue.message)
//           .join(" "),
//       };
//     }

//     const imageEntries = formData.getAll("images");
//     const imageFiles: File[] = [];

//     for (const entry of imageEntries) {
//       if (!(entry instanceof File)) {
//         return {
//           success: false,
//           message: "Invalid product image submission.",
//         };
//       }

//       // Ignore empty file inputs, but reject if no real image is supplied.
//       if (entry.size > 0) {
//         imageFiles.push(entry);
//       }
//     }

//     if (imageFiles.length === 0) {
//       return {
//         success: false,
//         message: "Please upload at least one product image.",
//       };
//     }

//     await createProduct(validation.data, imageFiles);

//     revalidatePath("/admin/product");
//     revalidatePath("/dashboard");

//     return {
//       success: true,
//       message: "Product created successfully.",
//     };
//   } catch (error) {
//     console.error("Create product action failed:", error);

//     const knownErrors = [
//       "Please sign in to continue.",
//       "You are not authorized to manage products.",
//       "A product with this slug already exists.",
//       "One or more categories are invalid or inactive.",
//       "One or more SKUs already exist.",
//       "A category cannot be selected more than once.",
//       "Please upload at least one product image.",
//     ];

//     return {
//       success: false,
//       message:
//         error instanceof Error && knownErrors.includes(error.message)
//           ? error.message
//           : "Unable to create the product. Please check the details and try again.",
//     };
//   }
// }

// "use server";

// import { revalidatePath } from "next/cache";

// import { getCurrentUser } from "@/lib/auth/current-user";
// import {
//   createProduct,
//   updateProduct,
//   deleteProduct,
// } from "@/backend/services/product.service";
// import { createProductSchema } from "@/backend/validators/product.validator";
// import type { ProductActionState } from "@/backend/validators/product-action-state";

// export type { ProductActionState } from "@/backend/validators/product-action-state";

// const SUCCESS_CREATE = "Product created successfully.";
// const SUCCESS_UPDATE = "Product updated successfully.";
// const SUCCESS_DELETE = "Product deleted successfully.";

// const KNOWN_ERRORS = new Set([
//   "Please sign in to continue.",
//   "You are not authorized to manage products.",
//   "A product with this slug already exists.",
//   "One or more categories are invalid or inactive.",
//   "One or more SKUs already exist.",
//   "A category cannot be selected more than once.",
//   "Please upload at least one product image.",
//   "Product not found.",
// ]);

// type ProductInput = ReturnType<typeof createProductSchema.parse>;

// async function requireProductAdmin() {
//   const user = await getCurrentUser();

//   if (!user) {
//     throw new Error("Please sign in to continue.");
//   }

//   if (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN")) {
//     throw new Error("You are not authorized to manage products.");
//   }

//   return user;
// }

// function failure(message: string): ProductActionState {
//   return {
//     success: false,
//     message,
//   };
// }

// function success(message: string): ProductActionState {
//   return {
//     success: true,
//     message,
//   };
// }

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error && KNOWN_ERRORS.has(error.message)) {
//     return error.message;
//   }

//   return "Something went wrong. Please check the details and try again.";
// }

// function parseProduct(
//   formData: FormData,
// ): { success: true; data: ProductInput } | { success: false; message: string } {
//   const rawInput = formData.get("product");

//   if (typeof rawInput !== "string") {
//     return {
//       success: false,
//       message: "Invalid product submission.",
//     };
//   }

//   let parsed: unknown;

//   try {
//     parsed = JSON.parse(rawInput);
//   } catch {
//     return {
//       success: false,
//       message: "Product data must be valid JSON.",
//     };
//   }

//   if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
//     return {
//       success: false,
//       message: "Invalid product submission.",
//     };
//   }

//   // Images and image metadata must come from the server-side upload flow.
//   const validation = createProductSchema.safeParse({
//     ...parsed,
//     images: [],
//   });

//   if (!validation.success) {
//     return {
//       success: false,
//       message: validation.error.issues.map((issue) => issue.message).join(" "),
//     };
//   }

//   return {
//     success: true,
//     data: validation.data,
//   };
// }

// function getImageFiles(
//   formData: FormData,
// ): { success: true; files: File[] } | { success: false; message: string } {
//   const entries = formData.getAll("images");
//   const files: File[] = [];

//   for (const entry of entries) {
//     if (!(entry instanceof File)) {
//       return {
//         success: false,
//         message: "Invalid product image submission.",
//       };
//     }

//     if (entry.size > 0) {
//       files.push(entry);
//     }
//   }

//   return {
//     success: true,
//     files,
//   };
// }

// function revalidateProductPages() {
//   revalidatePath("/admin/product");
//   revalidatePath("/dashboard");
// }

// export async function createProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const parsed = parseProduct(formData);

//     if (!parsed.success) {
//       return failure(parsed.message);
//     }

//     const imageResult = getImageFiles(formData);

//     if (!imageResult.success) {
//       return failure(imageResult.message);
//     }

//     if (imageResult.files.length === 0) {
//       return failure("Please upload at least one product image.");
//     }

//     await createProduct(parsed.data, imageResult.files);

//     revalidateProductPages();

//     return success(SUCCESS_CREATE);
//   } catch (error) {
//     console.error("Create product action failed:", error);
//     return failure(getErrorMessage(error));
//   }
// }

// export async function updateProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const productId = formData.get("productId");

//     if (typeof productId !== "string" || !productId.trim()) {
//       return failure("A valid product ID is required.");
//     }

//     const parsed = parseProduct(formData);

//     if (!parsed.success) {
//       return failure(parsed.message);
//     }

//     const imageResult = getImageFiles(formData);

//     if (!imageResult.success) {
//       return failure(imageResult.message);
//     }

//     // An empty image list means no replacement images were uploaded.
//     // The service must preserve existing images in that case.
//     await updateProduct(productId, parsed.data, imageResult.files);

//     revalidateProductPages();
//     revalidatePath(`/admin/product/${productId}/edit`);

//     return success(SUCCESS_UPDATE);
//   } catch (error) {
//     console.error("Update product action failed:", error);
//     return failure(getErrorMessage(error));
//   }
// }

// export async function deleteProductAction(
//   _previousState: ProductActionState,
//   formData: FormData,
// ): Promise<ProductActionState> {
//   try {
//     await requireProductAdmin();

//     const productId = formData.get("productId");

//     if (typeof productId !== "string" || !productId.trim()) {
//       return failure("A valid product ID is required.");
//     }

//     await deleteProduct(productId);

//     revalidateProductPages();
//     revalidatePath(`/admin/product/${productId}/edit`);

//     return success(SUCCESS_DELETE);
//   } catch (error) {
//     console.error("Delete product action failed:", error);
//     return failure(getErrorMessage(error));
//   }
// }

"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/current-user";
import { createProduct } from "@/backend/services/product.service";
import { createProductSchema } from "@/backend/validators/product.validator";
import type { ProductActionState } from "@/backend/validators/product-action-state";

export type { ProductActionState } from "@/backend/validators/product-action-state";

const KNOWN_ERRORS = new Set([
  "Please sign in to continue.",
  "You are not authorized to manage products.",
  "A product with this slug already exists.",
  "One or more categories are invalid or inactive.",
  "One or more SKUs already exist.",
  "A category cannot be selected more than once.",
  "One or more categories are invalid or inactive.",
  "Please upload at least one product image.",
]);

async function requireProductAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Please sign in to continue.");
  }

  if (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN")) {
    throw new Error("You are not authorized to manage products.");
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && KNOWN_ERRORS.has(error.message)) {
    return error.message;
  }

  return "Unable to create the product. Please check the details and try again.";
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  try {
    await requireProductAdmin();

    const rawProduct = formData.get("product");

    if (typeof rawProduct !== "string") {
      return {
        success: false,
        message: "Invalid product submission.",
      };
    }

    let parsedProduct: unknown;

    try {
      parsedProduct = JSON.parse(rawProduct);
    } catch {
      return {
        success: false,
        message: "Product data must be valid JSON.",
      };
    }

    if (
      typeof parsedProduct !== "object" ||
      parsedProduct === null ||
      Array.isArray(parsedProduct)
    ) {
      return {
        success: false,
        message: "Invalid product submission.",
      };
    }

    // Never trust client-provided image URLs or metadata.
    const validation = createProductSchema.safeParse({
      ...parsedProduct,
      images: [],
    });

    if (!validation.success) {
      return {
        success: false,
        message: validation.error.issues
          .map((issue) => issue.message)
          .join(" "),
      };
    }

    const imageFiles: File[] = [];

    for (const entry of formData.getAll("images")) {
      if (!(entry instanceof File)) {
        return {
          success: false,
          message: "Invalid product image submission.",
        };
      }

      if (entry.size > 0) {
        imageFiles.push(entry);
      }
    }

    if (imageFiles.length === 0) {
      return {
        success: false,
        message: "Please upload at least one product image.",
      };
    }

    await createProduct(validation.data, imageFiles);

    revalidatePath("/admin/product");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Product created successfully.",
    };
  } catch (error) {
    console.error("Create product action failed:", error);

    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
