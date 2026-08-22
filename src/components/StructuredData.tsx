import { useEffect } from "react";
import { buildStructuredData, SeoFaq, SeoReview, SeoService } from "@/lib/seo";
import { useContacts } from "@/hooks/useContacts";

interface StructuredDataProps {
  services?: SeoService[];
  pageType?: "home" | "services" | "service" | "privacy" | "offer";
  currentService?: SeoService;
  faqs?: SeoFaq[];
  reviews?: SeoReview[];
}

const pathsByType = { home: "/", services: "/services", privacy: "/privacy", offer: "/offer" };

export function StructuredData({ services, pageType = "home", currentService, faqs, reviews }: StructuredDataProps) {
  const { data: contacts } = useContacts();

  useEffect(() => {
    document.querySelectorAll('script[data-structured-data="true"]').forEach((script) => script.remove());

    const pathname = pageType === "service" && currentService
      ? `/services/${currentService.id}`
      : pathsByType[pageType as keyof typeof pathsByType] || window.location.pathname;

    buildStructuredData({ pathname, services, currentService, faqs, reviews, contacts }).forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.structuredData = "true";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [services, pageType, currentService, faqs, reviews, contacts]);

  return null;
}

export default StructuredData;
