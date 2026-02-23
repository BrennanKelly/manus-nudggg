import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Home, Target, CheckCircle2, BookOpen, Bell, Sparkles, Package, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export function Navigation() {
  const [location] = useLocation();
  const { user } = useAuth();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out");
      window.location.href = "/";
    },
  });

  const navItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/goals", label: "Goals", icon: Target },
    { path: "/habits", label: "Habits", icon: CheckCircle2 },
    { path: "/journal", label: "Journal", icon: BookOpen },
    { path: "/nudges", label: "Nudges", icon: Bell },
    { path: "/storefront", label: "Gear", icon: Package },
    { path: "/insights", label: "Insights", icon: Sparkles },
  ];

  if (!user) return null;

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <a className="text-2xl font-bold text-primary">Nudggg 🌱</a>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.name || user.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
