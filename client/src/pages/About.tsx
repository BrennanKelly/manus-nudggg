/*
 * About Page — Lake Michigan Marketing
 * Coastal Modernism: personal but sharp, systems-focused positioning
 * SEO: "About Lake Michigan Marketing", "Southwest Michigan Marketing Agency"
 */
import { useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, Zap, BarChart3, Settings, TrendingUp } from "lucide-react";

const ABOUT_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663365056642/fQKrt4t3F2Ag4VrJFMx6DM/about-bg-MeConSmHLS8mcQLDh4W3GP.webp";

export default function About() {
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
      <section
        className="relative pt-32 pb-24 overflow-hidden"
        style={{ backgroundImage: `url(${ABOUT_BG})`, backgroundSize: "cover", backgroundPosition: "center 40%" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.08_245/0.90)] to-[oklch(0.15_0.08_245/0.65)]" />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.18_55/0.15)] border border-[oklch(0.72_0.18_55/0.40)] rounded-full px-4 py-1.5 mb-5">
              <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-semibold uppercase tracking-wider">About Us</span>
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-6xl text-white leading-tight mb-5">
              We Build Systems,<br />Not Just Websites
            </h1>
            <p className="text-white/75 font-body text-lg leading-relaxed">
              Lake Michigan Marketing was built on a simple belief: most businesses don't have a marketing problem — they have a systems problem. We fix that.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="fade-up">
              <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">Our Story</div>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-6">
                Built by Operators, for Operators
              </h2>
              <div className="space-y-4 text-[oklch(0.40_0.02_250)] font-body text-base leading-relaxed">
                <p>
                  We started Lake Michigan Marketing because we kept seeing the same problem: great businesses with terrible digital presence. Owners who were exceptional at their craft but invisible online. Companies spending money on marketing that couldn't tell you if it was working.
                </p>
                <p>
                  We're not a traditional agency. We're a hybrid of technical builders, marketing strategists, and sales systems thinkers. We approach every client engagement like we're building infrastructure for our own business — because we know what it feels like to have a leaky pipeline.
                </p>
                <p>
                  Based in Southwest Michigan, we work with businesses from Kalamazoo to Grand Rapids and everywhere in between. We know this market. We know what works here. And we're obsessed with building systems that generate real, measurable revenue.
                </p>
              </div>
            </div>

            <div className="fade-up" style={{ transitionDelay: "150ms" }}>
              <div className="bg-[oklch(0.93_0.02_75)] rounded-2xl p-8">
                <h3 className="font-display font-bold text-xl text-[oklch(0.18_0.01_250)] mb-6">How We Think</h3>
                <div className="space-y-5">
                  {[
                    {
                      icon: BarChart3,
                      title: "Revenue First",
                      desc: "Every strategy starts with one question: how does this generate revenue? We don't chase vanity metrics.",
                    },
                    {
                      icon: Settings,
                      title: "Systems Thinking",
                      desc: "We build connected systems — not isolated tactics. Your website, SEO, ads, and CRM should work together.",
                    },
                    {
                      icon: Zap,
                      title: "Speed Matters",
                      desc: "We move fast. Most clients see their first results within 30 days. We don't believe in 6-month timelines to see any progress.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Compounding Growth",
                      desc: "The best marketing investments compound over time. We build assets that keep working long after the initial investment.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-[oklch(0.38_0.12_240/0.10)] flex items-center justify-center flex-shrink-0">
                        <item.icon size={16} className="text-[oklch(0.38_0.12_240)]" />
                      </div>
                      <div>
                        <div className="font-display font-semibold text-sm text-[oklch(0.18_0.01_250)] mb-1">{item.title}</div>
                        <div className="text-[oklch(0.50_0.02_250)] text-sm font-body leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-[oklch(0.93_0.02_75)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto mb-14 fade-up">
            <div className="text-[oklch(0.38_0.12_240)] text-sm font-body font-semibold uppercase tracking-widest mb-3">The Difference</div>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-[oklch(0.18_0.01_250)] leading-tight mb-4">
              Not Your Average Agency
            </h2>
            <p className="text-[oklch(0.45_0.02_250)] font-body text-base leading-relaxed">
              Most agencies sell you a service. We build you a system. Here's what that means in practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {
                them: "Build a website and hand it over",
                us: "Build a website connected to your CRM, analytics, and automation",
              },
              {
                them: "Report on traffic and impressions",
                us: "Report on leads, cost per lead, and revenue attribution",
              },
              {
                them: "12-month contracts with no performance guarantees",
                us: "Month-to-month — we earn your business every month",
              },
              {
                them: "One-size-fits-all packages",
                us: "Custom strategies built around your specific business goals",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-[oklch(0.88_0.02_75)] fade-up" style={{ transitionDelay: `${i * 70}ms` }}>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-xs font-body font-semibold text-[oklch(0.65_0.02_250)] uppercase tracking-wider mb-2">Others</div>
                    <p className="text-sm text-[oklch(0.55_0.02_250)] font-body line-through leading-relaxed">{item.them}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[oklch(0.88_0.02_75)]">
                  <div className="text-xs font-body font-semibold text-[oklch(0.38_0.12_240)] uppercase tracking-wider mb-2">Lake Michigan Marketing</div>
                  <p className="text-sm text-[oklch(0.25_0.01_250)] font-body font-medium leading-relaxed">{item.us}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[oklch(0.25_0.10_245)]">
        <div className="container text-center">
          <div className="max-w-xl mx-auto fade-up">
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-4">
              Let's Build Something That Works
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
