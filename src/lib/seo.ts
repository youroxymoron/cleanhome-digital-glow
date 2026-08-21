export const SITE_URL = "https://cleanhousednr.ru";
export const DEFAULT_IMAGE = `${SITE_URL}/images/hero-clean-home.jpg`;

export interface SeoService {
  id: string;
  title: string;
  description: string;
  price: string;
  image_url?: string | null;
  full_description?: string | null;
}

export interface SeoFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SeoReview {
  id: string;
  author_name: string;
  rating: number;
  text: string;
}

export const DEFAULT_FAQS: SeoFaq[] = [
  { id: "default-duration", question: "Сколько времени занимает уборка?", answer: "Стандартная уборка квартиры обычно занимает 2–4 часа. Точный срок зависит от площади, состояния помещения и выбранных услуг." },
  { id: "default-products", question: "Какие средства вы используете?", answer: "Мы используем профессиональные средства и подбираем состав с учётом типа поверхности, а также наличия детей, животных или аллергии." },
  { id: "default-urgent", question: "Можно ли заказать срочную уборку?", answer: "Да, выезд в день обращения возможен при наличии свободного времени у команды. Доступность уточняется при заказе." },
];

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  image: string;
  type: "website" | "article";
  robots: string;
}

const defaults = {
  title: "Clean House — профессиональный клининг в Донецке",
  description: "Профессиональная уборка квартир, домов и офисов в Донецке и ДНР. Генеральная уборка, химчистка мебели и мойка окон. Телефон: +7 949 501-57-51.",
  keywords: "клининг Донецк, уборка квартир Донецк, генеральная уборка, уборка офисов, химчистка мебели, мойка окон",
};

export function getSeoMetadata(pathname: string, service?: SeoService): SeoMetadata {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const common = {
    canonical: `${SITE_URL}${path === "/" ? "/" : path}`,
    image: service?.image_url || DEFAULT_IMAGE,
    type: "website" as const,
    robots: "index, follow, max-image-preview:large, max-snippet:-1",
  };

  if (path === "/services") {
    return { ...common, title: "Услуги клининга и цены в Донецке — Clean House", description: "Цены на уборку квартир, домов и офисов, химчистку мебели и мойку окон в Донецке. Выберите услугу и закажите расчёт стоимости.", keywords: "услуги клининга Донецк, цены на уборку, химчистка мебели цена, мойка окон Донецк" };
  }

  if (path.startsWith("/services/") && service) {
    return { ...common, title: `${service.title} в Донецке — цена | Clean House`, description: `${service.description} Стоимость: ${service.price}. Закажите услугу Clean House в Донецке и ДНР.`, keywords: `${service.title}, клининг Донецк, уборка Донецк, Clean House` };
  }

  if (path === "/privacy") {
    return { ...common, title: "Политика конфиденциальности — Clean House", description: "Политика обработки и защиты персональных данных на сайте клининговой компании Clean House.", keywords: "политика конфиденциальности Clean House, обработка персональных данных", type: "article" };
  }

  if (path === "/offer") {
    return { ...common, title: "Договор публичной оферты — Clean House", description: "Условия заказа, оплаты и оказания клининговых услуг компанией Clean House в Донецке.", keywords: "публичная оферта Clean House, условия клининговых услуг", type: "article" };
  }

  if (path === "/auth" || path === "/admin") {
    return { ...common, title: path === "/auth" ? "Вход — Clean House" : "Панель управления — Clean House", description: "Служебная страница Clean House.", keywords: "", robots: "noindex, nofollow" };
  }

  return { ...common, ...defaults };
}

function numericPrice(price: string) {
  const value = price.replace(/\s/g, "").match(/\d+(?:[.,]\d+)?/)?.[0];
  return value ? Number(value.replace(",", ".")) : undefined;
}

export function buildStructuredData({ pathname, services = [], currentService, faqs = [], reviews = [] }: {
  pathname: string;
  services?: SeoService[];
  currentService?: SeoService;
  faqs?: SeoFaq[];
  reviews?: SeoReview[];
}) {
  const schemas: Record<string, unknown>[] = [];
  const validReviews = reviews.filter((review) => review.rating >= 1 && review.rating <= 5);
  const averageRating = validReviews.length ? validReviews.reduce((sum, review) => sum + review.rating, 0) / validReviews.length : undefined;
  const business: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "LocalBusiness", "@id": `${SITE_URL}/#organization`,
    name: "Clean House", description: "Профессиональные услуги клининга в Донецке и ДНР.", url: `${SITE_URL}/`,
    telephone: ["+7 949 501-57-51", "+7 988 585-26-94"], email: "info@cleanhousednr.ru",
    address: { "@type": "PostalAddress", addressLocality: "Донецк", addressRegion: "ДНР", addressCountry: "RU" },
    areaServed: ["Донецк", "Донецкая Народная Республика"],
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "20:00" },
    priceRange: "₽₽", currenciesAccepted: "RUB", image: DEFAULT_IMAGE,
  };

  if (averageRating !== undefined) {
    business.aggregateRating = { "@type": "AggregateRating", ratingValue: Number(averageRating.toFixed(1)), reviewCount: validReviews.length, bestRating: 5, worstRating: 1 };
    business.review = validReviews.slice(0, 10).map((review) => ({ "@type": "Review", author: { "@type": "Person", name: review.author_name }, reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 }, reviewBody: review.text }));
  }
  schemas.push(business);

  if (pathname === "/") {
    schemas.push({ "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Clean House", url: `${SITE_URL}/`, inLanguage: "ru-RU", publisher: { "@id": `${SITE_URL}/#organization` } });
    if (faqs.length) {
      schemas.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.slice(0, 20).map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) });
    }
  }

  if (pathname === "/services" && services.length) {
    schemas.push({ "@context": "https://schema.org", "@type": "ItemList", name: "Услуги клининга Clean House", numberOfItems: services.length, itemListElement: services.map((service, index) => ({ "@type": "ListItem", position: index + 1, url: `${SITE_URL}/services/${service.id}`, name: service.title })) });
  }

  if (pathname.startsWith("/services/") && currentService) {
    const price = numericPrice(currentService.price);
    schemas.push({ "@context": "https://schema.org", "@type": "Service", "@id": `${SITE_URL}/services/${currentService.id}#service`, name: currentService.title, description: currentService.full_description || currentService.description, image: currentService.image_url || DEFAULT_IMAGE, provider: { "@id": `${SITE_URL}/#organization` }, areaServed: { "@type": "City", name: "Донецк" }, ...(price !== undefined ? { offers: { "@type": "Offer", price, priceCurrency: "RUB", availability: "https://schema.org/InStock" } } : {}) });
  }

  if (pathname !== "/") {
    const items = [{ name: "Главная", item: `${SITE_URL}/` }];
    if (pathname.startsWith("/services")) items.push({ name: "Услуги", item: `${SITE_URL}/services` });
    if (currentService) items.push({ name: currentService.title, item: `${SITE_URL}/services/${currentService.id}` });
    if (pathname === "/privacy") items.push({ name: "Политика конфиденциальности", item: `${SITE_URL}/privacy` });
    if (pathname === "/offer") items.push({ name: "Публичная оферта", item: `${SITE_URL}/offer` });
    schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.item })) });
  }

  return schemas;
}
