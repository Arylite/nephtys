"use client";

import * as React from "react";
import {
  BookOpenIcon,
  PenToolIcon,
  ImageIcon,
  UsersIcon,
  LayoutDashboardIcon,
  BarChartIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

// Menu items with metadata for caching and SEO
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
    prefetch: true,
  },
  {
    title: "Series Management",
    url: "/dashboard/series",
    icon: BookOpenIcon,
    prefetch: true,
  },
  {
    title: "Genres Management",
    url: "/dashboard/genres",
    icon: PenToolIcon, // Changed to PenTool as it's more relevant for categorization/tagging
    prefetch: true,
  },
  {
    title: "Chapter Management",
    url: "/dashboard/chapters",
    icon: ImageIcon, // Changed to Image as chapters often contain manga pages
    prefetch: true,
  },
  {
    title: "Teams Management",
    url: "/dashboard/teams",
    icon: UsersIcon, // Changed to Users as teams are groups of people
    prefetch: true,
  },
  {
    title: "User Management",
    url: "/dashboard/users",
    icon: LayoutDashboardIcon, // Changed to LayoutDashboard for user control panel
    prefetch: true,
  },
  {
    title: "Algolia",
    url: "/dashboard/algolia",
    icon: BarChartIcon, // BarChart is relevant for search analytics
    prefetch: true,
  },
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  const memoizedItems = React.useMemo(() => items, []);

  return (
    <Sidebar className="min-h-screen bg-background border-r border-border">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Nephtys Scans
            </h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {memoizedItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title} className="mb-1">
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    prefetch={item.prefetch}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
