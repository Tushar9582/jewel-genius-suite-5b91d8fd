import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Megaphone,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  Gem,
  BarChart3,
  Wallet,
  Building2,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ShoppingCart, label: "POS & Sales", href: "/pos", badge: "Live" },
  { icon: Package, label: "Inventory", href: "/inventory" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: TrendingUp, label: "Investments", href: "/investments" },
  { icon: Megaphone, label: "Marketing", href: "/marketing" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
];

const managementItems: NavItem[] = [
  { icon: UserCog, label: "HR & Team", href: "/hr" },
  { icon: Wallet, label: "Payroll", href: "/payroll" },
  { icon: Building2, label: "Branches", href: "/branches" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
            <Gem className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-lg font-bold text-gradient-gold">
                Jellowey
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                Jewellery ERP
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Main
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={location.pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="mt-6 space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Management
            </p>
          )}
          {managementItems.map((item) => (
            <NavButton
              key={item.href}
              item={item}
              active={location.pathname === item.href}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="ml-2">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}

function NavButton({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        active
          ? "bg-sidebar-accent text-primary shadow-sm"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 shrink-0",
          active ? "text-primary" : "text-muted-foreground"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
              {item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  );
}
