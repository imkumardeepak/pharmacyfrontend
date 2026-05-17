// path: frontend/src/components/layout/AppShell.tsx
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import {
  Package,
  FlaskConical,
  Building2,
  Stethoscope,
  Users,
  UserCircle,
  TestTube,
  FileText,
  ShoppingCart,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Pill,
} from "lucide-react";

const masters = [
  { to: "/items", label: "Items", icon: Package },
  { to: "/salts", label: "Salts", icon: FlaskConical },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/salesmen", label: "Salesmen", icon: Users },
  { to: "/parties", label: "Parties", icon: UserCircle },
  { to: "/batches", label: "Batches", icon: TestTube },
];

const transactions = [
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/invoices/cash-sale", label: "Cash Sale", icon: ShoppingCart },
  { to: "/payments", label: "Payments", icon: Wallet },
];

const NavItem = ({
  to,
  label,
  icon: Icon,
  collapsed,
}: {
  to: string;
  label: string;
  icon: any;
  collapsed: boolean;
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer group relative",
        isActive
          ? "bg-primary text-primary-foreground shadow-soft"
          : "text-sidebar-foreground/70 hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground",
        collapsed && "justify-center px-2",
      )
    }
    title={collapsed ? label : undefined}
  >
    <Icon className="h-5 w-5 shrink-0" />
    {!collapsed && <span className="truncate">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 hidden rounded-md bg-card px-2 py-1 text-xs shadow-elevated group-hover:block z-50 whitespace-nowrap">
        {label}
      </div>
    )}
  </NavLink>
);

export function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-soft">
                <Pill className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight">PharmaERP</h1>
                <p className="text-[10px] text-muted-foreground">v1.0.0</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {!collapsed && (
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Masters
            </div>
          )}
          {masters.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              collapsed={collapsed}
            />
          ))}

          <div className="my-4 border-t border-border" />

          {!collapsed && (
            <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Transactions
            </div>
          )}
          {transactions.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              collapsed={collapsed}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-border p-3">
          {user && !collapsed && (
            <div className="mb-3 rounded-lg bg-sidebar-foreground/10 p-3">
              <p className="text-xs font-medium">{user.displayName}</p>
              <p className="text-[10px] text-muted-foreground">{user.role}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-destructive",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/50 px-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px]">
              N
            </kbd>
            <span>New</span>
            <span className="mx-1">·</span>
            <kbd className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px]">
              F2
            </kbd>
            <span>Save</span>
            <span className="mx-1">·</span>
            <kbd className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px]">
              Esc
            </kbd>
            <span>Cancel</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
