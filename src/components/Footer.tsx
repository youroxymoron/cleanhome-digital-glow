import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

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
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Пн–Сб: 8:00–20:00</span>
              </li>
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
              <Link to="/privacy" className="text-background/60 hover:text-primary transition-colors text-sm">
                Политика конфиденциальности
              </Link>
              <Link to="/offer" className="text-background/60 hover:text-primary transition-colors text-sm">
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
