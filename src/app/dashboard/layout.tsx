import { AppSidebar } from "@/components/dashboard/DashboardSB";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nephtys - Admin",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-sidebar w-full">
        <div className="bg-background rounded-2xl h-full p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
