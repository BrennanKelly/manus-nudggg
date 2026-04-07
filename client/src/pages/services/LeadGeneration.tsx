/*
 * Lead Generation Service Page — Lake Michigan Marketing
 * SEO: "Google Ads Kalamazoo", "Lead Generation Southwest Michigan", "LinkedIn Ads Michigan"
 */
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Target } from "lucide-react";

export default function LeadGeneration() {
  return (
    <ServicePageTemplate
      metaTitle="Lead Generation & Google Ads Kalamazoo | Lake Michigan Marketing"
      metaDescription="Google Ads and LinkedIn Ads management for Southwest Michigan businesses. We build paid ad campaigns that deliver qualified leads, not just clicks."
      heroTagline="Lead Generation Southwest Michigan"
      title="Qualified Leads on Demand"
      subtitle="Paid advertising that pays for itself. We build Google Ads and LinkedIn campaigns that deliver real buyers — not tire kickers."
      description="We manage Google Ads and LinkedIn Ads campaigns for Southwest Michigan businesses that need a predictable, scalable lead flow. Every dollar is tracked, every campaign is optimized for cost per lead — not vanity metrics."
      icon={<Target size={24} />}
      benefits={[
        "Google Ads campaigns targeting buyers with high purchase intent",
        "LinkedIn Ads for B2B businesses targeting decision-makers",
        "Full-funnel tracking — from click to closed deal",
        "Dedicated landing pages built to convert ad traffic",
        "Weekly reporting with clear ROI metrics",
        "No long-term contracts — we earn your business every month",
      ]}
      features={[
        { title: "Google Search Ads", desc: "Capture buyers actively searching for your services in Kalamazoo and Southwest Michigan." },
        { title: "Google Local Service Ads", desc: "Appear at the very top of local searches with Google's trust badge." },
        { title: "LinkedIn Ads", desc: "Target decision-makers by job title, company size, and industry for B2B lead generation." },
        { title: "Landing Page Creation", desc: "Dedicated landing pages built to convert ad traffic — not your homepage." },
        { title: "Conversion Tracking", desc: "Full tracking setup so you know exactly which ads are generating revenue." },
        { title: "A/B Testing", desc: "Continuous testing of headlines, offers, and landing pages to improve performance." },
        { title: "Audience Targeting", desc: "Precise targeting by location, demographics, interests, and search behavior." },
        { title: "Retargeting Campaigns", desc: "Re-engage website visitors who didn't convert the first time." },
        { title: "Monthly Reporting", desc: "Clear, jargon-free reports showing leads, cost per lead, and ROI." },
      ]}
      faqs={[
        {
          q: "How much should I budget for Google Ads?",
          a: "We typically recommend a minimum ad spend of $1,000–$2,000/month for meaningful results in competitive local markets. We'll give you a specific recommendation based on your industry and goals.",
        },
        {
          q: "How quickly will I see leads?",
          a: "Google Search Ads can start generating leads within the first week. The first 30 days are typically a learning period where we optimize for your best-performing keywords and audiences.",
        },
        {
          q: "Do you manage the ad account or just set it up?",
          a: "We provide full ongoing management — setup, optimization, testing, and monthly reporting. We're actively managing your campaigns every week, not just checking in quarterly.",
        },
        {
          q: "What industries do you run ads for?",
          a: "We specialize in high-margin local businesses: home services, healthcare, legal, financial services, real estate, and B2B. These industries have the highest ROI from paid advertising.",
        },
        {
          q: "Can you run ads for my business in multiple cities?",
          a: "Yes. We can target multiple cities and regions simultaneously, with separate campaigns optimized for each location.",
        },
      ]}
      relatedServices={[
        { label: "Website Design", href: "/services/website-design" },
        { label: "CRM & Automation", href: "/services/crm-automation" },
        { label: "SEO Services", href: "/services/seo-services" },
      ]}
      locations={[
        { label: "Kalamazoo, MI", href: "/kalamazoo-marketing-agency" },
        { label: "Grand Rapids, MI", href: "/grand-rapids-marketing-agency" },
        { label: "Southwest Michigan", href: "/southwest-michigan-digital-marketing" },
      ]}
    />
  );
}
