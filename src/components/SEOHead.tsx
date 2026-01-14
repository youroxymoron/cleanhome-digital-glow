import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "service";
}

export function SEOHead({
  title = "Clean House — Профессиональный клининг в Донецке",
  description = "Услуги профессиональной уборки квартир, домов и офисов в Донецке. Экологичные средства, опытные специалисты, гарантия качества. Звоните: +7 949 501 57 51",
  keywords = "клининг Донецк, уборка квартир, уборка домов, уборка офисов, генеральная уборка, мытьё окон, химчистка мебели",
  image = "/og-image.jpg",
  url,
  type = "website",
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    updateMeta("description", description);
    updateMeta("keywords", keywords);

    // Open Graph
    updateMeta("og:title", title, "property");
    updateMeta("og:description", description, "property");
    updateMeta("og:type", type, "property");
    updateMeta("og:image", image, "property");
    if (url) updateMeta("og:url", url, "property");

    // Twitter Card
    updateMeta("twitter:title", title, "name");
    updateMeta("twitter:description", description, "name");
    updateMeta("twitter:image", image, "name");
  }, [title, description, keywords, image, url, type]);

  return null;
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
