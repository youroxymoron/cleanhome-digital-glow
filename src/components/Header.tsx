import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Главная", href: "#" },
    { label: "Услуги", href: "#services" },
    { label: "О нас", href: "#about" },
    { label: "Цены", href: "#services" },
    { label: "Контакты", href: "#contacts" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile phone banner */}
      <div className="md:hidden bg-primary text-primary-foreground py-2 px-4">
        <a
          href="tel:+79495015751"
          className="flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Phone className="w-4 h-4" />
          <span>+7 949 501 57 51</span>
        </a>
      </div>
      
      <div className="bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
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
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Phone & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+79495015751"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-medium">+7 949 501 57 51</span>
            </a>
            <Button asChild>
              <a href="#contacts">Записаться</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
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
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="tel:+79495015751"
                  className="flex items-center gap-2 text-primary font-medium"
                >
                  <Phone className="w-4 h-4" />
                  +7 949 501 57 51
                </a>
                <Button asChild className="w-full mt-2">
                  <a href="#contacts">Записаться</a>
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
