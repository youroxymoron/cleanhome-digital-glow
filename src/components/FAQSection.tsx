import { motion } from "framer-motion";
import { useFaq } from "@/hooks/useFaq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const fallbackFaq = [
  {
    id: "1",
    question: "Какой срок очистки?",
    answer: "Сроки уточняются при звонке. Стандартная уборка квартиры занимает 2-4 часа.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    question: "Какие средства вы используете?",
    answer: "Только экологичные и гипоаллергенные средства, безопасные для детей и животных.",
    sort_order: 2,
    is_active: true,
  },
  {
    id: "3",
    question: "Можно ли заказать срочную уборку?",
    answer: "Да, возможен выезд в день обращения при наличии свободного слота.",
    sort_order: 3,
    is_active: true,
  },
];

const FAQSection = () => {
  const { data: faqItems, isLoading } = useFaq();

  const displayItems = faqItems && faqItems.length > 0 ? faqItems : fallbackFaq;

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Вопросы и ответы
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <HelpCircle className="w-8 h-8 text-primary" />
            Часто задаваемые вопросы
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ответы на популярные вопросы о наших услугах клининга
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && displayItems.length === 0 && (
          <p className="text-center text-muted-foreground">Вопросы пока отсутствуют</p>
        )}

        {!isLoading && displayItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="default" className="space-y-4">
              {displayItems.slice(0, 8).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={item.id}
                    className="border-none"
                  >
                    <AccordionTrigger className="bg-card hover:no-underline rounded-xl px-6 py-4 border border-border hover:shadow-md transition-shadow group">
                      <span className="text-left font-semibold text-foreground w-full">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-card rounded-xl border border-border mt-1 px-6 py-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
