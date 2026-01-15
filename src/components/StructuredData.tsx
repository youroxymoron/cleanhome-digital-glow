import { useEffect } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  image_url?: string | null;
}

interface StructuredDataProps {
  services?: Service[];
  pageType?: "home" | "services" | "service";
  currentService?: Service;
}

export function StructuredData({ services, pageType = "home", currentService }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    // LocalBusiness schema (always present)
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://cleanhome-digital-glow.lovable.app/#organization",
      "name": "Clean House",
      "description": "Профессиональные услуги клининга в Донецке. Уборка квартир, домов и офисов.",
      "url": "https://cleanhome-digital-glow.lovable.app",
      "telephone": "+7 949 501 57 51",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Донецк",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "48.0159",
        "longitude": "37.8028"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "20:00"
      },
      "priceRange": "₽₽",
      "image": "https://cleanhome-digital-glow.lovable.app/og-image.jpg",
      "sameAs": []
    };

    addJsonLd(localBusinessSchema);

    // Services schema for services pages
    if (pageType === "services" && services && services.length > 0) {
      const servicesSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Услуги клининга Clean House",
        "description": "Полный список услуг профессионального клининга в Донецке",
        "numberOfItems": services.length,
        "itemListElement": services.map((service, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Service",
            "@id": `https://cleanhome-digital-glow.lovable.app/services/${service.id}`,
            "name": service.title,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "@id": "https://cleanhome-digital-glow.lovable.app/#organization"
            },
            "areaServed": {
              "@type": "City",
              "name": "Донецк"
            },
            "offers": {
              "@type": "Offer",
              "price": service.price.replace(/[^\d]/g, '') || "0",
              "priceCurrency": "RUB",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": service.price,
                "priceCurrency": "RUB"
              }
            }
          }
        }))
      };

      addJsonLd(servicesSchema);
    }

    // Single service schema
    if (pageType === "service" && currentService) {
      const serviceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `https://cleanhome-digital-glow.lovable.app/services/${currentService.id}`,
        "name": currentService.title,
        "description": currentService.description,
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://cleanhome-digital-glow.lovable.app/#organization"
        },
        "areaServed": {
          "@type": "City",
          "name": "Донецк"
        },
        "image": currentService.image_url || "https://cleanhome-digital-glow.lovable.app/og-image.jpg",
        "offers": {
          "@type": "Offer",
          "price": currentService.price.replace(/[^\d]/g, '') || "0",
          "priceCurrency": "RUB",
          "availability": "https://schema.org/InStock"
        }
      };

      addJsonLd(serviceSchema);

      // BreadcrumbList for service page
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Главная",
            "item": "https://cleanhome-digital-glow.lovable.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Услуги",
            "item": "https://cleanhome-digital-glow.lovable.app/services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": currentService.title,
            "item": `https://cleanhome-digital-glow.lovable.app/services/${currentService.id}`
          }
        ]
      };

      addJsonLd(breadcrumbSchema);
    }

    // Home page specific schema
    if (pageType === "home") {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Clean House",
        "url": "https://cleanhome-digital-glow.lovable.app",
        "description": "Профессиональный клининг в Донецке",
        "inLanguage": "ru-RU",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cleanhome-digital-glow.lovable.app/services?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      };

      addJsonLd(websiteSchema);
    }
  }, [services, pageType, currentService]);

  return null;
}

function addJsonLd(schema: object) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

export default StructuredData;
