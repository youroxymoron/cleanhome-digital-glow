import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import ReviewsSection from "@/components/ReviewsSection";
import GallerySection from "@/components/GallerySection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import { useFaq } from "@/hooks/useFaq";
import { useReviews } from "@/hooks/useReviews";
import { DEFAULT_FAQS } from "@/lib/seo";

const Index = () => {
  const { data: faqs } = useFaq();
  const { data: reviews } = useReviews();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <StructuredData pageType="home" faqs={faqs?.length ? faqs : DEFAULT_FAQS} reviews={reviews || []} />
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <ReviewsSection />
        <GallerySection />
        <WhyUsSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
