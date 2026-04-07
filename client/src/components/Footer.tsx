/*
 * Footer — Lake Michigan Marketing
 * Coastal Modernism: dark lake blue background, amber accents
 */
import { Link } from "wouter";
import { MapPin, Mail, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[oklch(0.18_0.08_245)] text-white">
      {/* Main footer content */}
      <div className="container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[oklch(0.72_0.18_55)] to-[oklch(0.60_0.20_48)] flex items-center justify-center">
                <span className="text-white font-bold font-display">LM</span>
              </div>
              <div>
                <div className="font-display font-bold text-base text-white leading-tight">Lake Michigan</div>
                <div className="font-display font-bold text-base text-[oklch(0.72_0.18_55)] leading-tight">Marketing</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm font-body leading-relaxed mb-5">
              We don't just build websites. We build systems that generate revenue for Southwest Michigan businesses.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/60 font-body">
              <a href="mailto:hello@lakemichiganmarketing.com" className="flex items-center gap-2 hover:text-[oklch(0.72_0.18_55)] transition-colors">
                <Mail size={14} /> hello@lakemichiganmarketing.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin size={14} /> Southwest Michigan
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base">Services</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Website Design", href: "/services/website-design" },
                { label: "CRM & Automation", href: "/services/crm-automation" },
                { label: "Lead Generation", href: "/services/lead-generation" },
                { label: "SEO Services", href: "/services/seo-services" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-[oklch(0.72_0.18_55)] transition-colors font-body flex items-center gap-1.5 group">
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base">Service Areas</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "Kalamazoo, MI", href: "/kalamazoo-marketing-agency" },
                { label: "Grand Rapids, MI", href: "/grand-rapids-marketing-agency" },
                { label: "Southwest Michigan", href: "/southwest-michigan-digital-marketing" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/60 hover:text-[oklch(0.72_0.18_55)] transition-colors font-body flex items-center gap-1.5 group">
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-base">Ready to Grow?</h4>
            <p className="text-white/60 text-sm font-body leading-relaxed mb-5">
              Get a free growth plan tailored to your business — no strings attached.
            </p>
            <Link
              href="/contact"
              className="btn-amber inline-block px-5 py-3 rounded-lg text-sm font-semibold font-body"
            >
              Get Your Free Growth Plan
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs font-body">
            © {year} Lake Michigan Marketing. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40 font-body">
            <span>Marketing Agency Southwest Michigan</span>
            <span>·</span>
            <span>Kalamazoo · Grand Rapids</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
