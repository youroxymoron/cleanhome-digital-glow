import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Home, Building2, Sofa, SprayCan, Sparkles, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServices, Service } from "@/hooks/useServices";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home, Building2, Sofa, SprayCan, Sparkles, HardHat
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home;
};

const ServicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: services, isLoading } = useServices();

  const service = services?.find((s: Service) => s.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Услуга не найдена</h1>
          <Button asChild>
            <Link to="/services">Вернуться к услугам</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = getIcon(service.icon);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Все услуги
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary-foreground" />
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                {service.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {service.description}
              </p>

              <div className="bg-secondary/30 rounded-2xl p-6 mb-8">
                <p className="text-muted-foreground mb-2">Стоимость</p>
                <p className="text-3xl font-bold text-primary">{service.price}</p>
              </div>

              <div className="prose prose-lg max-w-none text-foreground mb-8">
                <p>{service.full_description || service.description}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {["Бесплатный выезд на осмотр", "Гарантия качества", "Экологичные средства"].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" asChild>
                <Link to="/#contacts">Заказать услугу</Link>
              </Button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full rounded-3xl shadow-lg"
                />
              ) : (
                <div className="w-full aspect-video rounded-3xl bg-gradient-primary flex items-center justify-center">
                  <Icon className="w-24 h-24 text-primary-foreground/50" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePage;
