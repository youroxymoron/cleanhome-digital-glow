import { motion } from "framer-motion";
import { 
  Home, 
  Building2, 
  Sofa, 
  SprayCan, 
  Sparkles, 
  HardHat,
  ArrowRight,
  Waves,
  BedDouble,
  AppWindow,
  Hammer,
  RefreshCw,
  AlertTriangle,
  Trash2,
  Grid3X3,
  Wine,
  LayoutGrid,
  Dog,
  Blinds,
  Maximize2,
  Construction,
  DoorOpen,
  Grid2X2,
  Eraser,
  Armchair
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useServices, categoryLabels } from "@/hooks/useServices";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Building2, Sofa, SprayCan, Sparkles, HardHat, Waves, BedDouble, 
  AppWindow, Hammer, RefreshCw, AlertTriangle, Trash2, Grid3X3, Wine,
  LayoutGrid, Dog, Blinds, Maximize2, Construction, DoorOpen, Grid2X2,
  Eraser, Armchair, Microwave: SprayCan, Refrigerator: SprayCan, Chair: Sofa, Square: SprayCan
};

const ServicesSection = () => {
  const { data: services, isLoading } = useServices();
  
  // Группируем услуги по категориям
  const groupedServices = services?.reduce((acc, service) => {
    const category = service.category || 'cleaning';
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  const categoryOrder = ['cleaning', 'dry_cleaning', 'windows'];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Наши услуги
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Полный спектр клининговых услуг
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Мы предлагаем широкий выбор услуг по уборке для жилых и коммерческих помещений
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-primary rounded-full" />
                {categoryLabels[categoryKey]}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryServices.map((service, index) => {
                  const IconComponent = iconMap[service.icon] || Sparkles;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/services/${service.id}`}>
                        <Card className="group h-full hover:shadow-md transition-all duration-300 border-border hover:border-primary/30 cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <IconComponent className="w-5 h-5 text-primary-foreground" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">
                                  {service.title}
                                </h4>
                                <span className="text-sm font-bold text-primary">
                                  {service.price}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <a href="#contacts">
              Заказать услугу
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;