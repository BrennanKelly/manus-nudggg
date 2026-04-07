/*
 * CRM & Automation Service Page — Lake Michigan Marketing
 * SEO: "CRM Automation Michigan", "Marketing Automation Kalamazoo"
 */
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { Settings } from "lucide-react";

export default function CRMAutomation() {
  return (
    <ServicePageTemplate
      metaTitle="CRM & Marketing Automation | Lake Michigan Marketing"
      metaDescription="Connect your marketing to your sales pipeline with CRM and automation systems built for Southwest Michigan businesses. Stop losing leads to slow follow-up."
      heroTagline="CRM & Automation Southwest Michigan"
      title="Stop Losing Leads to Slow Follow-Up"
      subtitle="The money is in the follow-up. Most businesses lose 70% of their leads because they don't have a system. We build the system."
      description="We design and implement CRM and automation systems that capture every lead, nurture them automatically, and alert your team at the perfect moment to close the deal."
      icon={<Settings size={24} />}
      benefits={[
        "Automated follow-up sequences that respond within minutes, not days",
        "Lead scoring so your team focuses on the hottest prospects",
        "Pipeline visibility — see every deal and where it stands",
        "Email and SMS automation that feels personal, not robotic",
        "Integration with your website, ads, and social media",
        "Reporting that shows you exactly what's generating revenue",
      ]}
      features={[
        { title: "CRM Setup & Configuration", desc: "We configure your CRM (or recommend the right one) to match your exact sales process." },
        { title: "Lead Capture Integration", desc: "Every form, ad, and landing page feeds directly into your CRM automatically." },
        { title: "Automated Follow-Up Sequences", desc: "Email and SMS sequences that nurture leads from first contact to closed deal." },
        { title: "Pipeline Management", desc: "Custom pipeline stages and deal tracking so nothing falls through the cracks." },
        { title: "Task & Alert Automation", desc: "Automatic tasks and alerts trigger when leads take specific actions." },
        { title: "Reporting Dashboard", desc: "Real-time dashboards showing lead volume, conversion rates, and revenue attribution." },
        { title: "Team Training", desc: "We train your team to use the system so adoption is high from day one." },
        { title: "Ongoing Optimization", desc: "Monthly reviews to improve sequences, fix drop-off points, and increase conversions." },
        { title: "Third-Party Integrations", desc: "Connect your CRM to your calendar, phone system, accounting software, and more." },
      ]}
      faqs={[
        {
          q: "Which CRM platforms do you work with?",
          a: "We work with most major CRM platforms including GoHighLevel, HubSpot, Salesforce, and Pipedrive. We'll recommend the best fit based on your business size and budget.",
        },
        {
          q: "How quickly can automation be set up?",
          a: "A basic automation system can be live in 1–2 weeks. More complex multi-channel systems typically take 3–4 weeks to build and test properly.",
        },
        {
          q: "Do I need a big team to use a CRM?",
          a: "Not at all. Many of our clients are solo operators or small teams. The right CRM actually reduces the workload on your team by automating repetitive tasks.",
        },
        {
          q: "Can you integrate with my existing tools?",
          a: "Yes. We integrate with most common business tools including Google Workspace, Calendly, QuickBooks, Stripe, and hundreds of others via native integrations or Zapier.",
        },
        {
          q: "What's the ROI on CRM automation?",
          a: "Our clients typically see a 2–5x increase in lead-to-close rates within 90 days of implementing a proper automation system. The ROI is usually very fast.",
        },
      ]}
      relatedServices={[
        { label: "Website Design", href: "/services/website-design" },
        { label: "Lead Generation", href: "/services/lead-generation" },
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
