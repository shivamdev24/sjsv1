// "use client";

// import { useActionState, useMemo, useState } from "react";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   Check,
//   ImagePlus,
//   LoaderCircle,
//   Package,
//   Plus,
//   Save,
//   Trash2,
// } from "lucide-react";

// import { createProductAction } from "@/backend/action/product.action";

// import { initialProductActionState } from "@/backend/validators/product-action-state";

// type ProductType = "PHYSICAL" | "DIGITAL" | "SERVICE";
// type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

// type Variant = {
//   name: string;
//   sku: string;
//   price: string;
//   compareAtPrice: string;
//   stockQuantity: string;
//   trackInventory: boolean;
//   attributes: {
//     name: string;
//     value: string;
//   }[];
//   isDefault: boolean;
//   isActive: boolean;
// };

// type ProductImage = {
//   url: string;
//   altText: string;
// };

// const inputClass =
//   "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20";

// const labelClass = "mb-1.5 block text-sm font-medium";

// const initialVariant: Variant = {
//   name: "Default",
//   sku: "",
//   price: "",
//   compareAtPrice: "",
//   stockQuantity: "0",
//   trackInventory: true,
//   attributes: [],
//   isDefault: true,
//   isActive: true,
// };

// function createSlug(value: string) {
//   return value
//     .normalize("NFKD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "")
//     .slice(0, 200)
//     .replace(/-+$/g, "");
// }

// export default function NewProductPage() {
//   const [state, formAction, pending] = useActionState(
//     createProductAction,
//     initialProductActionState,
//   );

//   const [name, setName] = useState("");
//   const [slug, setSlug] = useState("");
//   const [slugEdited, setSlugEdited] = useState(false);
//   const [description, setDescription] = useState("");
//   const [type, setType] = useState<ProductType>("PHYSICAL");
//   const [status, setStatus] = useState<ProductStatus>("DRAFT");
//   const [images, setImages] = useState<ProductImage[]>([]);
//   const [attributesErrors, setAttributesErrors] = useState<string | null>(null);

//   const [variants, setVariants] = useState<Variant[]>([
//     {
//       name: "Default",
//       sku: "",
//       price: "",
//       compareAtPrice: "",
//       stockQuantity: "0",
//       trackInventory: true,
//       attributes: [],
//       isDefault: true,
//       isActive: true,
//     },
//   ]);

//   const productPayload = useMemo(() => {
//     const parsedVariants = variants.map((variant) => {
//       let attributes: Record<string, unknown> = {};

//       try {
//         const parsed: unknown = JSON.parse(variant.attributesJson);

//         if (
//           parsed === null ||
//           typeof parsed !== "object" ||
//           Array.isArray(parsed)
//         ) {
//           throw new Error("Attributes must be a JSON object.");
//         }

//         attributes = parsed as Record<string, unknown>;
//       } catch {
//         // Keep empty attributes here; validation is calculated separately.
//       }

//       return {
//         name: variant.name,
//         sku: variant.sku,
//         price: variant.price,
//         compareAtPrice: variant.compareAtPrice || null,
//         stockQuantity: type === "PHYSICAL" ? variant.stockQuantity : "0",
//         trackInventory: type === "PHYSICAL" ? variant.trackInventory : false,
//         attributes,
//         isDefault: variant.isDefault,
//         isActive: variant.isActive,
//       };
//     });

//     const variantsValid = variants.every((variant) => {
//       try {
//         const parsed: unknown = JSON.parse(variant.attributes[]);

//         return (
//           parsed !== null &&
//           typeof parsed === "object" &&
//           !Array.isArray(parsed)
//         );
//       } catch {
//         return false;
//       }
//     });

//     const validImages = images
//       .filter((image) => image.url.trim())
//       .map((image, position) => ({
//         url: image.url.trim(),
//         altText: image.altText.trim() || null,
//         position,
//       }));

//     return {
//       payload: {
//         name,
//         slug,
//         description,
//         type,
//         status,
//         categoryIds: [] as string[],
//         images: validImages,
//         variants: parsedVariants,
//       },
//       variantsValid,
//     };
//   }, [name, slug, description, type, status, variants, images]);

//   function updateVariant(index: number, changes: Partial<Variant>) {
//     setVariants((current) =>
//       current.map((variant, i) =>
//         i === index ? { ...variant, ...changes } : variant,
//       ),
//     );
//   }

//   function setDefaultVariant(index: number) {
//     setVariants((current) =>
//       current.map((variant, i) => ({
//         ...variant,
//         isDefault: i === index,
//       })),
//     );
//   }

//   function addVariant() {
//     setVariants((current) => [
//       ...current,
//       {
//         ...initialVariant,
//         name: `Variant ${current.length + 1}`,
//         sku: "",
//         isDefault: false,
//       },
//     ]);
//   }

//   function removeVariant(index: number) {
//     setVariants((current) => {
//       if (current.length <= 1) return current;

//       const next = current.filter((_, i) => i !== index);

//       if (!next.some((variant) => variant.isDefault)) {
//         next[0] = { ...next[0], isDefault: true };
//       }

//       return next;
//     });
//   }

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     setAttributesErrors(null);

//     if (!productPayload.variantsValid) {
//       event.preventDefault();
//       setAttributesErrors(
//         'Variant attributes must be valid JSON objects. Example: {"size":"Medium"}',
//       );
//       return;
//     }

//     const skus = variants.map((variant) => variant.sku.trim().toUpperCase());

//     if (new Set(skus).size !== skus.length) {
//       event.preventDefault();
//       setAttributesErrors("Each variant must have a unique SKU.");
//       return;
//     }

//     if (variants.filter((variant) => variant.isDefault).length !== 1) {
//       event.preventDefault();
//       setAttributesErrors("Select exactly one default variant.");
//     }
//   }

//   return (
//     <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div className="flex items-start gap-3">
//           <Link
//             href="/admin/product"
//             aria-label="Back to products"
//             className="mt-1 rounded-lg border p-2 transition hover:bg-muted"
//           >
//             <ArrowLeft className="size-4" />
//           </Link>

//           <div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground">
//               <Package className="size-4" />
//               Product catalog
//             </div>
//             <h1 className="mt-1 text-2xl font-semibold tracking-tight">
//               Create product
//             </h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               Add the product details, pricing, variants, and images.
//             </p>
//           </div>
//         </div>

//         <span className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium">
//           {status === "ACTIVE"
//             ? "Ready to publish"
//             : status === "ARCHIVED"
//               ? "Archived"
//               : "Draft"}
//         </span>
//       </div>

//       {state.message && (
//         <div
//           role="status"
//           className={`rounded-xl border p-4 text-sm ${
//             state.success
//               ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
//               : "border-destructive/30 bg-destructive/5 text-destructive"
//           }`}
//         >
//           <div className="flex items-start gap-2">
//             {state.success && <Check className="mt-0.5 size-4 shrink-0" />}
//             {state.message}
//           </div>
//         </div>
//       )}

//       <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
//         <input
//           type="hidden"
//           name="product"
//           value={JSON.stringify(productPayload.payload)}
//           readOnly
//         />

//         <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
//           <div className="space-y-6">
//             <section className="rounded-xl border bg-card p-5 sm:p-6">
//               <div className="mb-5">
//                 <h2 className="font-semibold">Basic information</h2>
//                 <p className="mt-1 text-sm text-muted-foreground">
//                   The main details customers will see.
//                 </p>
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className={labelClass} htmlFor="name">
//                     Product name <span className="text-destructive">*</span>
//                   </label>
//                   <input
//                     id="name"
//                     className={inputClass}
//                     value={name}
//                     onChange={(event) => {
//                       const nextName = event.target.value;
//                       setName(nextName);
//                       if (!slugEdited) setSlug(createSlug(nextName));
//                     }}
//                     placeholder="e.g. Natural Yellow Sapphire"
//                     minLength={2}
//                     maxLength={200}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className={labelClass} htmlFor="slug">
//                     URL slug <span className="text-destructive">*</span>
//                   </label>
//                   <div className="flex overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-ring/20">
//                     <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground">
//                       /products/
//                     </span>
//                     <input
//                       id="slug"
//                       className="min-w-0 flex-1 bg-background px-3 py-2.5 text-sm outline-none"
//                       value={slug}
//                       onChange={(event) => {
//                         setSlug(createSlug(event.target.value));
//                         setSlugEdited(true);
//                       }}
//                       placeholder="natural-yellow-sapphire"
//                       minLength={2}
//                       maxLength={200}
//                       required
//                     />
//                   </div>
//                   <p className="mt-1.5 text-xs text-muted-foreground">
//                     Use a unique, lowercase URL. You can edit the generated
//                     slug.
//                   </p>
//                 </div>

//                 <div>
//                   <label className={labelClass} htmlFor="description">
//                     Full description <span className="text-destructive">*</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     className={`${inputClass} min-h-36 resize-y`}
//                     value={description}
//                     onChange={(event) => setDescription(event.target.value)}
//                     placeholder="Describe the product, its features, materials, benefits, or service details..."
//                     required
//                   />
//                   <p className="mt-1 text-xs text-muted-foreground">
//                     Plain text for now. Your schema supports a full text
//                     description.
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="rounded-xl border bg-card p-5 sm:p-6">
//               <div className="mb-5">
//                 <h2 className="font-semibold">Product type</h2>
//                 <p className="mt-1 text-sm text-muted-foreground">
//                   This determines which inventory settings are available.
//                 </p>
//               </div>

//               <div className="grid gap-3 sm:grid-cols-3">
//                 {(
//                   [
//                     ["PHYSICAL", "Physical", "Shipped to a customer"],
//                     ["DIGITAL", "Digital", "Delivered online"],
//                     ["SERVICE", "Service", "A service or consultation"],
//                   ] as const
//                 ).map(([value, title, detail]) => (
//                   <button
//                     key={value}
//                     type="button"
//                     onClick={() => {
//                       setType(value);
//                       if (value !== "PHYSICAL") {
//                         setVariants((current) =>
//                           current.map((variant) => ({
//                             ...variant,
//                             stockQuantity: "0",
//                             trackInventory: false,
//                           })),
//                         );
//                       }
//                     }}
//                     className={`rounded-xl border p-4 text-left transition ${
//                       type === value
//                         ? "border-primary bg-primary/5 ring-1 ring-primary"
//                         : "hover:bg-muted/50"
//                     }`}
//                   >
//                     <span className="flex items-center justify-between gap-2 font-medium">
//                       {title}
//                       {type === value && (
//                         <Check className="size-4 text-primary" />
//                       )}
//                     </span>
//                     <span className="mt-1 block text-xs leading-5 text-muted-foreground">
//                       {detail}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </section>

//             <section className="rounded-xl border bg-card p-5 sm:p-6">
//               <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
//                 <div>
//                   <h2 className="font-semibold">Pricing and variants</h2>
//                   <p className="mt-1 text-sm text-muted-foreground">
//                     Add at least one variant. Each SKU must be unique.
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={addVariant}
//                   className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
//                 >
//                   <Plus className="size-4" />
//                   Add variant
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {variants.map((variant, index) => (
//                   <div
//                     key={index}
//                     className="space-y-4 rounded-xl border bg-muted/15 p-4"
//                   >
//                     <div className="flex flex-wrap items-center justify-between gap-2">
//                       <div className="flex items-center gap-2">
//                         <span className="flex size-7 items-center justify-center rounded-lg border bg-background text-xs font-semibold">
//                           {index + 1}
//                         </span>
//                         <span className="font-medium">
//                           {variant.name || "New variant"}
//                         </span>
//                         {variant.isDefault && (
//                           <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
//                             Default
//                           </span>
//                         )}
//                       </div>

//                       {variants.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeVariant(index)}
//                           aria-label={`Remove variant ${index + 1}`}
//                           className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
//                         >
//                           <Trash2 className="size-4" />
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid gap-4 sm:grid-cols-2">
//                       <div>
//                         <label className={labelClass}>Variant name</label>
//                         <input
//                           className={inputClass}
//                           value={variant.name}
//                           onChange={(event) =>
//                             updateVariant(index, { name: event.target.value })
//                           }
//                           placeholder="Default, 5 carat, Consultation..."
//                           maxLength={100}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={labelClass}>SKU</label>
//                         <input
//                           className={inputClass}
//                           value={variant.sku}
//                           onChange={(event) =>
//                             updateVariant(index, {
//                               sku: event.target.value.toUpperCase(),
//                             })
//                           }
//                           placeholder="GEM-YELLOW-001"
//                           maxLength={100}
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={labelClass}>Selling price (₹)</label>
//                         <input
//                           className={inputClass}
//                           type="number"
//                           min="0.01"
//                           step="0.01"
//                           value={variant.price}
//                           onChange={(event) =>
//                             updateVariant(index, { price: event.target.value })
//                           }
//                           placeholder="2500.00"
//                           required
//                         />
//                       </div>

//                       <div>
//                         <label className={labelClass}>
//                           Compare-at price (₹)
//                         </label>
//                         <input
//                           className={inputClass}
//                           type="number"
//                           min="0.01"
//                           step="0.01"
//                           value={variant.compareAtPrice}
//                           onChange={(event) =>
//                             updateVariant(index, {
//                               compareAtPrice: event.target.value,
//                             })
//                           }
//                           placeholder="Optional"
//                         />
//                         <p className="mt-1 text-xs text-muted-foreground">
//                           Must exceed the selling price.
//                         </p>
//                       </div>
//                     </div>

//                     <div>
//                       <label className={labelClass}>
//                         Variant attributes (JSON)
//                       </label>
//                       <textarea
//                         className={`${inputClass} min-h-20 font-mono text-xs`}
//                         value={variant.attributes}
//                         onChange={(event) =>
//                           updateVariant(index, {
//                             attributes: event.target.value,
//                           })
//                         }
//                         placeholder={'{"size":"Medium","weight":"5 carats"}'}
//                       />
//                       <p className="mt-1 text-xs text-muted-foreground">
//                         Optional. Use a JSON object for size, weight, format, or
//                         other options.
//                       </p>
//                     </div>

//                     {type === "PHYSICAL" && (
//                       <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
//                         <div>
//                           <label className={labelClass}>Stock quantity</label>
//                           <input
//                             className={inputClass}
//                             type="number"
//                             min="0"
//                             step="1"
//                             value={variant.stockQuantity}
//                             onChange={(event) =>
//                               updateVariant(index, {
//                                 stockQuantity: event.target.value,
//                               })
//                             }
//                             required
//                           />
//                         </div>

//                         <label className="flex items-center gap-3 self-center text-sm">
//                           <input
//                             type="checkbox"
//                             checked={variant.trackInventory}
//                             onChange={(event) =>
//                               updateVariant(index, {
//                                 trackInventory: event.target.checked,
//                               })
//                             }
//                             className="size-4 accent-primary"
//                           />
//                           Track inventory
//                         </label>
//                       </div>
//                     )}

//                     <div className="flex flex-wrap gap-5 border-t pt-4">
//                       <label className="flex items-center gap-2 text-sm">
//                         <input
//                           type="radio"
//                           name="defaultVariant"
//                           checked={variant.isDefault}
//                           onChange={() => setDefaultVariant(index)}
//                           className="size-4 accent-primary"
//                         />
//                         Default variant
//                       </label>

//                       <label className="flex items-center gap-2 text-sm">
//                         <input
//                           type="checkbox"
//                           checked={variant.isActive}
//                           onChange={(event) =>
//                             updateVariant(index, {
//                               isActive: event.target.checked,
//                             })
//                           }
//                           className="size-4 accent-primary"
//                         />
//                         Active variant
//                       </label>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {attributesErrors && (
//                 <p className="mt-4 text-sm text-destructive" role="alert">
//                   {attributesErrors}
//                 </p>
//               )}
//             </section>

//             <section className="rounded-xl border bg-card p-5 sm:p-6">
//               <div className="mb-5 flex items-center gap-3">
//                 <div className="rounded-lg bg-muted p-2">
//                   <ImagePlus className="size-5" />
//                 </div>
//                 <div>
//                   <h2 className="font-semibold">Product images</h2>
//                   <p className="text-sm text-muted-foreground">
//                     Add publicly accessible image URLs.
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 {images.map((image, index) => (
//                   <div
//                     key={index}
//                     className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[1fr_1fr_auto]"
//                   >
//                     <div>
//                       <label className={labelClass}>Image URL</label>
//                       <input
//                         className={inputClass}
//                         type="url"
//                         value={image.url}
//                         onChange={(event) =>
//                           setImages((current) =>
//                             current.map((item, i) =>
//                               i === index
//                                 ? { ...item, url: event.target.value }
//                                 : item,
//                             ),
//                           )
//                         }
//                         placeholder="https://example.com/image.jpg"
//                       />
//                     </div>
//                     <div>
//                       <label className={labelClass}>Alt text</label>
//                       <input
//                         className={inputClass}
//                         value={image.altText}
//                         onChange={(event) =>
//                           setImages((current) =>
//                             current.map((item, i) =>
//                               i === index
//                                 ? { ...item, altText: event.target.value }
//                                 : item,
//                             ),
//                           )
//                         }
//                         maxLength={200}
//                         placeholder="Describe the image"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setImages((current) =>
//                           current.filter((_, i) => i !== index),
//                         )
//                       }
//                       aria-label={`Remove image ${index + 1}`}
//                       className="self-end rounded-lg p-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
//                     >
//                       <Trash2 className="size-4" />
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setImages((current) => [
//                       ...current,
//                       { url: "", altText: "" },
//                     ])
//                   }
//                   className="inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium hover:bg-muted"
//                 >
//                   <Plus className="size-4" />
//                   Add image URL
//                 </button>
//               </div>
//             </section>
//           </div>

//           <aside className="space-y-6 lg:sticky lg:top-6">
//             <section className="rounded-xl border bg-card p-5">
//               <h2 className="font-semibold">Publishing</h2>
//               <p className="mt-1 text-sm text-muted-foreground">
//                 Choose the product&apos;s visibility status.
//               </p>

//               <label className={`${labelClass} mt-4`} htmlFor="status">
//                 Product status
//               </label>
//               <select
//                 id="status"
//                 className={inputClass}
//                 value={status}
//                 onChange={(event) =>
//                   setStatus(event.target.value as ProductStatus)
//                 }
//               >
//                 <option value="DRAFT">Draft</option>
//                 <option value="ACTIVE">Active</option>
//                 <option value="ARCHIVED">Archived</option>
//               </select>

//               <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
//                 {status === "ACTIVE"
//                   ? "This product will be created with Active status. Ensure its details are ready for customers."
//                   : status === "ARCHIVED"
//                     ? "This product will be created as Archived."
//                     : "Save as a draft while you finish preparing the product."}
//               </div>

//               <button
//                 type="submit"
//                 disabled={pending}
//                 className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {pending ? (
//                   <LoaderCircle className="size-4 animate-spin" />
//                 ) : (
//                   <Save className="size-4" />
//                 )}
//                 {pending ? "Creating product..." : "Create product"}
//               </button>

//               <Link
//                 href="/admin/product"
//                 className="mt-3 block rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition hover:bg-muted"
//               >
//                 Cancel
//               </Link>
//             </section>

//             <section className="rounded-xl border bg-card p-5">
//               <h2 className="font-semibold">Product checklist</h2>
//               <div className="mt-4 space-y-3 text-sm">
//                 {[
//                   ["Product name", name.trim().length >= 2],
//                   ["URL slug", slug.trim().length >= 2],
//                   ["Description", description.trim().length > 0],
//                   [
//                     "Variant SKU",
//                     variants.every((v) => v.sku.trim().length > 0),
//                   ],
//                   [
//                     "Valid price",
//                     variants.every((v) => {
//                       const price = Number(v.price);
//                       const compare = v.compareAtPrice
//                         ? Number(v.compareAtPrice)
//                         : null;
//                       return (
//                         Number.isFinite(price) &&
//                         price > 0 &&
//                         Math.round(price * 100) === price * 100 &&
//                         (compare === null ||
//                           (compare > price &&
//                             Math.round(compare * 100) === compare * 100))
//                       );
//                     }),
//                   ],
//                 ].map(([label, complete]) => (
//                   <div key={String(label)} className="flex items-center gap-2">
//                     <span
//                       className={`flex size-5 items-center justify-center rounded-full ${
//                         complete
//                           ? "bg-emerald-500/10 text-emerald-600"
//                           : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {complete ? (
//                         <Check className="size-3.5" />
//                       ) : (
//                         <span className="size-1.5 rounded-full bg-current" />
//                       )}
//                     </span>
//                     <span
//                       className={
//                         complete ? "text-foreground" : "text-muted-foreground"
//                       }
//                     >
//                       {String(label)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           </aside>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  LoaderCircle,
  Package,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import { createProductAction } from "@/backend/action/product.action";

import { initialProductActionState } from "@/backend/validators/product-action-state";

type ProductType = "PHYSICAL" | "DIGITAL" | "SERVICE";
type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

type Variant = {
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  trackInventory: boolean;
  attributes: {
    name: string;
    value: string;
  }[];
  isDefault: boolean;
  isActive: boolean;
};

type ProductImage = {
  url: string;
  altText: string;
};

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20";

const labelClass = "mb-1.5 block text-sm font-medium";

const initialVariant: Variant = {
  name: "Default",
  sku: "",
  price: "",
  compareAtPrice: "",
  stockQuantity: "0",
  trackInventory: true,
  attributes: [],
  isDefault: true,
  isActive: true,
};

function createSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200)
    .replace(/-+$/g, "");
}

export default function NewProductPage() {
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialProductActionState,
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ProductType>("PHYSICAL");
  const [status, setStatus] = useState<ProductStatus>("DRAFT");
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imageAltTexts, setImageAltTexts] = useState<string[]>([]);
  const [attributesErrors, setAttributesErrors] = useState<string | null>(null);

  const [variants, setVariants] = useState<Variant[]>([
    {
      name: "Default",
      sku: "",
      price: "",
      compareAtPrice: "",
      stockQuantity: "0",
      trackInventory: true,
      attributes: [],
      isDefault: true,
      isActive: true,
    },
  ]);

  const MAX_IMAGES = 5;
  const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 5 MB per image
  const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 25 MB total

  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  const productPayload = useMemo(() => {
    const parsedVariants = variants.map((variant) => {
      const attributes = Object.fromEntries(
        variant.attributes
          .filter(
            (attribute) => attribute.name.trim() && attribute.value.trim(),
          )
          .map((attribute) => [attribute.name.trim(), attribute.value.trim()]),
      );

      return {
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice || null,
        stockQuantity: type === "PHYSICAL" ? variant.stockQuantity : "0",
        trackInventory: type === "PHYSICAL" ? variant.trackInventory : false,
        attributes,
        isDefault: variant.isDefault,
        isActive: variant.isActive,
      };
    });

    // Each attribute row must have both a name and a value, or both be empty.
    const attributesValid = variants.every((variant) =>
      variant.attributes.every((attribute) => {
        const hasName = attribute.name.trim().length > 0;
        const hasValue = attribute.value.trim().length > 0;
        return hasName === hasValue;
      }),
    );

    // const validImages = images
    //   .filter((image) => image.url.trim())
    //   .map((image, position) => ({
    //     url: image.url.trim(),
    //     altText: image.altText.trim() || null,
    //     position,
    //   }));

    return {
      payload: {
        name,
        slug,
        description,
        type,
        status,
        categoryIds: [] as string[],
        images: [],
        variants: parsedVariants,
      },
      attributesValid,
    };
  }, [name, slug, description, type, status, variants]);

  function updateVariant(index: number, changes: Partial<Variant>) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, ...changes } : variant,
      ),
    );
  }

  function setDefaultVariant(index: number) {
    setVariants((current) =>
      current.map((variant, i) => ({
        ...variant,
        isDefault: i === index,
      })),
    );
  }

  function addVariant() {
    setVariants((current) => [
      ...current,
      {
        ...initialVariant,
        name: `Variant ${current.length + 1}`,
        sku: "",
        isDefault: false,
      },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((current) => {
      if (current.length <= 1) return current;

      const next = current.filter((_, i) => i !== index);

      if (!next.some((variant) => variant.isDefault)) {
        next[0] = { ...next[0], isDefault: true };
      }

      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setAttributesErrors(null);

    if (!productPayload.attributesValid) {
      event.preventDefault();
      setAttributesErrors(
        "For each attribute, enter both a name and a value, or remove the empty row.",
      );
      return;
    }
    if (selectedImageFiles.length === 0) {
      event.preventDefault();
      setAttributesErrors("Please select at least one product image.");
      return;
    }

    const skus = variants.map((variant) => variant.sku.trim().toUpperCase());

    if (new Set(skus).size !== skus.length) {
      event.preventDefault();
      setAttributesErrors("Each variant must have a unique SKU.");
      return;
    }

    if (variants.filter((variant) => variant.isDefault).length !== 1) {
      event.preventDefault();
      setAttributesErrors("Select exactly one default variant.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/product"
            aria-label="Back to products"
            className="mt-1 rounded-lg border p-2 transition hover:bg-muted"
          >
            <ArrowLeft className="size-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="size-4" />
              Product catalog
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Create product
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add the product details, pricing, variants, and images.
            </p>
          </div>
        </div>

        <span className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium">
          {status === "ACTIVE"
            ? "Ready to publish"
            : status === "ARCHIVED"
              ? "Archived"
              : "Draft"}
        </span>
      </div>

      {state.message && (
        <div
          role="status"
          className={`rounded-xl border p-4 text-sm ${
            state.success
              ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          <div className="flex items-start gap-2">
            {state.success && <Check className="mt-0.5 size-4 shrink-0" />}
            {state.message}
          </div>
        </div>
      )}

      <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
        <input
          type="hidden"
          name="product"
          value={JSON.stringify(productPayload.payload)}
          readOnly
        />

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-xl border bg-card p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-semibold">Basic information</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The main details customers will see.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="name">
                    Product name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    className={inputClass}
                    value={name}
                    onChange={(event) => {
                      const nextName = event.target.value;
                      setName(nextName);
                      if (!slugEdited) setSlug(createSlug(nextName));
                    }}
                    placeholder="e.g. Natural Yellow Sapphire"
                    minLength={2}
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="slug">
                    URL slug <span className="text-destructive">*</span>
                  </label>
                  <div className="flex overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-ring/20">
                    <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground">
                      /products/
                    </span>
                    <input
                      id="slug"
                      className="min-w-0 flex-1 bg-background px-3 py-2.5 text-sm outline-none"
                      value={slug}
                      onChange={(event) => {
                        setSlug(createSlug(event.target.value));
                        setSlugEdited(true);
                      }}
                      placeholder="natural-yellow-sapphire"
                      minLength={2}
                      maxLength={200}
                      required
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Use a unique, lowercase URL. You can edit the generated
                    slug.
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor="description">
                    Full description <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="description"
                    className={`${inputClass} min-h-36 resize-y`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe the product, its features, materials, benefits, or service details..."
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Plain text for now. Your schema supports a full text
                    description.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5 sm:p-6">
              <div className="mb-5">
                <h2 className="font-semibold">Product type</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This determines which inventory settings are available.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["PHYSICAL", "Physical", "Shipped to a customer"],
                    ["DIGITAL", "Digital", "Delivered online"],
                    ["SERVICE", "Service", "A service or consultation"],
                  ] as const
                ).map(([value, title, detail]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setType(value);
                      if (value !== "PHYSICAL") {
                        setVariants((current) =>
                          current.map((variant) => ({
                            ...variant,
                            stockQuantity: "0",
                            trackInventory: false,
                          })),
                        );
                      }
                    }}
                    className={`rounded-xl border p-4 text-left transition ${
                      type === value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2 font-medium">
                      {title}
                      {type === value && (
                        <Check className="size-4 text-primary" />
                      )}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {detail}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-xl border bg-card p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Pricing and variants</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add at least one variant. Each SKU must be unique.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
                >
                  <Plus className="size-4" />
                  Add variant
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-xl border bg-muted/15 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg border bg-background text-xs font-semibold">
                          {index + 1}
                        </span>
                        <span className="font-medium">
                          {variant.name || "New variant"}
                        </span>
                        {variant.isDefault && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Default
                          </span>
                        )}
                      </div>

                      {variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          aria-label={`Remove variant ${index + 1}`}
                          className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Variant name</label>
                        <input
                          className={inputClass}
                          value={variant.name}
                          onChange={(event) =>
                            updateVariant(index, { name: event.target.value })
                          }
                          placeholder="Default, 5 carat, Consultation..."
                          maxLength={100}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>SKU</label>
                        <input
                          className={inputClass}
                          value={variant.sku}
                          onChange={(event) =>
                            updateVariant(index, {
                              sku: event.target.value.toUpperCase(),
                            })
                          }
                          placeholder="GEM-YELLOW-001"
                          maxLength={100}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Selling price (₹)</label>
                        <input
                          className={inputClass}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={variant.price}
                          onChange={(event) =>
                            updateVariant(index, { price: event.target.value })
                          }
                          placeholder="2500.00"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>
                          Compare-at price (₹)
                        </label>
                        <input
                          className={inputClass}
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={variant.compareAtPrice}
                          onChange={(event) =>
                            updateVariant(index, {
                              compareAtPrice: event.target.value,
                            })
                          }
                          placeholder="Optional"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Must exceed the selling price.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className={labelClass}>Variant attributes</label>
                        <p className="text-xs text-muted-foreground">
                          Optional details such as size, weight, material, or
                          format.
                        </p>
                      </div>

                      {variant.attributes.map((attribute, attributeIndex) => (
                        <div
                          key={attributeIndex}
                          className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                        >
                          <input
                            className={inputClass}
                            aria-label={`Variant ${index + 1} attribute ${attributeIndex + 1} name`}
                            value={attribute.name}
                            onChange={(event) => {
                              const attributes = [...variant.attributes];
                              attributes[attributeIndex] = {
                                ...attribute,
                                name: event.target.value,
                              };
                              updateVariant(index, { attributes });
                            }}
                            placeholder="Attribute name (e.g. Size)"
                            maxLength={100}
                          />
                          <input
                            className={inputClass}
                            aria-label={`Variant ${index + 1} attribute ${attributeIndex + 1} value`}
                            value={attribute.value}
                            onChange={(event) => {
                              const attributes = [...variant.attributes];
                              attributes[attributeIndex] = {
                                ...attribute,
                                value: event.target.value,
                              };
                              updateVariant(index, { attributes });
                            }}
                            placeholder="Value (e.g. 8mm)"
                            maxLength={200}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateVariant(index, {
                                attributes: variant.attributes.filter(
                                  (_, i) => i !== attributeIndex,
                                ),
                              })
                            }
                            aria-label={`Remove attribute ${attributeIndex + 1} from variant ${index + 1}`}
                            className="inline-flex items-center justify-center rounded-lg border px-3 py-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          updateVariant(index, {
                            attributes: [
                              ...variant.attributes,
                              { name: "", value: "" },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                      >
                        <Plus className="size-4" />
                        Add attribute
                      </button>
                    </div>

                    {type === "PHYSICAL" && (
                      <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Stock quantity</label>
                          <input
                            className={inputClass}
                            type="number"
                            min="0"
                            step="1"
                            value={variant.stockQuantity}
                            onChange={(event) =>
                              updateVariant(index, {
                                stockQuantity: event.target.value,
                              })
                            }
                            required
                          />
                        </div>

                        <label className="flex items-center gap-3 self-center text-sm">
                          <input
                            type="checkbox"
                            checked={variant.trackInventory}
                            onChange={(event) =>
                              updateVariant(index, {
                                trackInventory: event.target.checked,
                              })
                            }
                            className="size-4 accent-primary"
                          />
                          Track inventory
                        </label>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-5 border-t pt-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="defaultVariant"
                          checked={variant.isDefault}
                          onChange={() => setDefaultVariant(index)}
                          className="size-4 accent-primary"
                        />
                        Default variant
                      </label>

                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={variant.isActive}
                          onChange={(event) =>
                            updateVariant(index, {
                              isActive: event.target.checked,
                            })
                          }
                          className="size-4 accent-primary"
                        />
                        Active variant
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {attributesErrors && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  {attributesErrors}
                </p>
              )}
            </section>

            <section className="rounded-xl border bg-card p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <ImagePlus className="size-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Product images</h2>
                  <p className="text-sm text-muted-foreground">
                    Select JPEG, PNG, WebP, or AVIF images (maximum 5 MB each).
                  </p>
                </div>
              </div>

              <input
                type="file"
                name="images"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                required
                disabled={pending}
                onChange={(event) => {
                  const files = Array.from(event.target.files ?? []);

                  const showError = (message: string) => {
                    setAttributesErrors(message);
                    setSelectedImageFiles([]);
                    setImageAltTexts([]);
                    event.target.value = "";
                  };

                  if (files.length > MAX_IMAGES) {
                    showError(
                      `You can upload a maximum of ${MAX_IMAGES} images.`,
                    );
                    return;
                  }

                  const invalidType = files.find(
                    (file) => !ALLOWED_IMAGE_TYPES.includes(file.type),
                  );

                  if (invalidType) {
                    showError(
                      `${invalidType.name} is not a supported image type.`,
                    );
                    return;
                  }

                  const oversizedFile = files.find(
                    (file) => file.size > MAX_IMAGE_SIZE,
                  );

                  if (oversizedFile) {
                    showError(`${oversizedFile.name} exceeds the 1 MB limit.`);
                    return;
                  }

                  const totalSize = files.reduce(
                    (total, file) => total + file.size,
                    0,
                  );

                  if (totalSize > MAX_TOTAL_SIZE) {
                    showError(
                      "The total size of all images must not exceed 5 MB.",
                    );
                    return;
                  }

                  setAttributesErrors("");
                  setSelectedImageFiles(files);
                  setImageAltTexts(files.map(() => ""));
                }}
                className={inputClass}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Maximum 5 images, 5 MB per image, and 25 MB combined. Supported
                formats: JPEG, PNG, WebP, AVIF.
              </p>

              {selectedImageFiles.length > 0 && (
                <div className="mt-4 space-y-3">
                  {selectedImageFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="rounded-lg border p-3"
                    >
                      <p className="text-sm font-medium break-all">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                      <label className={`${labelClass} mt-3`}>Alt text</label>
                      <input
                        className={inputClass}
                        value={imageAltTexts[index] ?? ""}
                        maxLength={200}
                        placeholder="Describe the image"
                        onChange={(event) => {
                          const value = event.target.value;

                          setImageAltTexts((current) =>
                            current.map((text, i) =>
                              i === index ? value : text,
                            ),
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <section className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold">Publishing</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose the product&apos;s visibility status.
              </p>

              <label className={`${labelClass} mt-4`} htmlFor="status">
                Product status
              </label>
              <select
                id="status"
                className={inputClass}
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ProductStatus)
                }
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>

              <div className="mt-4 rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                {status === "ACTIVE"
                  ? "This product will be created with Active status. Ensure its details are ready for customers."
                  : status === "ARCHIVED"
                    ? "This product will be created as Archived."
                    : "Save as a draft while you finish preparing the product."}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                {pending ? "Creating product..." : "Create product"}
              </button>

              <Link
                href="/admin/product"
                className="mt-3 block rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition hover:bg-muted"
              >
                Cancel
              </Link>
            </section>

            <section className="rounded-xl border bg-card p-5">
              <h2 className="font-semibold">Product checklist</h2>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  ["Product name", name.trim().length >= 2],
                  ["URL slug", slug.trim().length >= 2],
                  ["Description", description.trim().length > 0],
                  [
                    "Variant SKU",
                    variants.every((v) => v.sku.trim().length > 0),
                  ],
                  [
                    "Valid price",
                    variants.every((v) => {
                      const price = Number(v.price);
                      const compare = v.compareAtPrice
                        ? Number(v.compareAtPrice)
                        : null;
                      return (
                        Number.isFinite(price) &&
                        price > 0 &&
                        Math.round(price * 100) === price * 100 &&
                        (compare === null ||
                          (compare > price &&
                            Math.round(compare * 100) === compare * 100))
                      );
                    }),
                  ],
                ].map(([label, complete]) => (
                  <div key={String(label)} className="flex items-center gap-2">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full ${
                        complete
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {complete ? (
                        <Check className="size-3.5" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <span
                      className={
                        complete ? "text-foreground" : "text-muted-foreground"
                      }
                    >
                      {String(label)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
