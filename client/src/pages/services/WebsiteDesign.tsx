/*
 * Website Design Service Page — Lake Michigan Marketing
 * SEO: "Website Design Kalamazoo", "Web Design Southwest Michigan"
 */
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Monitor } from "lucide-react";

export default function WebsiteDesign() {
  return (
    <ServicePageTemplate
      metaTitle="Website Design Kalamazoo | Lake Michigan Marketing"
      metaDescription="Custom website design in Kalamazoo and Southwest Michigan. We build fast, SEO-optimized, conversion-focused websites that generate real leads."
      heroTagline="Website Design Southwest Michigan"
      title="Websites That Work as Hard as You Do"
      subtitle="Your website should be your best salesperson — working 24/7 to attract, educate, and convert visitors into leads."
      description="We design and build custom websites for Southwest Michigan businesses that are fast, SEO-optimized, and engineered to convert. No templates. No shortcuts. Just a system that generates revenue."
      icon={<Monitor size={24} />}
      benefits={[
        "Mobile-first design that converts on every device",
        "Built-in SEO structure from the ground up — not bolted on later",
        "Integrated lead capture forms connected to your CRM",
        "Page speed optimized for Google Core Web Vitals",
        "Clear conversion paths that guide visitors to take action",
        "Analytics and tracking set up from day one",
      ]}
      features={[
        { title: "Custom Design", desc: "Every site is designed from scratch to match your brand and convert your specific audience." },
        { title: "SEO Foundation", desc: "Proper heading hierarchy, meta tags, schema markup, and internal linking built in from the start." },
        { title: "Lead Capture System", desc: "Forms, CTAs, and landing pages engineered to capture contact information and trigger automations." },
        { title: "Speed Optimization", desc: "Optimized images, clean code, and CDN delivery for sub-2-second load times." },
        { title: "CRM Integration", desc: "Connect your website directly to your CRM so no lead falls through the cracks." },
        { title: "Analytics Setup", desc: "Google Analytics 4, Search Console, and conversion tracking configured and verified." },
        { title: "Mobile-First Build", desc: "Designed for mobile users first — where most of your traffic comes from." },
        { title: "Ongoing Support", desc: "Monthly maintenance, updates, and optimization so your site keeps improving." },
        { title: "Copywriting", desc: "Conversion-focused copy written for your audience, not just to fill space." },
      ]}
      faqs={[
        {
          q: "How long does it take to build a website?",
          a: "Most projects are completed in 3–6 weeks depending on complexity. We move fast without sacrificing quality. You'll have a working prototype within the first week.",
        },
        {
          q: "Do you use WordPress or custom code?",
          a: "We use the right tool for the job. For most businesses, we build on modern frameworks that are fast, secure, and easy to update. We avoid bloated page builders that slow down your site.",
        },
        {
          q: "Will my website rank on Google?",
          a: "We build every site with SEO best practices baked in — proper structure, fast load times, and local optimization. For aggressive ranking goals, we recommend pairing your website with our SEO services.",
        },
        {
          q: "Can you redesign my existing website?",
          a: "Yes. We can redesign and rebuild your existing site while preserving your SEO equity and improving your conversion rate.",
        },
        {
          q: "Do you serve businesses outside of Kalamazoo?",
          a: "Absolutely. We work with businesses throughout Southwest Michigan including Grand Rapids, Portage, Battle Creek, and beyond.",
        },
      ]}
      relatedServices={[
        { label: "SEO Services", href: "/services/seo-services" },
        { label: "CRM & Automation", href: "/services/crm-automation" },
        { label: "Lead Generation", href: "/services/lead-generation" },
      ]}
      locations={[
        { label: "Kalamazoo, MI", href: "/kalamazoo-marketing-agency" },
        { label: "Grand Rapids, MI", href: "/grand-rapids-marketing-agency" },
        { label: "Southwest Michigan", href: "/southwest-michigan-digital-marketing" },
      ]}
    />
  );
}
