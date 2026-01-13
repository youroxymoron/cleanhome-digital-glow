import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
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
              Профессиональный клининг для вашего дома и офиса. 
              Работаем в Донецке и ДНР.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Услуги</h4>
            <ul className="space-y-2 text-background/70">
              <li><a href="#services" className="hover:text-primary transition-colors">Уборка квартир</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Уборка офисов</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Химчистка мебели</a></li>
              <li><a href="#services" className="hover:text-primary transition-colors">Уборка после ремонта</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Контакты</h4>
            <ul className="space-y-3 text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+79495015751" className="hover:text-primary transition-colors">
                  +7 949 501 57 51
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:+79885852694" className="hover:text-primary transition-colors">
                  +7 988 585 26 94
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@cleanhousednr.ru" className="hover:text-primary transition-colors">
                  info@cleanhousednr.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>г. Донецк, ДНР</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/50">
          <p>© {new Date().getFullYear()} Clean House. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
