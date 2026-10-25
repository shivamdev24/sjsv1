"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, Plus, LayoutGrid, List, Eye } from "lucide-react";
import {
  ProductCard,
  DynamicProductData,
} from "@/components/Product/productCard";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductCatalogSectionProps {
  products: (DynamicProductData & {
    slug: string;
    type: string;
    status: string;
    createdAt: string | Date;
    images: { id: string; url: string; altText?: string | null }[];
    variants: { id?: string; price?: number | string }[];
  })[];
  StatusBadge: React.ComponentType<{ status: string }>;
}

export function ProductCatalogSection({
  products,
  StatusBadge,
}: ProductCatalogSectionProps) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header with View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
            <Package className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Product catalog</h2>
            <p className="text-sm text-slate-500">
              {products.length} product{products.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        {/* View Switcher (Table vs Card Grid) */}
        {products.length > 0 && (
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                viewMode === "table"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="size-3.5" />
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                viewMode === "grid"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              Cards
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {products.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Package className="mx-auto size-10 text-slate-300" />
          <h3 className="mt-4 font-semibold text-slate-900">No products yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create your first product to start building your catalog.
          </p>
          <Link
            href="/admin/product/new"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="size-4" />
            Create product
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* Dynamic Card Grid View */
        <div className="grid grid-cols-1 justify-items-center gap-6 bg-slate-50/50 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/admin/product/${product.id}`}
              ctaText="Edit"
            />
          ))}
        </div>
      ) : (
        /* Table View with Quick Card Preview in Each Row */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Variants</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 text-right font-medium">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4">
                    {product.images.length > 0 ? (
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid size-14 shrink-0 gap-0.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${
                            product.images.length === 1
                              ? "grid-cols-1"
                              : "grid-cols-2"
                          }`}
                        >
                          {product.images.slice(0, 4).map((image) => (
                            <img
                              key={image.id}
                              src={image.url}
                              alt={image.altText || product.name}
                              className="size-full min-h-0 min-w-0 object-cover"
                            />
                          ))}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-40 truncate font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.images.length} image
                            {product.images.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex size-14 items-center justify-center rounded-lg bg-slate-100">
                        <Package className="size-5 text-slate-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      /{product.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {product.type.toLowerCase()}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {product.variants.length}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {/* Live Card Modal Preview Trigger */}
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                      <DialogTrigger>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50"
                        >
                          <Eye className="size-3.5" />
                          Card
                        </button>
                      </DialogTrigger>
                      <DialogContent className="flex max-w-fit items-center justify-center border-none bg-transparent p-0 shadow-none">
                        <DialogTitle className="sr-only">
                          {product.name} Card Preview
                        </DialogTitle>
                        <ProductCard
                          product={product}
                          href={`/products/${product.slug}`}
                        />
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
