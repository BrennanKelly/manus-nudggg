/*
 * ServicePageTemplate — Lake Michigan Marketing
 * Coastal Modernism: reusable service page layout with SEO structure
 */
import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";

interface FAQ {
  q: string;
  a: string;
}

interface ServicePageProps {
  title: string;
  subtitle: string;
  heroTagline: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  benefits: string[];
  features: { title: string; desc: string }[];
  faqs: FAQ[];
  relatedServices: { label: string; href: string }[];
  locations: { label: string; href: string }[];
  icon: React.ReactNode;
}

export default function ServicePageTemplate({
  title,
  subtitle,
  heroTagline,
  description,
  benefits,
  features,
  faqs,
  relatedServices,
  locations,
  icon,
}: ServicePageProps) {
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
              <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-semibold uppercase tracking-wider">{heroTagline}</span>
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-5">
              {title}
            </h1>
            <p className="text-white/70 font-body text-lg leading-relaxed mb-8 max-w-xl">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="btn-amber px-7 py-4 rounded-lg text-base font-semibold font-body inline-flex items-center gap-2">
                Get a Free Growth Plan <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">Why It Matters</div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-5">
                {subtitle}
              </h2>
              <ul className="flex flex-col gap-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[oklch(0.35_0.02_250)] font-body text-sm leading-relaxed">
                    <CheckCircle2 size={16} className="text-[oklch(0.38_0.12_240)] mt-0.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="fade-up flex items-center justify-center" style={{ transitionDelay: "150ms" }}>
              <div className="w-40 h-40 rounded-3xl bg-[oklch(0.38_0.12_240/0.08)] flex items-center justify-center">
                <div className="text-[oklch(0.38_0.12_240)] scale-[2.5]">{icon}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20 bg-[oklch(0.93_0.02_75)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-12 fade-up">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-3">
              What's Included
            </h2>
            <p className="text-[oklch(0.45_0.02_250)] font-body text-base leading-relaxed">
              Every engagement is built around your specific goals — not a one-size-fits-all package.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-[oklch(0.88_0.02_75)] fade-up"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="w-2 h-6 rounded-full bg-[oklch(0.38_0.12_240)] mb-4" />
                <h3 className="font-display font-semibold text-base text-[oklch(0.18_0.01_250)] mb-2">{f.title}</h3>
                <p className="text-[oklch(0.50_0.02_250)] font-body text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 fade-up">
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-3">
                Frequently Asked Questions
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

      {/* Internal links */}
      <section className="py-12 bg-[oklch(0.93_0.02_75)]">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {relatedServices.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-base text-[oklch(0.18_0.01_250)] mb-4">Related Services</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => (
                    <Link key={s.href} href={s.href} className="text-sm font-body text-[oklch(0.38_0.12_240)] border border-[oklch(0.38_0.12_240/0.30)] px-3 py-1.5 rounded-full hover:bg-[oklch(0.38_0.12_240/0.08)] transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {locations.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-base text-[oklch(0.18_0.01_250)] mb-4">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {locations.map((l) => (
                    <Link key={l.href} href={l.href} className="text-sm font-body text-[oklch(0.38_0.12_240)] border border-[oklch(0.38_0.12_240/0.30)] px-3 py-1.5 rounded-full hover:bg-[oklch(0.38_0.12_240/0.08)] transition-colors">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[oklch(0.25_0.10_245)]">
        <div className="container text-center">
          <div className="max-w-xl mx-auto fade-up">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/70 font-body text-base leading-relaxed mb-7">
              Get a free growth plan and see exactly how we'd approach your business.
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
        <ChevronDown size={16} className={`flex-shrink-0 text-[oklch(0.38_0.12_240)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 py-4 bg-[oklch(0.98_0.008_80)] border-t border-[oklch(0.88_0.02_75)]">
          <p className="text-[oklch(0.45_0.02_250)] font-body text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

// Need React import for useState in FAQItem
import React from "react";
