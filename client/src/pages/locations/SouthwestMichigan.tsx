/*
 * Southwest Michigan Location Page — Lake Michigan Marketing
 * SEO: "Digital Marketing Southwest Michigan", "Marketing Agency Southwest Michigan"
 */
import LocationPageTemplate from "@/components/LocationPageTemplate";

export default function SouthwestMichigan() {
  return (
    <LocationPageTemplate
      city="Southwest Michigan"
      state="MI"
      heroTitle="Digital Marketing Agency Southwest Michigan"
      heroSubtitle="From the shores of Lake Michigan to the heart of Kalamazoo and Grand Rapids — we help Southwest Michigan businesses build revenue-generating digital systems."
      description="Southwest Michigan's Premier Digital Marketing Agency"
      localContext="Southwest Michigan is home to a diverse and growing business community — from the agricultural and manufacturing industries of Berrien and Cass counties to the professional services and healthcare sectors of Kalamazoo and Van Buren counties. We understand the unique dynamics of this region and build marketing strategies that work for local businesses competing in both small-town and metro markets."
      whyUs={[
        "Deep roots in Southwest Michigan — we know your market",
        "Proven results across the region's most competitive industries",
        "Integrated approach: website, SEO, ads, and automation in one system",
        "Revenue-focused reporting — we measure what matters",
        "Fast execution with local accountability",
        "No long-term contracts — results speak for themselves",
      ]}
      services={[
        {
          title: "Website Design Southwest Michigan",
          desc: "Custom, fast, SEO-optimized websites built to convert Southwest Michigan visitors into leads.",
          href: "/services/website-design",
        },
        {
          title: "SEO Southwest Michigan",
          desc: "Local SEO strategies that rank your business at the top of Google for Southwest Michigan searches.",
          href: "/services/seo-services",
        },
        {
          title: "Lead Generation Southwest Michigan",
          desc: "Google Ads and LinkedIn campaigns that deliver qualified leads across the Southwest Michigan region.",
          href: "/services/lead-generation",
        },
        {
          title: "CRM & Automation",
          desc: "Sales automation systems that turn your marketing into a predictable, scalable revenue engine.",
          href: "/services/crm-automation",
        },
      ]}
      faqs={[
        {
          q: "What areas of Southwest Michigan do you serve?",
          a: "We serve businesses throughout Southwest Michigan including Kalamazoo, Grand Rapids, Portage, Battle Creek, St. Joseph, Benton Harbor, Holland, Muskegon, and all surrounding communities.",
        },
        {
          q: "Is digital marketing effective for small businesses in Southwest Michigan?",
          a: "Absolutely. In fact, local businesses in Southwest Michigan often have a significant advantage because the competition for local digital presence is lower than in major metro areas. The businesses that invest now will dominate their markets for years.",
        },
        {
          q: "Do you work with rural businesses in Southwest Michigan?",
          a: "Yes. We work with businesses in both urban and rural Southwest Michigan. Our strategies are tailored to your specific market size, competition level, and customer base.",
        },
        {
          q: "How do you approach marketing for Southwest Michigan's diverse industries?",
          a: "We start by understanding your specific industry, customer profile, and competitive landscape. Then we build a strategy around the channels and tactics that will generate the highest ROI for your specific situation.",
        },
        {
          q: "Can you help a Southwest Michigan business compete with national brands?",
          a: "Yes. Local SEO and targeted paid advertising are two of the most powerful tools for local businesses to outcompete national brands in their own backyard. We've helped many local businesses dominate their markets against national competition.",
        },
      ]}
      nearbyAreas={[
        "Kalamazoo, MI", "Grand Rapids, MI", "Battle Creek, MI", "St. Joseph, MI",
        "Benton Harbor, MI", "Holland, MI", "Muskegon, MI", "Portage, MI",
        "Allegan, MI", "South Haven, MI",
      ]}
      keywords={["digital marketing Southwest Michigan", "marketing agency Southwest Michigan", "SEO Southwest Michigan", "website design Southwest Michigan"]}
    />
  );
}
