// import Link from "next/link";
// import { Plus, Package, ArrowUpRight } from "lucide-react";
// import { listProducts } from "@/backend/services/product.service";
// import { ProductCard } from "@/components/Product/productCard";

// // export const dynamic = "force-dynamic";

// export default async function AdminProductsPage() {
//   const products = await listProducts();

//   const activeCount = products.filter(
//     (product) => product.status === "ACTIVE",
//   ).length;

//   const draftCount = products.filter(
//     (product) => product.status === "DRAFT",
//   ).length;

//   return (
//     <div className="space-y-8">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div>
//           <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
//             Catalog Management
//           </p>
//           <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
//           <p className="mt-2 text-sm text-slate-500">
//             Manage your product catalog, variants, and availability.
//           </p>
//         </div>

//         <Link
//           href="/admin/product/new"
//           className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
//         >
//           <Plus className="size-4" />
//           Add product
//         </Link>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <StatCard label="Total products" value={products.length} />
//         <StatCard label="Active products" value={activeCount} />
//         <StatCard label="Draft products" value={draftCount} />
//       </div>

//       <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
//         <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
//           <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
//             <Package className="size-5" />
//           </div>
//           <div>
//             <h2 className="font-semibold text-slate-900">Product catalog</h2>
//             <p className="text-sm text-slate-500">
//               {products.length} product{products.length === 1 ? "" : "s"} found
//             </p>
//           </div>
//         </div>

//         {products.length === 0 ? (
//           <div className="px-6 py-16 text-center">
//             <Package className="mx-auto size-10 text-slate-300" />
//             <h3 className="mt-4 font-semibold text-slate-900">
//               No products yet
//             </h3>
//             <p className="mt-2 text-sm text-slate-500">
//               Create your first product to start building your catalog.
//             </p>
//             <Link
//               href="/admin/product/new"
//               className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
//             >
//               <Plus className="size-4" />
//               Create product
//             </Link>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
//                 <tr>
//                   <th className="px-6 py-4 font-medium">Image</th>
//                   <th className="px-6 py-4 font-medium">Product</th>
//                   <th className="px-6 py-4 font-medium">Type</th>
//                   <th className="px-6 py-4 font-medium">Variants</th>
//                   <th className="px-6 py-4 font-medium">Status</th>
//                   <th className="px-6 py-4 font-medium">Created</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {products.map((product) => (
//                   <tr
//                     key={product.id}
//                     className="transition hover:bg-slate-50/80"
//                   >
//                     <td className="px-6 py-4">
//                       {product.images.length > 0 ? (
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`grid size-14 shrink-0 gap-0.5 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 ${
//                               product.images.length === 1
//                                 ? "grid-cols-1"
//                                 : "grid-cols-2"
//                             }`}
//                           >
//                             {product.images.slice(0, 4).map((image) => (
//                               <img
//                                 key={image.id}
//                                 src={image.url}
//                                 alt={image.altText || product.name}
//                                 className="size-full min-h-0 min-w-0 object-cover"
//                               />
//                             ))}
//                           </div>

//                           <div className="min-w-0">
//                             <p className="max-w-40 truncate font-medium text-slate-900">
//                               {product.name}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {product.images.length} image
//                               {product.images.length === 1 ? "" : "s"}
//                             </p>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="flex size-14 items-center justify-center rounded-lg bg-slate-100">
//                           <Package className="size-5 text-slate-400" />
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="font-semibold text-slate-900">
//                         {product.name}
//                       </p>
//                       <p className="mt-1 text-xs text-slate-500">
//                         /{product.slug}
//                       </p>
//                     </td>
//                     <td className="px-6 py-4 text-slate-600">
//                       {product.type.toLowerCase()}
//                     </td>
//                     <td className="px-6 py-4 text-slate-600">
//                       {product.variants.length}
//                     </td>
//                     <td className="px-6 py-4">
//                       <StatusBadge status={product.status} />
//                     </td>
//                     <td className="whitespace-nowrap px-6 py-4 text-slate-500">
//                       {new Date(product.createdAt).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </section>
//       <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
//         {/* // 1. Storefront Grid (passing database product directly) */}
//         {products.map((product) => (
//           <ProductCard
//             key={product.id}
//             product={product}
//             currency="₹"
//             onBuyNow={(item) => addToCart(item)}
//           />
//         ))}

//         {/* // 2. Compact Sidebar / Related Products Widget */}
//         <ProductCard product={relatedProduct} size="sm" ctaText="View" />

//         {/* // 3. Static / Custom Marketing Section (without a DB object) */}
//         <ProductCard
//           title="Nike Airforce1 Premium"
//           subtitle="Own the Airforce"
//           description="Step back into classic hoops style with a durable leather."
//           price={111}
//           badgeText="Best Seller"
//           images={["/shoe-1.jpg", "/shoe-2.jpg"]}
//         />
//       </section>

//       <div className="flex items-start gap-2 text-xs text-slate-500">
//         <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
//         <p>
//           Product editing and category management will be connected in the next
//           steps.
//         </p>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white p-6">
//       <p className="text-sm font-medium text-slate-500">{label}</p>
//       <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
//         {value}
//       </p>
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const styles: Record<string, string> = {
//     ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
//     DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
//     ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-500/20",
//   };

//   return (
//     <span
//       className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
//         styles[status] ?? styles.ARCHIVED
//       }`}
//     >
//       {status.toLowerCase().replace("_", " ")}
//     </span>
//   );
// }

import Link from "next/link";
import { Plus, Package, ArrowUpRight, LayoutGrid } from "lucide-react";
import { listProducts } from "@/backend/services/product.service";
import {
  DynamicProductData,
  ProductCard,
} from "@/components/Product/productCard";

// export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await listProducts();

  const activeCount = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;

  const draftCount = products.filter(
    (product) => product.status === "DRAFT",
  ).length;

  function addToCart(product: DynamicProductData) {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-indigo-600">
            Catalog Management
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your product catalog, variants, and availability.
          </p>
        </div>

        <Link
          href="/admin/product/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="size-4" />
          Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total products" value={products.length} />
        <StatCard label="Active products" value={activeCount} />
        <StatCard label="Draft products" value={draftCount} />
      </div>

      {/* Table Section */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
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

        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package className="mx-auto size-10 text-slate-300" />
            <h3 className="mt-4 font-semibold text-slate-900">
              No products yet
            </h3>
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
        ) : (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Product Cards Preview Section */}
      {products.length > 0 && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
            <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <LayoutGrid className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">
                Storefront Card Preview
              </h2>
              <p className="text-sm text-slate-500">
                Live preview of how your catalog items render inside ProductCard
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 justify-items-center gap-6 bg-slate-50/60 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency="₹"
                href={`/products/${product.slug}`}
                ctaText="Add to Bag"
                onAddToCart={(product) => {
                  if (!product) return;
                  addToCart(product);
                }}
              />
            ))}
          </div>
        </section>
      )}

      <div className="flex items-start gap-2 text-xs text-slate-500">
        <ArrowUpRight className="mt-0.5 size-4 shrink-0" />
        <p>
          Product editing and category management will be connected in the next
          steps.
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    DRAFT: "bg-amber-50 text-amber-700 ring-amber-600/20",
    ARCHIVED: "bg-slate-100 text-slate-600 ring-slate-500/20",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${
        styles[status] ?? styles.ARCHIVED
      }`}
    >
      {status.toLowerCase().replace("_", " ")}
    </span>
  );
}
