import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
}

export function useSEO({ title, description, canonical, keywords }: SEOProps) {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Meta keywords
    if (keywords) {
      let metaKw = document.querySelector('meta[name="keywords"]');
      if (!metaKw) {
        metaKw = document.createElement("meta");
        metaKw.setAttribute("name", "keywords");
        document.head.appendChild(metaKw);
      }
      metaKw.setAttribute("content", keywords);
    }

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // OG title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    // OG description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);
  }, [title, description, canonical, keywords]);
}
