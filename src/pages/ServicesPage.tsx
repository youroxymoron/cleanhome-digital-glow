import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Home, Building2, Sofa, SprayCan, Sparkles, HardHat,
  Waves, BedDouble, AppWindow, Hammer, RefreshCw, AlertTriangle,
  Trash2, Grid3X3, Wine, LayoutGrid, Dog, Blinds, Maximize2,
  Construction, DoorOpen, Grid2X2, Eraser, Armchair
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServices, categoryLabels } from "@/hooks/useServices";
import { useSiteContent, HeaderContent } from "@/hooks/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { reachYandexGoal } from "@/lib/analytics";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Building2, Sofa, SprayCan, Sparkles, HardHat, Waves, BedDouble, 
  AppWindow, Hammer, RefreshCw, AlertTriangle, Trash2, Grid3X3, Wine,
  LayoutGrid, Dog, Blinds, Maximize2, Construction, DoorOpen, Grid2X2,
  Eraser, Armchair, Microwave: SprayCan, Refrigerator: SprayCan, Chair: Sofa, Square: SprayCan
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home;
};

const ServicesPage = () => {
  const { data: services, isLoading } = useServices();
  const { data: headerContent } = useSiteContent<HeaderContent>("services_header");

  // Группируем услуги по категориям
  const groupedServices = services?.reduce((acc, service) => {
    const category = service.category || 'cleaning';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const categoryOrder = ['cleaning', 'dry_cleaning', 'windows'];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Услуги клининга и цены в Донецке — Clean House"
        description="Цены на уборку квартир, домов и офисов, химчистку мебели и мойку окон в Донецке. Выберите услугу и закажите расчёт стоимости."
        keywords="услуги клининга Донецк, цены на уборку, химчистка мебели цена, мойка окон Донецк"
      />
      <StructuredData pageType="services" services={services || []} />
      <Header />
      <main id="services-page" className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
              {headerContent?.subtitle || "Наши услуги"}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {headerContent?.title || "Полный спектр клининговых услуг"}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {headerContent?.description || "Мы предлагаем широкий выбор услуг по уборке для жилых и коммерческих помещений"}
            </p>
          </motion.div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          {/* Services by Category */}
          {groupedServices && categoryOrder.map((categoryKey) => {
            const categoryServices = groupedServices[categoryKey];
            if (!categoryServices?.length) return null;

            return (
              <motion.div
                key={categoryKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-gradient-primary rounded-full" />
                  {categoryLabels[categoryKey]}
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      {categoryServices.map((service, index) => {
                        const Icon = getIcon(service.icon);
                        const isEven = index % 2 === 0;
                        return (
                          <tr 
                            key={service.id}
                            className={`border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors ${isEven ? 'bg-primary/5' : ''}`}
                          >
                            <td className="py-4 px-4">
                              <Link 
                                id={`services-page-service-${service.id}`}
                                data-ym-goal="service_detail_click"
                                to={`/services/${service.id}`}
                                onClick={() => reachYandexGoal("service_detail_click", { placement: "services_page", service_id: service.id })}
                                className="flex items-center gap-3 group"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                  <Icon className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {service.title}
                                </span>
                              </Link>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-primary whitespace-nowrap">
                                {service.price}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            );
          })}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Не нашли нужную услугу? Свяжитесь с нами!
            </p>
            <Button size="lg" asChild>
              <Link id="cta-services-page-contact" data-ym-goal="contact_cta_click" to="/#contacts" onClick={() => reachYandexGoal("contact_cta_click", { placement: "services_page" })}>
                Связаться с нами
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
