import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  ShoppingCart,
  Users,
  UserRoundCog,
  Heart,
  CreditCard,
  MessageCircle,
  Settings,
  LogOut,
  Sparkles,
  PanelLeft,
} from "lucide-react";

import { getCurrentUser } from "@/lib/auth/current-user";
import { LogoutButton } from "@/component/LogoutButton";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";
import { CartProvider } from "@/components/context/CartContext";

export const instant = false;

const sections = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboard },
      { title: "Products", href: "/admin/product", icon: Package },
      { title: "Bookings", href: "/admin/booking", icon: CalendarDays },
      { title: "Orders", href: "/admin/order", icon: ShoppingCart },
    ],
  },
  {
    label: "People & services",
    items: [
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Staff", href: "/admin/staff", icon: UserRoundCog },
      { title: "Matrimonial", href: "/admin/matrimonial", icon: Heart },
      {
        title: "WhatsApp requests",
        href: "/admin/whatsapp-requests",
        icon: MessageCircle,
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        title: "Payment links",
        href: "/admin/payment-links",
        icon: CreditCard,
      },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");

  if (!user.roles.includes("ADMIN") && !user.roles.includes("SUPER_ADMIN")) {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.name || "Admin",
          email: user.email,
        }}
      />

      <SidebarInset className="min-w-0 bg-muted/30">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3  bg-background/90 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger />
          {/* <Separator orientation="vertical" className="h-5" /> */}
          <div>
            <p className="text-sm font-semibold">Admin workspace</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Manage your astrology platform
            </p>
          </div>
        </header>

        <main className="mx-auto w-full  p-4 sm:p-6 lg:p-8">
          <CartProvider>{children}</CartProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );

  // return (
  //   <SidebarProvider>
  //     <Sidebar collapsible="icon" className="border-r-0">
  //       <SidebarHeader className="px-4 py-5">
  //         <Link href="/admin" className="flex items-center gap-3">
  //           <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-900/20">
  //             <Sparkles className="size-5" />
  //           </div>
  //           <div className="min-w-0 group-data-[collapsible=icon]:hidden">
  //             <p className="font-semibold tracking-tight">SJS Astrology</p>
  //             <p className="text-xs text-muted-foreground">Administration</p>
  //           </div>
  //         </Link>
  //       </SidebarHeader>

  //       <SidebarContent className="px-2">
  //         {sections.map((section) => (
  //           <SidebarGroup key={section.label} className="py-2">
  //             <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
  //               {section.label}
  //             </SidebarGroupLabel>

  //             <SidebarMenu className="gap-1">
  //               {section.items.map((item) => (
  //                 <SidebarMenuItem key={item.href}>
  //                   <SidebarMenuButton
  //                     tooltip={item.title}
  //                     className="h-10 rounded-lg px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
  //                   >
  //                     <Link href={item.href} className="flex gap-2">
  //                       <item.icon className="size-[18px]" />
  //                       <span>{item.title}</span>
  //                     </Link>
  //                   </SidebarMenuButton>
  //                 </SidebarMenuItem>
  //               ))}
  //             </SidebarMenu>
  //           </SidebarGroup>
  //         ))}
  //       </SidebarContent>

  //       <SidebarFooter className="border-t p-3">
  //         <SidebarMenu>
  //           <SidebarMenuItem>
  //             <SidebarMenuButton tooltip="Back to dashboard">
  //               <Link href="/dashboard">
  //                 <PanelLeft className="size-[18px]" />
  //                 <span>Back to website</span>
  //               </Link>
  //             </SidebarMenuButton>
  //           </SidebarMenuItem>

  //           <SidebarMenuItem>
  //             <div className="flex items-center gap-3 rounded-xl bg-muted/70 p-2">
  //               <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-sm font-semibold">
  //                 {(user.name || user.email).charAt(0).toUpperCase()}
  //               </div>
  //               <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
  //                 <p className="truncate text-sm font-medium">
  //                   {user.name || user.email}
  //                 </p>
  //                 <p className="truncate text-xs text-muted-foreground">
  //                   {user.roles.includes("SUPER_ADMIN")
  //                     ? "Super administrator"
  //                     : "Administrator"}
  //                 </p>
  //               </div>
  //             </div>
  //           </SidebarMenuItem>

  //           <SidebarMenuItem>
  //             <div className="px-1 pt-1">
  //               <LogoutButton />
  //             </div>
  //           </SidebarMenuItem>
  //         </SidebarMenu>
  //       </SidebarFooter>
  //     </Sidebar>

  //     <SidebarInset className="min-w-0 bg-muted/30">
  //       <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur-xl sm:px-6">
  //         <SidebarTrigger />
  //         <Separator orientation="vertical" className="h-5" />
  //         <div className="min-w-0">
  //           <p className="text-sm font-semibold tracking-tight">
  //             Admin workspace
  //           </p>
  //         </div>
  //         <div className="ml-auto hidden text-xs text-muted-foreground sm:block">
  //           Store management
  //         </div>
  //       </header>

  //       <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
  //         {children}
  //       </main>
  //     </SidebarInset>
  //   </SidebarProvider>
  // );
}
