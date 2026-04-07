/*
 * DashboardLayout — LMM CRM
 * Design: Warm Professional — deep navy sidebar, sandy main area
 * Fixed left sidebar (240px) + top header + main content area
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Kanban,
  Settings,
  Menu,
  X,
  Bell,
  ChevronRight,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
  breadcrumbs,
}: DashboardLayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 flex flex-col",
          "bg-sidebar text-sidebar-foreground",
          "transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-[#2B7FBF] flex items-center justify-center shadow-md flex-shrink-0">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white leading-tight font-['Plus_Jakarta_Sans']">
              Lake Michigan
            </p>
            <p className="text-xs text-sidebar-foreground/60 leading-tight">
              Marketing CRM
            </p>
          </div>
          <button
            className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Main Menu
          </p>
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? location === "/" : location.startsWith(href);
            return (
              <Link key={href} href={href}>
                <div
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-white border-l-2 border-[#F47B3A] pl-[10px]"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                  {isActive && (
                    <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              LM
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                LMM Agency
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">
                info@lakemichiganmarketing.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top header */}
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-14 bg-background/95 backdrop-blur-sm border-b border-border/60">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 ? (
              breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
                  )}
                  {crumb.href ? (
                    <Link href={crumb.href}>
                      <span className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors truncate">
                        {crumb.label}
                      </span>
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground truncate">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span className="font-semibold text-foreground">{title}</span>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F47B3A]" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              LM
            </div>
          </div>
        </header>

        {/* Page header */}
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4 px-4 sm:px-6 pt-6 pb-2">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-foreground font-['Plus_Jakarta_Sans']">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 px-4 sm:px-6 py-4">{children}</main>
      </div>
    </div>
  );
}
