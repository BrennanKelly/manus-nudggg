/*
 * Grand Rapids Location Page — Lake Michigan Marketing
 * SEO: "Marketing Agency Grand Rapids", "Digital Marketing Grand Rapids MI"
 */
import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function GrandRapids() {
  return (
    <LocationPageTemplate
      city="Grand Rapids"
      state="MI"
      heroTitle="Marketing Agency Grand Rapids, MI"
      heroSubtitle="Grand Rapids is one of the fastest-growing cities in the Midwest. We help local businesses capture that growth with digital systems that generate consistent, qualified leads."
      description="Grand Rapids' Revenue-Focused Marketing Partner"
      localContext="Grand Rapids has emerged as a major Midwest business hub — with a thriving healthcare sector, a booming craft economy, and a growing tech and professional services scene. Competition for local customers is intense. We help Grand Rapids businesses cut through the noise with data-driven marketing strategies that are built to generate revenue, not just traffic."
      whyUs={[
        "Proven track record with Grand Rapids businesses across multiple industries",
        "Local market knowledge — we understand the Grand Rapids competitive landscape",
        "Full-stack approach: website, SEO, ads, and automation working together",
        "Transparent, jargon-free reporting tied to revenue outcomes",
        "Fast turnaround — most projects launch within 30 days",
        "Month-to-month engagements — no long-term lock-in",
      ]}
      services={[
        {
          title: "Website Design Grand Rapids",
          desc: "Custom websites built to rank in Grand Rapids search results and convert visitors into leads.",
          href: "/services/website-design",
        },
        {
          title: "SEO Grand Rapids",
          desc: "Dominate local search results for your most valuable keywords in the Grand Rapids market.",
          href: "/services/seo-services",
        },
        {
          title: "Google Ads Grand Rapids",
          desc: "Paid search campaigns targeting Grand Rapids buyers with high purchase intent.",
          href: "/services/lead-generation",
        },
        {
          title: "CRM & Automation Grand Rapids",
          desc: "Sales automation systems that turn your marketing spend into a predictable revenue engine.",
          href: "/services/crm-automation",
        },
      ]}
      faqs={[
        {
          q: "Do you serve businesses in Grand Rapids?",
          a: "Yes. We work with businesses throughout the Grand Rapids metro area including Kentwood, Wyoming, Walker, Grandville, and surrounding communities.",
        },
        {
          q: "How competitive is digital marketing in Grand Rapids?",
          a: "Grand Rapids is a growing market with increasing competition in most industries. The businesses that invest in a complete digital system — website, SEO, and ads working together — consistently outperform those relying on a single channel.",
        },
        {
          q: "Can you help a Grand Rapids business rank on Google?",
          a: "Yes. We've helped businesses in the Grand Rapids area rank for competitive local keywords. Our SEO approach combines technical optimization, local content, and Google Business Profile management.",
        },
        {
          q: "What industries do you serve in Grand Rapids?",
          a: "We work with home services, healthcare, legal, financial services, real estate, and B2B companies throughout the Grand Rapids area.",
        },
        {
          q: "How do I get started?",
          a: "Schedule a free growth plan call. We'll audit your current digital presence, identify your biggest opportunities, and give you a clear roadmap — no strings attached.",
        },
      ]}
      nearbyAreas={["Kentwood, MI", "Wyoming, MI", "Walker, MI", "Grandville, MI", "East Grand Rapids, MI", "Ada, MI"]}
      keywords={["marketing agency Grand Rapids", "digital marketing Grand Rapids", "SEO Grand Rapids", "Google Ads Grand Rapids", "website design Grand Rapids"]}
    />
  );
}
