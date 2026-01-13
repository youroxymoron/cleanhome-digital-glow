import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServices } from "@/hooks/useServices";
import { useSiteContent, HeaderContent } from "@/hooks/useSiteContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Building2, Sofa, SprayCan, Sparkles, HardHat, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Building2, Sofa, SprayCan, Sparkles, HardHat
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home;
};

const ServicesPage = () => {
  const { data: services, isLoading } = useServices();
  const { data: headerContent } = useSiteContent<HeaderContent>("services_header");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
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

          {/* Services Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services?.map((service, index) => {
                const Icon = getIcon(service.icon);
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/services/${service.id}`}>
                      <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 cursor-pointer overflow-hidden">
                        {service.image_url && (
                          <div className="h-48 overflow-hidden">
                            <img
                              src={service.image_url}
                              alt={service.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Icon className="w-7 h-7 text-primary-foreground" />
                          </div>

                          <h2 className="text-xl font-bold text-foreground mb-3">
                            {service.title}
                          </h2>

                          <p className="text-muted-foreground mb-4">
                            {service.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              {service.price}
                            </span>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

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
              <Link to="/#contacts">
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
