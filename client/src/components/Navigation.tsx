/*
 * Navigation — Lake Michigan Marketing
 * Coastal Modernism: frosted glass nav, amber CTA, smooth transitions
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";

const services = [
  { label: "Website Design", href: "/services/website-design" },
  { label: "CRM & Automation", href: "/services/crm-automation" },
  { label: "Lead Generation", href: "/services/lead-generation" },
  { label: "SEO Services", href: "/services/seo-services" },
];

const locations = [
  { label: "Kalamazoo, MI", href: "/kalamazoo-marketing-agency" },
  { label: "Grand Rapids, MI", href: "/grand-rapids-marketing-agency" },
  { label: "Southwest Michigan", href: "/southwest-michigan-digital-marketing" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setLocationsOpen(false);
  }, [location]);

  const isHome = location === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "nav-glass shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[oklch(0.72_0.18_55)] to-[oklch(0.60_0.20_48)] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-sm font-display">LM</span>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight leading-tight">
              Lake Michigan<br className="hidden" />
              <span className="text-[oklch(0.72_0.18_55)] ml-1">Marketing</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink href="/" label="Home" current={location} />

            {/* Services Dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <button className="flex items-center gap-1 text-white/90 hover:text-white font-body text-sm font-medium transition-colors">
                Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[oklch(0.25_0.10_245)] rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                  {services.map((s) => (
                    <Link key={s.href} href={s.href} className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Locations Dropdown */}
            <div className="relative" onMouseEnter={() => setLocationsOpen(true)} onMouseLeave={() => setLocationsOpen(false)}>
              <button className="flex items-center gap-1 text-white/90 hover:text-white font-body text-sm font-medium transition-colors">
                Locations <ChevronDown size={14} className={`transition-transform ${locationsOpen ? "rotate-180" : ""}`} />
              </button>
              {locationsOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-[oklch(0.25_0.10_245)] rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                  {locations.map((l) => (
                    <Link key={l.href} href={l.href} className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors font-body">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink href="/about" label="About" current={location} />

            <Link
              href="/contact"
              className="btn-amber px-5 py-2.5 rounded-lg text-sm font-semibold font-body"
            >
              Get a Free Growth Plan
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[oklch(0.22_0.10_245)] border-t border-white/10">
          <div className="container py-4 flex flex-col gap-1">
            <MobileNavLink href="/" label="Home" />
            <div className="text-white/50 text-xs font-body uppercase tracking-widest px-3 pt-3 pb-1">Services</div>
            {services.map((s) => (
              <MobileNavLink key={s.href} href={s.href} label={s.label} indent />
            ))}
            <div className="text-white/50 text-xs font-body uppercase tracking-widest px-3 pt-3 pb-1">Locations</div>
            {locations.map((l) => (
              <MobileNavLink key={l.href} href={l.href} label={l.label} indent />
            ))}
            <MobileNavLink href="/about" label="About" />
            <div className="pt-3">
              <Link
                href="/contact"
                className="btn-amber block text-center px-5 py-3 rounded-lg text-sm font-semibold font-body"
              >
                Get a Free Growth Plan
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label, current }: { href: string; label: string; current: string }) {
  const isActive = current === href;
  return (
    <Link
      href={href}
      className={`text-sm font-medium font-body transition-colors relative group ${
        isActive ? "text-[oklch(0.72_0.18_55)]" : "text-white/90 hover:text-white"
      }`}
    >
      {label}
      <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-[oklch(0.72_0.18_55)] transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`} />
    </Link>
  );
}

function MobileNavLink({ href, label, indent }: { href: string; label: string; indent?: boolean }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg text-sm font-body transition-colors ${indent ? "pl-6" : ""}`}
    >
      {label}
    </Link>
  );
}
