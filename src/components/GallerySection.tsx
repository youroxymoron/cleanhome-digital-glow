import { motion } from "framer-motion";
import { useGallery } from "@/hooks/useGallery";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const fallbackGallery = [
  {
    id: "1",
    title: "Уборка квартиры после ремонта",
    before_image_url: "/images/placeholder.svg",
    after_image_url: "/images/hero-clean-home.jpg",
    sort_order: 1,
    is_active: true,
  },
];

const GallerySection = () => {
  const { data: galleryItems, isLoading } = useGallery();

  const displayItems = galleryItems && galleryItems.length > 0 ? galleryItems : fallbackGallery;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Галерея работ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ДО / ПОСЛЕ
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Визуальное подтверждение нашей работы — до и после уборки
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && displayItems.length === 0 && (
          <p className="text-center text-muted-foreground">Галерея пока пуста</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {displayItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="group bg-card rounded-2xl overflow-hidden shadow-sm border border-border transition-all duration-300 hover:shadow-lg">
                <div className="grid grid-cols-2 gap-1 h-48">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.before_image_url || "/images/placeholder.svg"}
                      alt={`До: ${item.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 bg-destructive/90 text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                      ДО
                    </span>
                  </div>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.after_image_url || "/images/placeholder.svg"}
                      alt={`После: ${item.title}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                      ПОСЛЕ
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <a href="#contacts">
              Заказать уборку
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;
