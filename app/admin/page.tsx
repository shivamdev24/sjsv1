// import Link from "next/link";
// import {
//   Plus,
//   Package,
//   ShoppingBag,
//   CheckCircle2,
//   FileText,
//   ArrowUpRight,
//   Search,
// } from "lucide-react";

// import { listProducts } from "@/backend/services/product.service";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";

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
//     <div className="mx-auto max-w-7xl space-y-7">
//       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
//         <div className="space-y-1">
//           <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
//             <span>Workspace</span>
//             <span>/</span>
//             <span>Catalog</span>
//           </div>

//           <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

//           <p className="text-sm text-muted-foreground">
//             Manage your products, variants, pricing, and availability.
//           </p>
//         </div>

//         <Button asChild className="gap-2 self-start sm:self-auto">
//           <Link href="/admin/product/new">
//             <Plus className="size-4" />
//             Add product
//           </Link>
//         </Button>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//         <StatCard
//           title="Total products"
//           value={products.length}
//           icon={<Package className="size-4" />}
//           description="Across your catalog"
//         />

//         <StatCard
//           title="Active products"
//           value={activeCount}
//           icon={<CheckCircle2 className="size-4" />}
//           description="Available in your catalog"
//         />

//         <StatCard
//           title="Draft products"
//           value={draftCount}
//           icon={<FileText className="size-4" />}
//           description="Awaiting publication"
//         />
//       </div>

//       <Card className="gap-0 overflow-hidden py-0">
//         <CardHeader className="flex flex-row items-center justify-between gap-4 border-b px-5 py-4">
//           <div className="space-y-1">
//             <CardTitle className="text-base">Product catalog</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               {products.length} {products.length === 1 ? "product" : "products"}
//             </p>
//           </div>

//           <Badge variant="secondary">Catalog</Badge>
//         </CardHeader>

//         <CardContent className="p-0">
//           {products.length === 0 ? (
//             <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:py-16">
//               <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
//                 <ShoppingBag className="size-6" />
//               </div>

//               <h2 className="text-base font-semibold">
//                 Start building your catalog
//               </h2>

//               <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
//                 Add your first astrology product, consultation, or digital
//                 offering to get your catalog started.
//               </p>

//               <Button asChild className="mt-5 gap-2">
//                 <Link href="/admin/product/new">
//                   <Plus className="size-4" />
//                   Create your first product
//                 </Link>
//               </Button>
//             </div>
//           ) : (
//             <div className="divide-y">
//               <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
//                 <p className="text-sm text-muted-foreground">
//                   Showing {products.length} products
//                 </p>

//                 <div className="relative w-full sm:max-w-xs">
//                   <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
//                   <Input
//                     placeholder="Search products..."
//                     className="pl-9"
//                     disabled
//                     aria-label="Product search (not implemented yet)"
//                   />
//                 </div>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-muted/40 text-left text-muted-foreground">
//                     <tr>
//                       <th className="px-5 py-3 font-medium">Product</th>
//                       <th className="px-5 py-3 font-medium">Type</th>
//                       <th className="px-5 py-3 font-medium">Variants</th>
//                       <th className="px-5 py-3 font-medium">Status</th>
//                       <th className="px-5 py-3 text-right font-medium">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y">
//                     {products.map((product) => (
//                       <tr key={product.id} className="hover:bg-muted/30">
//                         <td className="px-5 py-4">
//                           <p className="font-medium">{product.name}</p>
//                           <p className="mt-1 text-xs text-muted-foreground">
//                             /{product.slug}
//                           </p>
//                         </td>

//                         <td className="px-5 py-4 capitalize">
//                           {product.type.toLowerCase()}
//                         </td>

//                         <td className="px-5 py-4">{product.variants.length}</td>

//                         <td className="px-5 py-4">
//                           <Badge
//                             variant={
//                               product.status === "ACTIVE"
//                                 ? "default"
//                                 : "secondary"
//                             }
//                           >
//                             {product.status.toLowerCase()}
//                           </Badge>
//                         </td>

//                         <td className="px-5 py-4 text-right">
//                           <Button asChild size="sm" variant="ghost">
//                             <Link href={`/admin/product/${product.id}/edit`}>
//                               Edit
//                               <ArrowUpRight className="ml-1 size-4" />
//                             </Link>
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function StatCard({
//   title,
//   value,
//   icon,
//   description,
// }: {
//   title: string;
//   value: number;
//   icon: React.ReactNode;
//   description: string;
// }) {
//   return (
//     <Card className="gap-4 py-5">
//       <CardContent className="space-y-4">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-medium text-muted-foreground">{title}</p>
//           <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
//             {icon}
//           </div>
//         </div>

//         <div>
//           <p className="text-3xl font-semibold tracking-tight">{value}</p>
//           <p className="mt-1 text-xs text-muted-foreground">{description}</p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import Link from "next/link";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CreditCard,
  Heart,
  MessageCircle,
  Package,
  Plus,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

import { listProducts } from "@/backend/services/product.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardCharts } from "@/component/dashboard-charts.";

export default async function AdminDashboardPage() {
  const products = await listProducts();

  const activeProducts = products.filter(
    (product) => product.status === "ACTIVE",
  ).length;

  const draftProducts = products.filter(
    (product) => product.status === "DRAFT",
  ).length;

  const metrics = [
    {
      title: "Total products",
      value: products.length.toLocaleString("en-IN"),
      note: `${activeProducts} active products`,
      icon: Package,
      href: "/admin/product",
    },
    {
      title: "Orders",
      value: "—",
      note: "Connect order analytics",
      icon: ShoppingBag,
      href: "/admin/order",
    },
    {
      title: "Registered users",
      value: "—",
      note: "Connect user analytics",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Bookings",
      value: "—",
      note: "Connect booking analytics",
      icon: CalendarCheck,
      href: "/admin/booking",
    },
  ];

  const shortcuts = [
    {
      title: "Add a product",
      description: "Create a product or consultation",
      href: "/admin/product/new",
      icon: Package,
    },
    {
      title: "Manage bookings",
      description: "Review upcoming appointments",
      href: "/admin/booking",
      icon: CalendarCheck,
    },
    {
      title: "Matrimonial profiles",
      description: "Manage member profiles",
      href: "/admin/matrimonial",
      icon: Heart,
    },
    {
      title: "WhatsApp requests",
      description: "Review customer enquiries",
      href: "/admin/whatsapp-requests",
      icon: MessageCircle,
    },
    {
      title: "Payments",
      description: "View payment management",
      href: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "User management",
      description: "Manage registered accounts",
      href: "/admin/users",
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-[1500px] space-y-8">
      {/* Welcome header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-violet-600" />
            <span>Super Admin workspace</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Dashboard overview
          </h1>

          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            Manage your astrology platform, monitor operations, and access your
            essential tools from one place.
          </p>
        </div>

        <Button className="gap-2 self-start">
          <Link href="/admin/product/new">
            <Plus className="size-4" />
            Add product
          </Link>
        </Button>
      </section>

      {/* Metric cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Link href={metric.href} key={metric.title} className="group">
              <Card className="h-full gap-4 py-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-violet-300 group-hover:shadow-md">
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {metric.note}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <DashboardCharts />

      {/* Main dashboard content */}
      <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card className="gap-0 py-0">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b px-5 py-4">
            <div className="space-y-1">
              <CardTitle className="text-base">Catalog overview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Product publication status
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/product">
                View catalog <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-5 p-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">All products</p>
                <p className="mt-2 text-2xl font-semibold">{products.length}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Active
                </p>
                <p className="mt-2 text-2xl font-semibold">{activeProducts}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/30">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Drafts
                </p>
                <p className="mt-2 text-2xl font-semibold">{draftProducts}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300">
                <Activity className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Catalog status</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {products.length === 0
                    ? "Your catalog is empty. Add your first product to get started."
                    : `${activeProducts} products are active and ${draftProducts} are drafts.`}
                </p>
              </div>
            </div>

            {products.length === 0 && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/product/new">
                  Create your first product
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="gap-0 py-0">
          <CardHeader className="border-b px-5 py-4">
            <CardTitle className="text-base">Platform activity</CardTitle>
            <p className="text-sm text-muted-foreground">
              Areas to monitor and manage
            </p>
          </CardHeader>

          <CardContent className="space-y-1 p-3">
            {[
              {
                label: "Orders",
                detail: "Order management",
                href: "/admin/order",
                icon: ShoppingBag,
              },
              {
                label: "Bookings",
                detail: "Appointments and consultations",
                href: "/admin/booking",
                icon: CalendarCheck,
              },
              {
                label: "Payments",
                detail: "Payment management",
                href: "/admin/payments",
                icon: CreditCard,
              },
              {
                label: "WhatsApp requests",
                detail: "Customer enquiries",
                href: "/admin/whatsapp-requests",
                icon: MessageCircle,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/70"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* Quick access */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Quick access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Jump directly to your most-used admin sections.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Link
                key={shortcut.title}
                href={shortcut.href}
                className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-violet-300 hover:bg-violet-50/40 dark:hover:bg-violet-950/20"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-violet-100 group-hover:text-violet-700 dark:group-hover:bg-violet-950 dark:group-hover:text-violet-300">
                  <Icon className="size-[18px]" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{shortcut.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {shortcut.description}
                  </p>
                </div>

                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            );
          })}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        Dashboard metrics for orders, users, bookings, and revenue will appear
        here once connected to their respective data sources.
      </p>
    </div>
  );
}
