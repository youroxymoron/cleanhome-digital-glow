import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { getDisplayContacts, useContacts } from "@/hooks/useContacts";
import { reachYandexGoal } from "@/lib/analytics";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { data: contacts } = useContacts();
  const phones = getDisplayContacts(contacts).filter((contact) => contact.contact_type === "phone").slice(0, 2);
  const homeAnchor = (anchor: string) => location.pathname === "/" ? anchor : `/${anchor}`;

  const navItems = [
    { id: "home", label: "Главная", href: "/" },
    { id: "services", label: "Услуги", href: homeAnchor("#services") },
    { id: "about", label: "О нас", href: homeAnchor("#about") },
    { id: "prices", label: "Цены", href: homeAnchor("#services") },
    { id: "contacts", label: "Контакты", href: homeAnchor("#contacts") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile phone banner */}
      <div className="md:hidden bg-primary text-primary-foreground py-2.5 px-4">
        <div className="flex flex-col items-center justify-center gap-1 text-lg font-semibold leading-tight">
          {phones.map((phone, index) => (
            <a id={`header-mobile-phone-${index + 1}`} data-ym-goal="phone_click" key={phone.id} href={phone.href || undefined} onClick={() => reachYandexGoal("phone_click", { placement: "header_mobile", contact_id: phone.id })} className="flex items-center gap-2 py-0.5">
              <Phone className="w-5 h-5" /><span>{phone.value}</span>
            </a>
          ))}
        </div>
      </div>

      
      <div className="bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a id="header-logo" href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-xl text-foreground">Clean House</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                id={`nav-desktop-${item.id}`}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Phone & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col leading-tight">
              {phones.map((phone, index) => (
                <a id={`header-desktop-phone-${index + 1}`} data-ym-goal="phone_click" key={phone.id} href={phone.href || undefined} onClick={() => reachYandexGoal("phone_click", { placement: "header_desktop", contact_id: phone.id })} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /><span className="font-medium">{phone.value}</span>
                </a>
              ))}
            </div>
            <Button asChild>
              <a id="cta-header-booking" data-ym-goal="contact_cta_click" href={homeAnchor("#contacts")} onClick={() => reachYandexGoal("contact_cta_click", { placement: "header_desktop" })}>Записаться</a>
            </Button>
          </div>


          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-4 py-6">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    id={`nav-mobile-${item.id}`}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {phones.map((phone, index) => (
                  <a id={`header-menu-phone-${index + 1}`} data-ym-goal="phone_click" key={phone.id} href={phone.href || undefined} onClick={() => reachYandexGoal("phone_click", { placement: "header_menu", contact_id: phone.id })} className="flex items-center gap-2 text-primary text-lg font-semibold">
                    <Phone className="w-5 h-5" />{phone.value}
                  </a>
                ))}

                <Button asChild className="w-full mt-2">
                  <a id="cta-header-mobile-booking" data-ym-goal="contact_cta_click" href={homeAnchor("#contacts")} onClick={() => reachYandexGoal("contact_cta_click", { placement: "header_mobile_menu" })}>Записаться</a>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
