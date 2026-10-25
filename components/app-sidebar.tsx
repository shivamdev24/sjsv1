"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

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
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard />,
    },
    {
      title: "Products",
      url: "/admin/product",
      icon: <Package />,
      items: [
        {
          title: "All Products",
          url: "/admin/product",
        },
        {
          title: "New Product",
          url: "/admin/product/new",
        },
      ],
    },
    {
      title: "Bookings",
      url: "/admin/booking",
      icon: <CalendarDays />,
    },
    {
      title: "Orders",
      url: "/admin/order",
      icon: <ShoppingCart />,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: <Users />,
    },
    {
      title: "Staff",
      url: "/admin/staff",
      icon: <UserRoundCog />,
    },
    {
      title: "Matrimonials",
      url: "/admin/matrimonial",
      icon: <Heart />,
    },
    {
      title: "Payments",
      url: "/admin/payments",
      icon: <CreditCard />,
    },
    {
      title: "WhatsApp Requests",
      url: "/admin/whatsapp-requests",
      icon: <MessageCircle />,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <Settings />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
