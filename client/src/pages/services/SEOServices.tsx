/*
 * SEO Services Page — Lake Michigan Marketing
 * SEO: "SEO Kalamazoo", "SEO Agency Southwest Michigan", "Local SEO Michigan"
 */
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Search } from "lucide-react";

export default function SEOServices() {
  return (
    <ServicePageTemplate
      metaTitle="SEO Services Kalamazoo & Southwest Michigan | Lake Michigan Marketing"
      metaDescription="Local SEO services for Kalamazoo and Southwest Michigan businesses. We rank you at the top of Google for your most valuable keywords and drive qualified organic traffic."
      heroTagline="SEO Services Southwest Michigan"
      title="Rank at the Top of Google. Stay There."
      subtitle="SEO is the highest-ROI marketing channel for local businesses — when it's done right. We build rankings that compound over time."
      description="We provide local and technical SEO services for Southwest Michigan businesses that want to dominate Google search results. Our approach is data-driven, transparent, and built for long-term results."
      icon={<Search size={24} />}
      benefits={[
        "Rank for 'Marketing Agency Kalamazoo' and other high-value local keywords",
        "Organic traffic that compounds month over month — no ad spend required",
        "Google Business Profile optimization for local map pack rankings",
        "Technical SEO audits that fix issues hurting your rankings",
        "Content strategy that attracts buyers, not just browsers",
        "Monthly reporting with keyword rankings, traffic, and lead attribution",
      ]}
      features={[
        { title: "Local SEO", desc: "Optimize for 'near me' searches and local keywords in Kalamazoo, Grand Rapids, and Southwest Michigan." },
        { title: "Google Business Profile", desc: "Complete GBP optimization including posts, photos, Q&A, and review management." },
        { title: "Technical SEO Audit", desc: "Fix site speed, crawlability, indexation, and Core Web Vitals issues that hurt rankings." },
        { title: "Keyword Research", desc: "Identify the exact terms your buyers are searching and build a strategy around them." },
        { title: "On-Page Optimization", desc: "Optimize title tags, meta descriptions, headings, and content for target keywords." },
        { title: "Content Strategy", desc: "Blog posts, service pages, and location pages that rank and convert." },
        { title: "Link Building", desc: "Earn high-quality backlinks from local and industry-relevant sources." },
        { title: "Citation Building", desc: "Build and clean up your business listings across all major directories." },
        { title: "Competitor Analysis", desc: "Understand exactly what your competitors are doing and build a strategy to outrank them." },
      ]}
      faqs={[
        {
          q: "How long does SEO take to show results?",
          a: "Most clients see meaningful ranking improvements within 60–90 days. Significant traffic and lead increases typically happen at the 4–6 month mark. SEO is a long-term investment with compounding returns.",
        },
        {
          q: "Do you guarantee rankings?",
          a: "No reputable SEO agency guarantees specific rankings — Google's algorithm is complex and constantly changing. What we guarantee is a transparent, proven process and measurable progress every month.",
        },
        {
          q: "What keywords will you target?",
          a: "We start with a thorough keyword research process to identify the terms your ideal customers are actually searching. We prioritize keywords with high purchase intent and realistic ranking potential.",
        },
        {
          q: "Do I need SEO if I'm already running Google Ads?",
          a: "Yes. SEO and paid ads work best together. Ads give you immediate visibility while SEO builds long-term organic traffic. Many businesses reduce their ad spend over time as SEO traffic grows.",
        },
        {
          q: "Do you work with businesses outside of Kalamazoo?",
          a: "Yes. We provide SEO services throughout Southwest Michigan including Grand Rapids, Portage, Battle Creek, St. Joseph, and beyond.",
        },
      ]}
      relatedServices={[
        { label: "Website Design", href: "/services/website-design" },
        { label: "Lead Generation", href: "/services/lead-generation" },
        { label: "CRM & Automation", href: "/services/crm-automation" },
      ]}
      locations={[
        { label: "Kalamazoo, MI", href: "/kalamazoo-marketing-agency" },
        { label: "Grand Rapids, MI", href: "/grand-rapids-marketing-agency" },
        { label: "Southwest Michigan", href: "/southwest-michigan-digital-marketing" },
      ]}
    />
  );
}
