/*
 * Contact / Lead Capture Page — Lake Michigan Marketing
 * Coastal Modernism: clean form, strong CTA, trust signals
 * SEO: "Contact Marketing Agency Kalamazoo", "Free Marketing Consultation Southwest Michigan"
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight, CheckCircle2, Mail, MapPin, Clock } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission — ready for webhook/API integration
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.008_80)]">
      <Navigation />

      {/* Hero */}
      <section className="bg-[oklch(0.22_0.10_245)] pt-32 pb-16">
        <div className="container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[oklch(0.72_0.18_55/0.15)] border border-[oklch(0.72_0.18_55/0.40)] rounded-full px-4 py-1.5 mb-5">
              <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-semibold uppercase tracking-wider">Free Growth Plan</span>
            </div>
            <h1 className="font-display font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
              Let's Build Your Growth Plan
            </h1>
            <p className="text-white/70 font-body text-lg leading-relaxed">
              Fill out the form and we'll reach out within 24 hours to schedule your free strategy call. No sales pressure. Just a clear plan for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Form */}
            <div className="lg:col-span-2 fade-up">
              {submitted ? (
                <div className="bg-white rounded-2xl p-10 border border-[oklch(0.88_0.02_75)] text-center">
                  <div className="w-16 h-16 rounded-full bg-[oklch(0.38_0.12_240/0.10)] flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={32} className="text-[oklch(0.38_0.12_240)]" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-[oklch(0.18_0.01_250)] mb-3">You're All Set!</h2>
                  <p className="text-[oklch(0.45_0.02_250)] font-body text-base leading-relaxed mb-6">
                    We've received your information and will reach out within 24 hours to schedule your free growth plan call.
                  </p>
                  <Link href="/" className="btn-lake inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold font-body text-white">
                    Back to Home <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 lg:p-10 border border-[oklch(0.88_0.02_75)] shadow-sm">
                  <h2 className="font-display font-bold text-2xl text-[oklch(0.18_0.01_250)] mb-2">Get Your Free Growth Plan</h2>
                  <p className="text-[oklch(0.55_0.02_250)] font-body text-sm mb-7">Takes less than 2 minutes. No credit card required.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-body font-semibold text-[oklch(0.35_0.02_250)] uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder="John Smith"
                          className="w-full px-4 py-3 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] text-[oklch(0.18_0.01_250)] font-body text-sm placeholder:text-[oklch(0.70_0.01_250)] focus:outline-none focus:border-[oklch(0.38_0.12_240)] focus:ring-2 focus:ring-[oklch(0.38_0.12_240/0.15)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-body font-semibold text-[oklch(0.35_0.02_250)] uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder="john@yourbusiness.com"
                          className="w-full px-4 py-3 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] text-[oklch(0.18_0.01_250)] font-body text-sm placeholder:text-[oklch(0.70_0.01_250)] focus:outline-none focus:border-[oklch(0.38_0.12_240)] focus:ring-2 focus:ring-[oklch(0.38_0.12_240/0.15)] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-body font-semibold text-[oklch(0.35_0.02_250)] uppercase tracking-wider mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="(269) 555-0100"
                          className="w-full px-4 py-3 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] text-[oklch(0.18_0.01_250)] font-body text-sm placeholder:text-[oklch(0.70_0.01_250)] focus:outline-none focus:border-[oklch(0.38_0.12_240)] focus:ring-2 focus:ring-[oklch(0.38_0.12_240/0.15)] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-body font-semibold text-[oklch(0.35_0.02_250)] uppercase tracking-wider mb-2">
                          Business Type *
                        </label>
                        <select
                          name="businessType"
                          required
                          value={form.businessType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] text-[oklch(0.18_0.01_250)] font-body text-sm focus:outline-none focus:border-[oklch(0.38_0.12_240)] focus:ring-2 focus:ring-[oklch(0.38_0.12_240/0.15)] transition-all"
                        >
                          <option value="" disabled>Select your industry</option>
                          <option value="home-services">Home Services (HVAC, Plumbing, etc.)</option>
                          <option value="healthcare">Healthcare / Med Spa</option>
                          <option value="legal">Legal / Financial Services</option>
                          <option value="real-estate">Real Estate</option>
                          <option value="b2b">B2B / Professional Services</option>
                          <option value="retail">Retail / E-Commerce</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-body font-semibold text-[oklch(0.35_0.02_250)] uppercase tracking-wider mb-2">
                        Tell Us About Your Business
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="What's your biggest marketing challenge right now? What does success look like in 6 months?"
                        className="w-full px-4 py-3 rounded-lg border border-[oklch(0.88_0.02_75)] bg-[oklch(0.98_0.008_80)] text-[oklch(0.18_0.01_250)] font-body text-sm placeholder:text-[oklch(0.70_0.01_250)] focus:outline-none focus:border-[oklch(0.38_0.12_240)] focus:ring-2 focus:ring-[oklch(0.38_0.12_240/0.15)] transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-amber w-full py-4 rounded-lg text-base font-semibold font-body flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Get My Free Growth Plan <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-[oklch(0.60_0.01_250)] font-body">
                      We respect your privacy. No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-6 fade-up" style={{ transitionDelay: "150ms" }}>
              {/* What to expect */}
              <div className="bg-[oklch(0.25_0.10_245)] rounded-2xl p-6">
                <h3 className="font-display font-bold text-base text-white mb-4">What Happens Next</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", text: "We review your submission within 24 hours" },
                    { step: "2", text: "We schedule a 30-minute strategy call" },
                    { step: "3", text: "We audit your digital presence and identify opportunities" },
                    { step: "4", text: "We present your custom growth plan — free, no strings" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[oklch(0.72_0.18_55/0.20)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[oklch(0.72_0.18_55)] text-xs font-body font-bold">{item.step}</span>
                      </div>
                      <p className="text-white/70 text-sm font-body leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="bg-white rounded-2xl p-6 border border-[oklch(0.88_0.02_75)]">
                <h3 className="font-display font-bold text-base text-[oklch(0.18_0.01_250)] mb-4">Contact Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-body text-[oklch(0.45_0.02_250)]">
                    <Mail size={14} className="text-[oklch(0.38_0.12_240)]" />
                    hello@lakemichiganmarketing.com
                  </div>
                  <div className="flex items-center gap-3 text-sm font-body text-[oklch(0.45_0.02_250)]">
                    <MapPin size={14} className="text-[oklch(0.38_0.12_240)]" />
                    Southwest Michigan
                  </div>
                  <div className="flex items-center gap-3 text-sm font-body text-[oklch(0.45_0.02_250)]">
                    <Clock size={14} className="text-[oklch(0.38_0.12_240)]" />
                    Response within 24 hours
                  </div>
                </div>
              </div>

              {/* Trust signals */}
              <div className="bg-[oklch(0.93_0.02_75)] rounded-2xl p-6">
                <h3 className="font-display font-bold text-base text-[oklch(0.18_0.01_250)] mb-4">Why Work With Us</h3>
                <ul className="space-y-2.5">
                  {[
                    "No long-term contracts",
                    "Results-focused reporting",
                    "Local Southwest Michigan team",
                    "Fast execution — results in 30 days",
                    "Revenue-first strategy",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-body text-[oklch(0.35_0.02_250)]">
                      <CheckCircle2 size={14} className="text-[oklch(0.38_0.12_240)] flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
