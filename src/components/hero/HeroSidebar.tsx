import { useState } from "react";
import { useHeroAuth } from "@/hooks/useHeroAuth";
import {
  Users, UserCheck, BarChart3, Share2,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  subsystem: string;
}

const sidebarItems: SidebarItem[] = [
  { id: "admin-users", label: "User Management", icon: Users, subsystem: "admin" },
  { id: "sales-leads", label: "Leads", icon: UserCheck, subsystem: "marketing" },
  { id: "mkt-social", label: "Social Media", icon: Share2, subsystem: "marketing" },
  { id: "sales-pms", label: "Planning My SaaS", icon: BarChart3, subsystem: "sales" },
];

const subsystemLabels: Record<string, string> = {
  admin: "Admin",
  marketing: "Marketing",
  sales: "Sales",
  product: "Product",
  education: "Education",
  tech: "Tech",
};

interface HeroSidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

const HeroSidebar = ({ activeItem, onItemClick }: HeroSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { canAccessSubsystem } = useHeroAuth();

  const accessibleSubsystems = ["admin", "marketing", "sales", "product", "education", "tech"].filter(canAccessSubsystem);

  return (
    <aside
      className={cn(
        "h-[calc(100vh-4rem)] sticky top-16 border-r border-white/[0.06] bg-black/40 backdrop-blur-xl transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {accessibleSubsystems.map((subsystem) => {
          const items = sidebarItems.filter((i) => i.subsystem === subsystem);
          return (
            <div key={subsystem}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                  {subsystemLabels[subsystem]}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                        isActive
                          ? "bg-uai-500/10 text-uai-500 font-medium"
                          : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-white/[0.06] text-white/40 hover:text-white transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default HeroSidebar;
