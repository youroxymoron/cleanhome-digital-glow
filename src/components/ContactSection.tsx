import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { reachYandexGoal, trackConversion } from "@/lib/analytics";
import { Contact, getDisplayContacts, useContacts } from "@/hooks/useContacts";
import { HeaderContent, useSiteContent } from "@/hooks/useSiteContent";
import { TurnstileWidget } from "@/components/TurnstileWidget";

const contactSchema = z.object({
  name: z.string().trim().min(2, { message: "Имя должно быть от 2 до 100 символов" }).max(100).regex(/^[\p{L}\s'’.-]+$/u, { message: "Имя содержит недопустимые символы" }),
  phone: z.string().trim().regex(/^[+]?[0-9\s()-]{7,20}$/, { message: "Неверный формат телефона" }),
  message: z.string().trim().max(1000, { message: "Сообщение слишком длинное (макс. 1000 символов)" }),
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Phone, Mail, MapPin, Clock };

function contactGoal(contact: Contact) {
  if (contact.contact_type === "phone") return "phone_click";
  if (contact.contact_type === "email") return "email_click";
  return "contact_link_click";
}

const ContactSection = () => {
  const { toast } = useToast();
  const { data: contacts } = useContacts();
  const { data: headerContent } = useSiteContent<HeaderContent>("contacts_header");
  const displayContacts = getDisplayContacts(contacts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const formStartedAtRef = useRef(Date.now());
  const turnstileEnabled = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);
  const handleTurnstileToken = useCallback((token: string | null) => {
    setTurnstileToken(token);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Bots commonly fill every field. Silently accept the honeypot submission
    // without forwarding it to Telegram or MAX.
    if (website) {
      setFormData({ name: "", phone: "", message: "" });
      setWebsite("");
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время." });
      return;
    }

    const parsed = contactSchema.safeParse(formData);
    if (!parsed.success) {
      toast({ title: "Проверьте данные", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }

    if (Date.now() - formStartedAtRef.current < 3_000) {
      toast({ title: "Подождите несколько секунд", description: "Форма была заполнена слишком быстро.", variant: "destructive" });
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      toast({ title: "Подтвердите, что вы не робот", description: "Дождитесь завершения проверки защиты.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("submit-contact", {
        body: {
          ...parsed.data,
          website,
          formStartedAt: formStartedAtRef.current,
          turnstileToken,
        },
      });
      if (error || !data?.success) throw error || new Error("Не удалось отправить заявку");

      trackConversion("contact_form_submit");
      toast({ title: "Заявка отправлена!", description: "Мы свяжемся с вами в ближайшее время." });
      setFormData({ name: "", phone: "", message: "" });
      setWebsite("");
      formStartedAtRef.current = Date.now();
    } catch (error: unknown) {
      console.error("Error sending form:", error);
      toast({ title: "Не удалось отправить заявку", description: "Попробуйте позже или позвоните нам напрямую.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
      if (turnstileEnabled) {
        setTurnstileToken(null);
        setTurnstileResetKey((value) => value + 1);
      }
    }
  };

  return (
    <section id="contacts" aria-labelledby="contacts-heading" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            {headerContent?.subtitle || "Контакты"}
          </span>
          <h2 id="contacts-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {headerContent?.title || "Свяжитесь с нами"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {headerContent?.description || "Оставьте заявку или позвоните нам — мы ответим на все вопросы и поможем выбрать подходящую услугу"}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <Card className="border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Оставить заявку</h3>
                <form id="contact-request-form" name="contact-request" data-ym-form="contact-request" onSubmit={handleSubmit} className="space-y-6">
                  <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Сайт компании</label>
                    <input
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-2">Ваше имя</label>
                    <Input id="contact-name" name="name" autoComplete="name" placeholder="Иван Иванов" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-2">Телефон</label>
                    <Input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+7 (___) ___-__-__" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-2">Сообщение</label>
                    <Textarea id="contact-message" name="message" placeholder="Опишите, какая услуга вас интересует..." rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} />
                  </div>
                  <TurnstileWidget key={turnstileResetKey} onTokenChange={handleTurnstileToken} />
                  <Button id="contact-form-submit" data-ym-goal="contact_form_submit" type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Отправка..." : "Отправить заявку"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div id="contact-list" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            {displayContacts.map((contact, index) => {
              const Icon = iconMap[contact.icon] || iconMap[contact.contact_type === "email" ? "Mail" : contact.contact_type === "address" ? "MapPin" : contact.contact_type === "hours" ? "Clock" : "Phone"];
              const content = (
                <>
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"><Icon className="w-6 h-6 text-primary-foreground" /></div>
                  <div><p className="text-muted-foreground text-sm mb-1">{contact.label}</p><p className="text-foreground font-semibold text-lg">{contact.value}</p></div>
                </>
              );
              const classes = "flex items-start gap-4 p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all group";

              return contact.href && contact.href !== "#" ? (
                <motion.a
                  id={`contact-link-${contact.id}`}
                  data-ym-goal={contactGoal(contact)}
                  data-contact-type={contact.contact_type}
                  key={contact.id}
                  href={contact.href}
                  onClick={() => reachYandexGoal(contactGoal(contact), { placement: "contact_section", contact_id: contact.id })}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className={`${classes} cursor-pointer`}
                >{content}</motion.a>
              ) : (
                <motion.div id={`contact-info-${contact.id}`} key={contact.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={classes}>{content}</motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
