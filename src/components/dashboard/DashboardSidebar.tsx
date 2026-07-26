import { LayoutDashboard, Leaf, Activity, Cpu, History as HistoryIcon, RadioTower } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", titleBn: "ওভারভিউ", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "Live Monitor", titleBn: "লাইভ মনিটর", url: "/dashboard/live", icon: RadioTower },
  { title: "Disease Detection", titleBn: "রোগ শনাক্তকরণ", url: "/dashboard/disease", icon: Leaf },
  { title: "Sensor Monitoring", titleBn: "সেন্সর মনিটরিং", url: "/dashboard/sensors", icon: Activity },
  { title: "Devices", titleBn: "ডিভাইস", url: "/dashboard/devices", icon: Cpu },
  { title: "History", titleBn: "ইতিহাস", url: "/dashboard/history", icon: HistoryIcon },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { lang } = useLanguage();

  const isActive = (url: string, end?: boolean) =>
    end ? location.pathname === url : location.pathname.startsWith(url);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-accent flex items-center justify-center shadow-soft flex-shrink-0">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-display font-bold">
              Agro<span className="text-primary">AI</span>
            </span>
          )}
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url, item.end);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} end={item.end}>
                        <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{lang === "bn" ? item.titleBn : item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}