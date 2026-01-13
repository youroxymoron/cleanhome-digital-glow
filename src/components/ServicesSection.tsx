import { motion } from "framer-motion";
import { 
  Home, 
  Building2, 
  Sofa, 
  SprayCan, 
  Sparkles, 
  HardHat,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Home,
    title: "Уборка квартир",
    description: "Комплексная уборка жилых помещений с использованием экологичных средств",
    price: "от 2 500 ₽",
  },
  {
    icon: Building2,
    title: "Уборка офисов",
    description: "Поддержание чистоты рабочих пространств для комфортной работы",
    price: "от 4 000 ₽",
  },
  {
    icon: Sofa,
    title: "Химчистка мебели",
    description: "Глубокая чистка диванов, кресел и ковров профессиональным оборудованием",
    price: "от 1 500 ₽",
  },
  {
    icon: SprayCan,
    title: "Дезинфекция",
    description: "Полная дезинфекция помещений для устранения бактерий и вирусов",
    price: "от 3 000 ₽",
  },
  {
    icon: Sparkles,
    title: "Мойка окон",
    description: "Качественная мойка окон любой сложности на любых этажах",
    price: "от 500 ₽/окно",
  },
  {
    icon: HardHat,
    title: "Уборка после ремонта",
    description: "Удаление строительной пыли и мусора после ремонтных работ",
    price: "от 5 000 ₽",
  },
];

const ServicesSection = () => {
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

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 cursor-pointer">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  
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
            </motion.div>
          ))}
        </div>

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
