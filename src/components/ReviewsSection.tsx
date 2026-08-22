import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { Card, CardContent } from "@/components/ui/card";

const fallbackReviews = [
  {
    id: "1",
    author_name: "Анна Петрова",
    author_role: null,
    rating: 5,
    text: "Отличная уборка! Квартира блестит. Рекомендую всем своим знакомым.",
    sort_order: 1,
    is_active: true,
  },
  {
    id: "2",
    author_name: "Игорь Смирнов",
    author_role: null,
    rating: 5,
    text: "Работали быстро и качественно. Спасибо за профессионализм!",
    sort_order: 2,
    is_active: true,
  },
];

const ReviewsSection = () => {
  const { data: reviews, isLoading } = useReviews();

  const displayReviews = reviews && reviews.length > 0 ? reviews : fallbackReviews;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Отзывы клиентов
          </span>
          <h2 id="reviews-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Что говорят наши клиенты
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Реальные отзывы реальных клиентов, которые доверили нам чистоту своего дома
          </p>
        </motion.div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {!isLoading && displayReviews.length === 0 && (
          <p className="text-center text-muted-foreground">Отзывы пока отсутствуют</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {displayReviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted/30"}`}
                      />
                    ))}
                  </div>

                  <Quote className="w-6 h-6 text-primary/30 mb-2" />

                  <p className="text-foreground/80 text-sm italic flex-1 mb-4 line-clamp-4">
                    {review.text}
                  </p>

                  <div className="mt-auto">
                    <p className="font-bold text-foreground">{review.author_name}</p>
                    {review.author_role && (
                      <p className="text-sm text-muted-foreground">{review.author_role}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
