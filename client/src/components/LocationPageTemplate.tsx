/*
 * LocationPageTemplate — Lake Michigan Marketing
 * Coastal Modernism: local SEO page layout with location-specific content
 */
import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

interface LocationPageProps {
  city: string;
  state: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  localContext: string;
  services: { title: string; desc: string; href: string }[];
  whyUs: string[];
  faqs: { q: string; a: string }[];
  nearbyAreas: string[];
  keywords: string[];
}

export default function LocationPageTemplate({
  city,
  state,
  heroTitle,
  heroSubtitle,
  description,
  localContext,
  services,
  whyUs,
  faqs,
  nearbyAreas,
  keywords,
}: LocationPageProps) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.008_80)]">
      <Navigation />

      {/* Hero */}
      <section className="bg-[oklch(0.22_0.10_245)] pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.18_55/0.15)] border border-[oklch(0.72_0.18_55/0.40)] rounded-full px-4 py-1.5 mb-5">
              <MapPin size={12} className="text-[oklch(0.72_0.18_55)]" />
              <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-semibold uppercase tracking-wider">{city}, {state}</span>
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-5">
              {heroTitle}
            </h1>
            <p className="text-white/70 font-body text-lg leading-relaxed mb-8 max-w-xl">{heroSubtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-amber px-7 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2">
                Get a Free Growth Plan <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Local Context */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="fade-up">
              <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">About Our Work in {city}</div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-5">
                {description}
              </h2>
              <p className="text-[oklch(0.45_0.02_250)] font-body text-base leading-relaxed">
                {localContext}
              </p>
            </div>
            <div className="fade-up" style={{ transitionDelay: "150ms" }}>
              <h3 className="font-display font-semibold text-lg text-[oklch(0.18_0.01_250)] mb-4">Why {city} Businesses Choose Us</h3>
              <ul className="flex flex-col gap-3">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[oklch(0.35_0.02_250)] font-body text-sm leading-relaxed">
                    <CheckCircle2 size={16} className="text-[oklch(0.38_0.12_240)] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-[oklch(0.93_0.02_75)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12 fade-up">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-3">
              Marketing Services in {city}, {state}
            </h2>
            <p className="text-[oklch(0.45_0.02_250)] font-body text-base leading-relaxed">
              Everything you need to dominate your local market and generate consistent leads.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s, i) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white rounded-xl p-6 border border-[oklch(0.88_0.02_75)] hover:border-[oklch(0.38_0.12_240)] hover:shadow-lg transition-all fade-up"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <h3 className="font-display font-bold text-lg text-[oklch(0.18_0.01_250)] mb-2">{s.title}</h3>
                <p className="text-[oklch(0.50_0.02_250)] font-body text-sm leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-1.5 text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold group-hover:gap-2.5 transition-all">
                  Learn more <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-3">
                FAQs — Marketing Agency {city}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} delay={i * 60} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      {nearbyAreas.length > 0 && (
        <section className="py-10 bg-[oklch(0.93_0.02_75)]">
          <div className="container">
            <p className="text-[oklch(0.50_0.02_250)] text-sm font-body mb-3">Also serving nearby areas:</p>
            <div className="flex flex-wrap gap-2">
              {nearbyAreas.map((area) => (
                <span key={area} className="text-xs font-body text-[oklch(0.38_0.12_240)] border border-[oklch(0.38_0.12_240/0.30)] px-3 py-1.5 rounded-full">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-[oklch(0.25_0.10_245)]">
        <div className="container text-center">
          <div className="max-w-xl mx-auto fade-up">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-4">
              Ready to Grow Your {city} Business?
            </h2>
            <p className="text-white/70 font-body text-base leading-relaxed mb-7">
              Get a free, no-obligation growth plan tailored to your business and market.
            </p>
            <Link href="/contact" className="btn-amber inline-flex items-center gap-2 px-8 py-4 rounded-lg text-base font-semibold font-body">
              Get Your Free Growth Plan <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React from "react";
function FAQItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div
      className="border border-[oklch(0.88_0.02_75)] rounded-xl overflow-hidden fade-up"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-[oklch(0.98_0.008_80)] transition-colors"
      >
        <span className="font-display font-semibold text-sm text-[oklch(0.18_0.01_250)] pr-4">{q}</span>
        <span className={`flex-shrink-0 text-[oklch(0.38_0.12_240)] transition-transform text-lg ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      {open && (
        <div className="px-6 py-4 bg-[oklch(0.98_0.008_80)] border-t border-[oklch(0.88_0.02_75)]">
          <p className="text-[oklch(0.45_0.02_250)] font-body text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
