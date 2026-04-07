/*
 * Kalamazoo Location Page — Lake Michigan Marketing
 * SEO: "Marketing Agency Kalamazoo", "Digital Marketing Kalamazoo MI", "Website Design Kalamazoo"
 */
import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function Kalamazoo() {
  return (
    <LocationPageTemplate
      city="Kalamazoo"
      state="MI"
      heroTitle="Marketing Agency Kalamazoo, MI"
      heroSubtitle="We help Kalamazoo businesses generate more leads, close more deals, and build systems that scale — without relying on referrals or luck."
      description="Kalamazoo's Growth-Focused Marketing Partner"
      localContext="Kalamazoo is one of Michigan's most dynamic business markets — from the craft brewing industry to healthcare, manufacturing, and professional services. We work with Kalamazoo businesses that are ready to invest in digital systems that generate consistent, measurable revenue. Whether you're a solo operator or a 50-person team, we build marketing infrastructure that scales with you."
      whyUs={[
        "Deep understanding of the Kalamazoo and Southwest Michigan business landscape",
        "Proven results for local home services, healthcare, legal, and B2B companies",
        "We speak in revenue, not impressions — every strategy is tied to business outcomes",
        "Fast execution — most projects launch within 30 days",
        "Transparent reporting with no vanity metrics",
        "No long-term contracts — we earn your business every month",
      ]}
      services={[
        {
          title: "Website Design Kalamazoo",
          desc: "Custom, conversion-focused websites built to rank on Google and turn visitors into leads.",
          href: "/services/website-design",
        },
        {
          title: "SEO Services Kalamazoo",
          desc: "Rank at the top of Google for 'Marketing Agency Kalamazoo' and other high-value local keywords.",
          href: "/services/seo-services",
        },
        {
          title: "Google Ads Kalamazoo",
          desc: "Paid search campaigns that deliver qualified leads from buyers actively searching for your services.",
          href: "/services/lead-generation",
        },
        {
          title: "CRM & Automation Kalamazoo",
          desc: "Connect your marketing to your sales pipeline and automate follow-up so no lead goes cold.",
          href: "/services/crm-automation",
        },
      ]}
      faqs={[
        {
          q: "Are you a local Kalamazoo marketing agency?",
          a: "Yes. We're rooted in Southwest Michigan and have a deep understanding of the Kalamazoo business market. We work with local businesses across industries including home services, healthcare, legal, retail, and B2B.",
        },
        {
          q: "What types of Kalamazoo businesses do you work with?",
          a: "We focus on high-margin businesses where great marketing creates outsized returns. Our sweet spot is businesses with average customer values of $500 or more — home services, medical practices, law firms, financial advisors, and B2B companies.",
        },
        {
          q: "How do you approach SEO for Kalamazoo businesses?",
          a: "We start with keyword research specific to the Kalamazoo market, then build a strategy around the terms your ideal customers are searching. We optimize your Google Business Profile, build local citations, and create content that ranks for local searches.",
        },
        {
          q: "How much does digital marketing cost in Kalamazoo?",
          a: "Our engagements typically start at $1,500/month for foundational services. We'll give you a specific recommendation based on your goals, industry, and competitive landscape during your free growth plan call.",
        },
        {
          q: "Do you work with startups or only established businesses?",
          a: "We work with both. For startups, we focus on building the right foundation quickly. For established businesses, we focus on fixing leaks and scaling what's working.",
        },
      ]}
      nearbyAreas={["Portage, MI", "Battle Creek, MI", "Galesburg, MI", "Oshtemo Township, MI", "Comstock Township, MI"]}
      keywords={["marketing agency Kalamazoo", "digital marketing Kalamazoo", "website design Kalamazoo", "SEO Kalamazoo", "Google Ads Kalamazoo"]}
    />
  );
}
