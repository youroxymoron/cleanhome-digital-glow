import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <StructuredData pageType="home" />
      <Header />
      <main>
        <section id="hero">
          <HeroSection />
        </section>
        <section id="services" aria-label="Наши услуги">
          <ServicesSection />
        </section>
        <section id="about" aria-label="Почему мы">
          <WhyUsSection />
        </section>
        <section id="contacts" aria-label="Контакты">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
