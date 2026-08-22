import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { getDisplayContacts, useContacts } from "@/hooks/useContacts";
import { FooterContent, useSiteContent } from "@/hooks/useSiteContent";
import { reachYandexGoal } from "@/lib/analytics";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = { Phone, Mail, MapPin, Clock };

const Footer = () => {
  const { data: contacts } = useContacts();
  const { data: footerContent } = useSiteContent<FooterContent>("footer");
  const displayContacts = getDisplayContacts(contacts);

  return (
    <footer id="footer" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl">Clean House</span>
            </div>
            <p className="text-background/70 mb-4">
              {footerContent?.description || "Профессиональный клининг для вашего дома и офиса. Работаем в Донецке и ДНР."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Услуги</h4>
            <ul className="space-y-2 text-background/70">
              <li><a id="footer-service-cleaning" href="/services" className="hover:text-primary transition-colors">Уборка квартир</a></li>
              <li><a id="footer-service-offices" href="/services" className="hover:text-primary transition-colors">Уборка офисов</a></li>
              <li><a id="footer-service-furniture" href="/services" className="hover:text-primary transition-colors">Химчистка мебели</a></li>
              <li><a id="footer-service-renovation" href="/services" className="hover:text-primary transition-colors">Уборка после ремонта</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Контакты</h4>
            <ul className="space-y-3 text-background/70">
              {displayContacts.map((contact) => {
                const Icon = iconMap[contact.icon] || iconMap[contact.contact_type === "email" ? "Mail" : contact.contact_type === "address" ? "MapPin" : contact.contact_type === "hours" ? "Clock" : "Phone"];
                const goal = contact.contact_type === "phone" ? "phone_click" : contact.contact_type === "email" ? "email_click" : "contact_link_click";
                return (
                  <li key={contact.id} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {contact.href && contact.href !== "#" ? (
                      <a id={`footer-contact-${contact.id}`} data-ym-goal={goal} href={contact.href} onClick={() => reachYandexGoal(goal, { placement: "footer", contact_id: contact.id })} className="hover:text-primary transition-colors">{contact.value}</a>
                    ) : <span id={`footer-info-${contact.id}`}>{contact.value}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-background/50">
              Сервисные районы: Донецк, г. Александровка, Великая Новосёлка,
              Долгие Былы, Комсомольское, Трещётск, Горловка (по договорённости).
            </p>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <Link id="footer-privacy" to="/privacy" className="text-background/60 hover:text-primary transition-colors text-sm">
                Политика конфиденциальности
              </Link>
              <Link id="footer-offer" to="/offer" className="text-background/60 hover:text-primary transition-colors text-sm">
                Договор публичной оферты
              </Link>
            </div>
          </div>
          <p className="text-center text-background/40 mt-4">
            © {new Date().getFullYear()} Clean House. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
