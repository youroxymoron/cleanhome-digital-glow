import { motion } from "framer-motion";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteContent, StatsContent } from "@/hooks/useSiteContent";

const heroImage = "/images/hero-clean-home.jpg";

const defaultStats: StatsContent = {
  years: "12+",
  clients: "1000+",
  cleanings: "2000+",
};

const HeroSection = () => {
  const { data: stats } = useSiteContent<StatsContent>("stats");
  const displayStats = stats || defaultStats;
  const features = [
    "Экологичные средства",
    "Опытные специалисты",
    "Гарантия качества",
  ];

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-hero">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              Профессиональный клининг в Донецке
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Чистота и{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                свежесть
              </span>{" "}
              вашего дома
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Доверьте уборку профессионалам. Мы используем безопасные технологии 
              и современное оборудование для идеальной чистоты вашего пространства.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 text-foreground"
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" asChild className="group">
                <a href="#contacts">
                  Заказать уборку
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#services">Наши услуги</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Чистый современный дом"
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-lg border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-2xl font-bold">{displayStats.years}</span>
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">Лет опыта</p>
                  <p className="text-muted-foreground text-sm">в сфере клининга</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full px-4 py-2 shadow-glow"
            >
              <span className="font-bold">{displayStats.clients} клиентов</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
