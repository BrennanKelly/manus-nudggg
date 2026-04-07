/*
 * Home Page — Lake Michigan Marketing
 * Coastal Modernism: asymmetric hero, staggered sections, amber CTAs
 * SEO: targets "Marketing Agency Southwest Michigan", "Digital Marketing Kalamazoo"
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Zap,
  Globe,
  BarChart3,
  Users,
  Star,
  ChevronDown,
  Monitor,
  Settings,
  Target,
  Search,
} from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/fQKrt4t3F2Ag4VrJFMx6DM/hero-bg-igpCzY48yDZNKGuu2p7pnr.webp";
const CTA_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/fQKrt4t3F2Ag4VrJFMx6DM/cta-bg-6qnUQqJfGZgGcupfiuPNew.webp";
const WATER_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/fQKrt4t3F2Ag4VrJFMx6DM/services-bg-G4HfRihophbQSuoRNXsfQZ.webp";

// Animated counter hook
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCard({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 1800, start);
  return (
    <div className="text-center">
      <div className="font-display font-bold text-4xl lg:text-5xl text-[oklch(0.72_0.18_55)]">
        {count}{suffix}
      </div>
      <div className="text-white/70 text-sm font-body mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Stats counter trigger
  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.008_80)]">
      <Navigation />

      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.08_245/0.88)] via-[oklch(0.15_0.08_245/0.70)] to-[oklch(0.15_0.08_245/0.30)]" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.18_55/0.15)] border border-[oklch(0.72_0.18_55/0.40)] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.72_0.18_55)] animate-pulse" />
              <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-semibold tracking-wider uppercase">Southwest Michigan's Growth Agency</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-bold text-5xl lg:text-7xl text-white leading-[1.05] mb-6">
              Turn Your Website<br />
              Into a{" "}
              <span className="text-[oklch(0.72_0.18_55)] italic">Lead Machine</span>
            </h1>

            <p className="text-white/80 text-lg lg:text-xl font-body leading-relaxed mb-8 max-w-xl">
              We build revenue-generating systems — not just websites. CRM automation, SEO, and paid ads designed to fill your pipeline and scale your business across Southwest Michigan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-amber px-7 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2">
                Get a Free Growth Plan <ArrowRight size={18} />
              </Link>
              <Link href="/services/website-design" className="px-7 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 transition-colors">
                See Our Services <ChevronDown size={18} />
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 mt-10">
              {["Kalamazoo", "Grand Rapids", "Southwest Michigan"].map((loc) => (
                <div key={loc} className="flex items-center gap-1.5 text-white/60 text-sm font-body">
                  <CheckCircle2 size={14} className="text-[oklch(0.72_0.18_55)]" />
                  {loc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-white/40" />
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section ref={statsRef} className="bg-[oklch(0.25_0.10_245)] py-12">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard value={150} suffix="+" label="Clients Served" start={statsVisible} />
            <StatCard value={3} suffix="x" label="Avg. Lead Increase" start={statsVisible} />
            <StatCard value={98} suffix="%" label="Client Retention" start={statsVisible} />
            <StatCard value={12} suffix="+" label="Years Combined Experience" start={statsVisible} />
          </div>
        </div>
      </section>

      {/* ─── SERVICES OVERVIEW ─── */}
      <section className="py-20 lg:py-28 bg-[oklch(0.98_0.008_80)]">
        <div className="container">
          <div className="max-w-2xl mb-14 fade-up">
            <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">What We Build</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[oklch(0.18_0.01_250)] leading-tight mb-4">
              Systems That Generate Revenue, Not Just Traffic
            </h2>
            <p className="text-[oklch(0.45_0.02_250)] font-body text-lg leading-relaxed">
              Every service we offer is engineered to move your business forward — from first click to closed deal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Monitor,
                title: "Website Design",
                desc: "High-converting websites built for speed, SEO, and lead capture. Not templates — custom systems.",
                href: "/services/website-design",
                tag: "Most Popular",
              },
              {
                icon: Settings,
                title: "CRM & Automation",
                desc: "Connect your marketing to your sales pipeline. Automate follow-ups, nurture leads, close more deals.",
                href: "/services/crm-automation",
                tag: null,
              },
              {
                icon: Target,
                title: "Lead Generation",
                desc: "Google Ads and LinkedIn Ads campaigns built to deliver qualified leads — not just clicks.",
                href: "/services/lead-generation",
                tag: null,
              },
              {
                icon: Search,
                title: "SEO Services",
                desc: "Rank at the top of Google for your most valuable keywords in Kalamazoo and Southwest Michigan.",
                href: "/services/seo-services",
                tag: "High ROI",
              },
            ].map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className={`group relative bg-white rounded-2xl p-8 border border-[oklch(0.88_0.02_75)] hover:border-[oklch(0.38_0.12_240)] hover:shadow-xl transition-all duration-300 fade-up`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {service.tag && (
                  <span className="absolute top-4 right-4 text-xs font-body font-semibold bg-[oklch(0.72_0.18_55/0.12)] text-[oklch(0.60_0.20_48)] px-3 py-1 rounded-full">
                    {service.tag}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-[oklch(0.38_0.12_240/0.08)] flex items-center justify-center mb-5 group-hover:bg-[oklch(0.38_0.12_240/0.15)] transition-colors">
                  <service.icon size={22} className="text-[oklch(0.38_0.12_240)]" />
                </div>
                <h3 className="font-display font-bold text-xl text-[oklch(0.18_0.01_250)] mb-3">{service.title}</h3>
                <p className="text-[oklch(0.45_0.02_250)] font-body text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="flex items-center gap-1.5 text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold group-hover:gap-2.5 transition-all">
                  Learn more <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{ backgroundImage: `url(${WATER_BG})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-[oklch(0.18_0.08_245/0.92)]" />
        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 fade-up">
            <div className="text-[oklch(0.72_0.18_55)] text-sm font-body font-semibold uppercase tracking-widest mb-3">The Process</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
              A Simple 3-Step System
            </h2>
            <p className="text-white/70 font-body text-lg leading-relaxed">
              No fluff. No 6-month timelines. We move fast and build systems that work from day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Diagnose",
                desc: "We audit your current digital presence, identify the biggest revenue leaks, and map out exactly what needs to be built.",
                icon: BarChart3,
              },
              {
                step: "02",
                title: "Build",
                desc: "We build your website, automation stack, and ad campaigns — all connected into one revenue-generating system.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Scale",
                desc: "Once the system is live, we optimize, test, and scale what's working. Your pipeline grows while you focus on your business.",
                icon: TrendingUp,
              },
            ].map((item, i) => (
              <div key={item.step} className={`fade-up`} style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="font-display font-bold text-5xl text-[oklch(0.72_0.18_55/0.25)] leading-none">{item.step}</div>
                  </div>
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[oklch(0.72_0.18_55/0.15)] flex items-center justify-center mb-4">
                      <item.icon size={20} className="text-[oklch(0.72_0.18_55)]" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                    <p className="text-white/65 font-body text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ─── */}
      <section className="py-20 lg:py-28 bg-[oklch(0.93_0.02_75)]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">Industries We Serve</div>
              <h2 className="font-display font-bold text-4xl lg:text-5xl text-[oklch(0.18_0.01_250)] leading-tight mb-5">
                Built for High-Margin Businesses
              </h2>
              <p className="text-[oklch(0.45_0.02_250)] font-body text-lg leading-relaxed mb-8">
                We focus on industries where great marketing creates outsized returns. If your average customer is worth $1,000+, we should talk.
              </p>
              <Link href="/contact" className="btn-amber inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold font-body">
                See If We're a Fit <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 fade-up" style={{ transitionDelay: "150ms" }}>
              {[
                { label: "Home Services", icon: "🏠", desc: "HVAC, plumbing, roofing, landscaping" },
                { label: "Healthcare & Med Spa", icon: "⚕️", desc: "Clinics, aesthetics, dental practices" },
                { label: "Legal & Financial", icon: "⚖️", desc: "Law firms, accounting, financial advisors" },
                { label: "Real Estate", icon: "🏗️", desc: "Agents, developers, property management" },
                { label: "B2B Services", icon: "💼", desc: "Consulting, SaaS, professional services" },
                { label: "Retail & E-Commerce", icon: "🛍️", desc: "Local retail, online stores, DTC brands" },
              ].map((industry) => (
                <div key={industry.label} className="bg-white rounded-xl p-5 border border-[oklch(0.88_0.02_75)] hover:border-[oklch(0.38_0.12_240/0.40)] hover:shadow-md transition-all">
                  <div className="text-2xl mb-2">{industry.icon}</div>
                  <div className="font-display font-semibold text-sm text-[oklch(0.18_0.01_250)] mb-1">{industry.label}</div>
                  <div className="text-[oklch(0.55_0.02_250)] text-xs font-body">{industry.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESULTS / PROOF ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14 fade-up">
            <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">Proof It Works</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[oklch(0.18_0.01_250)] leading-tight mb-4">
              Real Results for Real Businesses
            </h2>
            <p className="text-[oklch(0.45_0.02_250)] font-body text-lg leading-relaxed">
              Southwest Michigan businesses that invested in systems — not just websites — saw measurable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                metric: "312%",
                label: "Increase in organic leads",
                detail: "Home services company in Kalamazoo after 6-month SEO campaign",
                color: "oklch(0.38_0.12_240)",
              },
              {
                metric: "$4.20",
                label: "Cost per lead via Google Ads",
                detail: "Medical spa in Grand Rapids — down from $38 before campaign restructure",
                color: "oklch(0.72_0.18_55)",
              },
              {
                metric: "8 days",
                label: "To first qualified lead",
                detail: "B2B consulting firm after new website + LinkedIn automation launch",
                color: "oklch(0.38_0.12_240)",
              },
            ].map((result, i) => (
              <div
                key={result.metric}
                className="rounded-2xl p-8 border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] fade-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="font-display font-bold text-5xl mb-2" style={{ color: `oklch(${result.color})` }}>
                  {result.metric}
                </div>
                <div className="font-display font-semibold text-lg text-[oklch(0.18_0.01_250)] mb-3">{result.label}</div>
                <div className="text-[oklch(0.55_0.02_250)] text-sm font-body leading-relaxed">{result.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 lg:py-28 bg-[oklch(0.98_0.008_80)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-14 fade-up">
            <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">What Clients Say</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-[oklch(0.18_0.01_250)] leading-tight">
              Straight From the Source
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "Before Lake Michigan Marketing, our website was just a digital business card. Now it books 15–20 appointments per week on autopilot.",
                name: "Sarah M.",
                role: "Owner, Kalamazoo Med Spa",
                stars: 5,
              },
              {
                quote: "They built us a system, not just a website. Our Google ranking went from page 4 to position 2 in under 90 days. The leads haven't stopped.",
                name: "Jason K.",
                role: "CEO, Southwest Michigan HVAC",
                stars: 5,
              },
              {
                quote: "I've worked with three agencies before. This is the first team that actually speaks in revenue, not vanity metrics. Night and day difference.",
                name: "Mike T.",
                role: "Principal, Grand Rapids Law Firm",
                stars: 5,
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-7 border border-[oklch(0.88_0.02_75)] shadow-sm fade-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={14} className="fill-[oklch(0.72_0.18_55)] text-[oklch(0.72_0.18_55)]" />
                  ))}
                </div>
                <blockquote className="text-[oklch(0.30_0.01_250)] font-body text-sm leading-relaxed mb-5 italic">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[oklch(0.38_0.12_240/0.12)] flex items-center justify-center">
                    <Users size={14} className="text-[oklch(0.38_0.12_240)]" />
                  </div>
                  <div>
                    <div className="font-body font-semibold text-sm text-[oklch(0.18_0.01_250)]">{t.name}</div>
                    <div className="font-body text-xs text-[oklch(0.55_0.02_250)]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section
        className="relative py-24 lg:py-32 overflow-hidden"
        style={{ backgroundImage: `url(${CTA_BG})`, backgroundSize: "cover", backgroundPosition: "center 30%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.08_245/0.90)] to-[oklch(0.15_0.08_245/0.75)]" />
        <div className="container relative z-10 text-center">
          <div className="max-w-2xl mx-auto fade-up">
            <div className="text-[oklch(0.72_0.18_55)] text-sm font-body font-semibold uppercase tracking-widest mb-4">Ready to Grow?</div>
            <h2 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-5">
              Stop Leaving Revenue<br />on the Table
            </h2>
            <p className="text-white/75 font-body text-lg leading-relaxed mb-8">
              Get a free, no-obligation growth plan for your business. We'll show you exactly where you're losing leads and how to fix it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-amber px-8 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2 justify-center">
                Get Your Free Growth Plan <ArrowRight size={18} />
              </Link>
              <Link href="/about" className="px-8 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2 justify-center border border-white/30 text-white hover:bg-white/10 transition-colors">
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATION LINKS ─── */}
      <section className="py-12 bg-[oklch(0.25_0.10_245)]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm font-body">Serving businesses across Southwest Michigan:</p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Kalamazoo Marketing Agency", href: "/kalamazoo-marketing-agency" },
                { label: "Grand Rapids Digital Marketing", href: "/grand-rapids-marketing-agency" },
                { label: "Southwest Michigan SEO", href: "/southwest-michigan-digital-marketing" },
              ].map((loc) => (
                <Link
                  key={loc.href}
                  href={loc.href}
                  className="text-xs font-body text-white/70 hover:text-[oklch(0.72_0.18_55)] border border-white/20 hover:border-[oklch(0.72_0.18_55/0.50)] px-3 py-1.5 rounded-full transition-colors"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
