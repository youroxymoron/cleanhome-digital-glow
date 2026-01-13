import { motion } from "framer-motion";
import { Shield, Clock, Leaf, Award, Users, ThumbsUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Гарантия качества",
    description: "Если вас что-то не устроит, мы вернёмся и исправим бесплатно",
  },
  {
    icon: Clock,
    title: "Точно в срок",
    description: "Приезжаем вовремя и выполняем работу в оговорённые сроки",
  },
  {
    icon: Leaf,
    title: "Эко-средства",
    description: "Используем безопасные для здоровья и экологии моющие средства",
  },
  {
    icon: Award,
    title: "Опытная команда",
    description: "Все наши специалисты имеют опыт работы более 3 лет",
  },
  {
    icon: Users,
    title: "Индивидуальный подход",
    description: "Учитываем все ваши пожелания и особенности помещения",
  },
  {
    icon: ThumbsUp,
    title: "Доступные цены",
    description: "Честное ценообразование без скрытых платежей",
  },
];

const WhyUsSection = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Почему мы
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Доверьте чистоту{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                профессионалам
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              За годы работы мы создали команду настоящих профессионалов, 
              которые любят своё дело и стремятся к идеальному результату.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground text-sm">Довольных клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                <div className="text-muted-foreground text-sm">Лет опыта</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground text-sm">Уборок</div>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
