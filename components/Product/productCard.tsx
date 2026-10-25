// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowUpRight, Package } from "lucide-react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// // Matches the product shape from your table
// export interface DynamicProductData {
//   id: string;
//   name: string;
//   slug?: string;
//   type?: string;
//   status?: string;
//   description?: string | null;
//   subtitle?: string | null;
//   price?: number | string | null;
//   images?: {
//     id: string;
//     url: string;
//     altText?: string | null;
//   }[];
//   variants?: {
//     id?: string;
//     price?: number | string;
//   }[];
//   createdAt?: string | Date;
// }

// export interface ProductCardProps {
//   /** Pass the raw product object from your DB/API directly */
//   product?: DynamicProductData;

//   /** Or pass/override individual props anywhere else */
//   title?: string;
//   subtitle?: string;
//   description?: string;
//   price?: number | string;
//   currency?: string;
//   badgeText?: string;
//   images?: { id?: string; url: string; altText?: string | null }[] | string[];
//   href?: string;
//   ctaText?: string;
//   brandLogo?: React.ReactNode;
//   onBuyNow?: (product?: DynamicProductData) => void;
//   size?: "default" | "sm";
//   className?: string;
// }

// export function ProductCard({
//   product,
//   title,
//   subtitle,
//   description,
//   price,
//   currency = "$",
//   badgeText,
//   images,
//   href,
//   ctaText = "Buy Now",
//   brandLogo,
//   onBuyNow,
//   size = "default",
//   className,
// }: ProductCardProps) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   // 1. Resolve Dynamic Data (Props override `product` fields if both are given)
//   const resolvedTitle = title ?? product?.name ?? "Untitled Product";

//   const resolvedSubtitle =
//     subtitle ??
//     product?.subtitle ??
//     (product?.type
//       ? `${product.type.charAt(0).toUpperCase()}${product.type.slice(1).toLowerCase()}`
//       : product?.slug
//         ? `/${product.slug}`
//         : "Featured Collection");

//   const resolvedDescription =
//     description ??
//     product?.description ??
//     (product?.variants
//       ? `Available in ${product.variants.length} variant${
//           product.variants.length === 1 ? "" : "s"
//         }.`
//       : "Step back into classic style with durable craftsmanship.");

//   const resolvedPrice =
//     price ?? product?.price ?? product?.variants?.[0]?.price ?? 111;

//   const resolvedBadge =
//     badgeText !== undefined ? badgeText : (product?.status ?? "Best Seller");

//   const resolvedHref =
//     href ?? (product?.slug ? `/products/${product.slug}` : undefined);

//   // Normalize images array whether string[] or { url, altText }[]
//   const rawImages = images ?? product?.images ?? [];
//   const normalizedImages = rawImages.map((img, idx) =>
//     typeof img === "string"
//       ? { id: String(idx), url: img, altText: resolvedTitle }
//       : {
//           id: img.id ?? String(idx),
//           url: img.url,
//           altText: img.altText || resolvedTitle,
//         },
//   );

//   const isSmall = size === "sm";

//   return (
//     <Card
//       className={cn(
//         "w-full border-none bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all",
//         isSmall
//           ? "max-w-[260px] rounded-[26px] p-2.5"
//           : "max-w-[350px] rounded-[34px] p-3.5",
//         className,
//       )}
//     >
//       {/* Top Image Container */}
//       <div
//         className={cn(
//           "relative aspect-square w-full overflow-hidden bg-slate-100",
//           isSmall ? "rounded-[18px]" : "rounded-[24px]",
//         )}
//       >
//         {normalizedImages.length > 0 ? (
//           <Image
//             src={normalizedImages[activeIndex]?.url || normalizedImages[0].url}
//             alt={normalizedImages[activeIndex]?.altText || resolvedTitle}
//             fill
//             unoptimized
//             className="object-cover transition-all duration-500 ease-out hover:scale-105"
//           />
//         ) : (
//           <div className="flex size-full flex-col items-center justify-center gap-2 text-slate-400">
//             <Package className={isSmall ? "size-8" : "size-12"} />
//             <span className="text-xs font-medium">No image</span>
//           </div>
//         )}

//         {/* Bottom contrast gradient for dots */}
//         {normalizedImages.length > 1 && (
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
//         )}

//         {/* Top-Left Frosted Badge */}
//         {resolvedBadge && (
//           <Badge
//             variant="secondary"
//             className={cn(
//               "absolute left-3 top-3 rounded-full border-none bg-black/25 font-medium capitalize text-white backdrop-blur-md hover:bg-black/35",
//               isSmall ? "px-2.5 py-1 text-[10px]" : "px-3.5 py-1.5 text-xs",
//             )}
//           >
//             {resolvedBadge.toLowerCase()}
//           </Badge>
//         )}

//         {/* Top-Right Brand Logo Circle */}
//         <div
//           className={cn(
//             "absolute right-3 top-3 flex items-center justify-center rounded-full bg-white shadow-sm",
//             isSmall ? "size-8" : "size-10",
//           )}
//         >
//           {brandLogo ? (
//             brandLogo
//           ) : (
//             <svg
//               viewBox="0 0 24 24"
//               className={cn("fill-black", isSmall ? "size-4" : "size-6")}
//               aria-label="Brand Logo"
//             >
//               <path d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.486 0 1.052-.128 1.687-.383L21 8.719z" />
//             </svg>
//           )}
//         </div>

//         {/* Bottom Pagination Dots */}
//         {normalizedImages.length > 1 && (
//           <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
//             {normalizedImages.slice(0, 6).map((img, index) => (
//               <button
//                 key={img.id}
//                 type="button"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setActiveIndex(index);
//                 }}
//                 aria-label={`View image ${index + 1}`}
//                 className={cn(
//                   "h-1.5 w-1.5 rounded-full transition-all duration-300",
//                   activeIndex === index
//                     ? "scale-110 bg-white"
//                     : "bg-white/50 hover:bg-white/80",
//                 )}
//               />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Product Information */}
//       <CardContent
//         className={cn("px-2", isSmall ? "pb-3.5 pt-3.5" : "pb-5 pt-5")}
//       >
//         <h3
//           className={cn(
//             "truncate font-bold tracking-tight text-neutral-950",
//             isSmall ? "text-base" : "text-[20px]",
//           )}
//         >
//           {resolvedTitle}
//         </h3>
//         <p
//           className={cn(
//             "mt-0.5 truncate font-semibold text-neutral-400",
//             isSmall ? "text-xs" : "text-[15px]",
//           )}
//         >
//           {resolvedSubtitle}
//         </p>
//         <p
//           className={cn(
//             "mt-2 line-clamp-2 font-medium leading-relaxed text-neutral-400",
//             isSmall ? "text-xs" : "text-[14px]",
//           )}
//         >
//           {resolvedDescription}
//         </p>
//       </CardContent>

//       {/* Price & CTA Footer */}
//       <CardFooter className="flex items-center justify-between px-2 pb-1.5 pt-0">
//         <div
//           className={cn(
//             "rounded-full bg-neutral-100",
//             isSmall ? "px-3.5 py-1.5" : "px-5 py-2.5",
//           )}
//         >
//           <span
//             className={cn(
//               "font-bold tracking-tight text-neutral-950",
//               isSmall ? "text-sm" : "text-[18px]",
//             )}
//           >
//             {currency}
//             {resolvedPrice}
//           </span>
//         </div>

//         {resolvedHref && !onBuyNow ? (
//           <Button
//             className={cn(
//               "h-auto rounded-full bg-black font-semibold text-white transition-transform hover:bg-neutral-800 active:scale-95",
//               isSmall
//                 ? "py-1.5 pl-3.5 pr-1.5 text-xs"
//                 : "py-2 pl-5 pr-2 text-[15px]",
//             )}
//           >
//             <Link href={resolvedHref}>
//               <span>{ctaText}</span>
//               <span
//                 className={cn(
//                   "ml-2 flex items-center justify-center rounded-full bg-white text-black",
//                   isSmall ? "size-5" : "size-7",
//                 )}
//               >
//                 <ArrowUpRight
//                   className={
//                     isSmall ? "size-3 stroke-[2.5]" : "size-4 stroke-[2.5]"
//                   }
//                 />
//               </span>
//             </Link>
//           </Button>
//         ) : (
//           <Button
//             onClick={() => onBuyNow?.(product)}
//             className={cn(
//               "h-auto rounded-full bg-black font-semibold text-white transition-transform hover:bg-neutral-800 active:scale-95",
//               isSmall
//                 ? "py-1.5 pl-3.5 pr-1.5 text-xs"
//                 : "py-2 pl-5 pr-2 text-[15px]",
//             )}
//           >
//             <span>{ctaText}</span>
//             <span
//               className={cn(
//                 "ml-2 flex items-center justify-center rounded-full bg-white text-black",
//                 isSmall ? "size-5" : "size-7",
//               )}
//             >
//               <ArrowUpRight
//                 className={
//                   isSmall ? "size-3 stroke-[2.5]" : "size-4 stroke-[2.5]"
//                 }
//               />
//             </span>
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package, ShoppingBag, Check } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DynamicProductData {
  id: string;
  name: string;
  slug?: string;
  type?: string;
  status?: string;
  description?: string | null;
  subtitle?: string | null;
  price?: number | string | { toString(): string } | null;
  images?: {
    id?: string;
    url: string;
    altText?: string | null;
  }[];
  variants?: {
    id?: string;
    price?: number | string | { toString(): string } | null;
  }[];
  createdAt?: string | Date;
}

interface ProductImage {
  id?: string;
  url: string;
  altText?: string | null;
}

export interface ProductCardProps {
  product?: DynamicProductData;
  title?: string;
  subtitle?: string;
  description?: string;
  price?: number | string;
  currency?: string;
  badgeText?: string;
  images?: ProductImage[] | string[];
  href?: string;
  ctaText?: string;
  brandLogo?: React.ReactNode;
  onBuyNow?: (product?: DynamicProductData) => void;
  onAddToCart?: (product?: DynamicProductData) => void;
  size?: "default" | "sm";
  className?: string;
}

export function ProductCard({
  product,
  title,
  subtitle,
  description,
  price,
  currency = "₹",
  badgeText,
  images,
  href,
  ctaText = "Add to Bag",
  brandLogo,
  onBuyNow,
  onAddToCart,
  size = "default",
  className,
}: ProductCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const resolvedTitle = title ?? product?.name ?? "Untitled Product";

  const resolvedSubtitle =
    subtitle ?? product?.subtitle ?? product?.type ?? "Featured Product";

  const resolvedDescription =
    description ??
    product?.description ??
    "Thoughtfully selected for your everyday needs.";

  const rawPrice =
    price ?? product?.price ?? product?.variants?.[0]?.price ?? 0;

  const resolvedPrice =
    typeof rawPrice === "object" && rawPrice !== null
      ? rawPrice.toString()
      : String(rawPrice);

  const resolvedBadge = badgeText !== undefined ? badgeText : product?.status;

  const resolvedHref =
    href ?? (product?.slug ? `/products/${product.slug}` : undefined);

  const normalizedImages: ProductImage[] = (
    images ??
    product?.images ??
    []
  ).map((img, index) =>
    typeof img === "string"
      ? { id: String(index), url: img, altText: resolvedTitle }
      : {
          ...img,
          id: img.id ?? String(index),
          altText: img.altText || resolvedTitle,
        },
  );

  const isSmall = size === "sm";

  function handleAddToCart() {
    if (onAddToCart) {
      onAddToCart(product);
    } else if (onBuyNow) {
      onBuyNow(product);
    } else {
      return;
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Card
      className={cn(
        "group w-full overflow-hidden border border-neutral-200/70",
        "bg-white p-2.5 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-neutral-300",
        "hover:shadow-xl hover:shadow-black/[0.06]",
        isSmall ? "max-w-[280px] rounded-2xl" : "max-w-[380px] rounded-3xl p-3",
        className,
      )}
    >
      {/* Product image */}
      <div
        className={cn(
          "relative isolate w-full overflow-hidden bg-neutral-100",
          isSmall ? "aspect-[4/4.5] rounded-xl" : "aspect-[4/4.5] rounded-2xl",
        )}
      >
        {normalizedImages.length > 0 ? (
          <Image
            src={normalizedImages[activeIndex]?.url ?? normalizedImages[0].url}
            alt={normalizedImages[activeIndex]?.altText ?? resolvedTitle}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 text-neutral-400">
            <Package className="size-10" />
            <span className="text-xs">Image coming soon</span>
          </div>
        )}

        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/[0.03]" />

        {resolvedBadge && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 shadow-sm backdrop-blur-md hover:bg-white"
          >
            {resolvedBadge.replace(/_/g, " ")}
          </Badge>
        )}

        {/* Product details shortcut */}
        {resolvedHref && (
          <Link
            href={resolvedHref}
            aria-label={`View ${resolvedTitle}`}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur-md transition-transform hover:scale-105"
          >
            <ArrowUpRight className="size-4" />
          </Link>
        )}

        {/* Image selector */}
        {normalizedImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1.5 backdrop-blur-sm">
            {normalizedImages.slice(0, 6).map((img, index) => (
              <button
                key={img.id ?? index}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeIndex === index}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  activeIndex === index
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product information */}
      <CardContent className={cn("px-1", isSmall ? "pb-3 pt-4" : "pb-4 pt-5")}>
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          {resolvedSubtitle}
        </p>

        <h3
          className={cn(
            "line-clamp-1 font-semibold tracking-tight text-neutral-950",
            isSmall ? "text-sm" : "text-base",
          )}
        >
          {resolvedTitle}
        </h3>

        <p
          className={cn(
            "mt-1.5 line-clamp-2 leading-relaxed text-neutral-500",
            isSmall ? "text-xs" : "text-[13px]",
          )}
        >
          {resolvedDescription}
        </p>
      </CardContent>

      {/* Price and cart action */}
      <CardFooter className="flex items-center justify-between gap-2 px-1 pb-1 pt-0">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
            Price
          </p>
          <p
            className={cn(
              "mt-0.5 font-bold tracking-tight text-neutral-950",
              isSmall ? "text-base" : "text-lg",
            )}
          >
            {currency}
            {Number.isFinite(Number(resolvedPrice))
              ? Number(resolvedPrice).toLocaleString("en-IN")
              : resolvedPrice}
          </p>
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={!onAddToCart && !onBuyNow}
          className={cn(
            "shrink-0 rounded-full font-semibold transition-all",
            "active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-50",
            isSmall ? "h-9 gap-1.5 px-3 text-xs" : "h-10 gap-2 px-4 text-sm",
            added
              ? "bg-emerald-700 text-white hover:bg-emerald-700"
              : "bg-neutral-950 text-white hover:bg-neutral-800",
          )}
        >
          {added ? (
            <Check className="size-4" />
          ) : (
            <ShoppingBag className="size-4" />
          )}
          <span>{added ? "Added" : ctaText}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
