import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-background/80 backdrop-blur px-4 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="font-display font-semibold text-lg">AgroAI Dashboard</h1>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Cpu className="w-3 h-3" />
              CNN Model: v1.0
            </Badge>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}