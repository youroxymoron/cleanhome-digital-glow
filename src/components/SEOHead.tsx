import { useEffect } from "react";
import { DEFAULT_IMAGE, getSeoMetadata, SITE_URL } from "@/lib/seo";

const defaultSeo = getSeoMetadata("/");

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "service";
  robots?: string;
}

export function SEOHead({
  title = defaultSeo.title,
  description = defaultSeo.description,
  keywords = defaultSeo.keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  robots = "index, follow, max-image-preview:large, max-snippet:-1",
}: SEOHeadProps) {
  useEffect(() => {
    const canonicalUrl = url || `${SITE_URL}${window.location.pathname === "/" ? "/" : window.location.pathname.replace(/\/$/, "")}`;
    const absoluteImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;
    document.title = title;

    updateMeta("description", description);
    updateMeta("keywords", keywords);
    updateMeta("robots", robots);

    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:type", type === "service" ? "website" : type, "property");
    updateMeta("og:image", absoluteImage, "property");
    updateMeta("og:image:width", "1200", "property");
    updateMeta("og:image:height", "630", "property");
    updateMeta("og:image:alt", title, "property");
    updateMeta("og:url", canonicalUrl, "property");

    updateMeta("twitter:title", title, "name");
    updateMeta("twitter:description", description, "name");
    updateMeta("twitter:image", absoluteImage, "name");
    updateLink("canonical", canonicalUrl);
    updateLink("alternate", canonicalUrl, "ru");
    updateLink("alternate", canonicalUrl, "x-default");
  }, [title, description, keywords, image, url, type, robots]);

  return null;
}

function updateLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let element = document.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    if (hreflang) element.hreflang = hreflang;
    document.head.appendChild(element);
  }
  element.href = href;
}

function updateMeta(name: string, content: string, attribute: "name" | "property" = "name") {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.setAttribute("content", content);
}

export default SEOHead;
