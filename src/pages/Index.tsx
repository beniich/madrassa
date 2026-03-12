import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <div className="py-20 text-center container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Prêt à transformer votre établissement ?</h2>
          <p className="text-xl text-muted-foreground mb-10">Rejoignez la révolution de la gestion scolaire intelligente.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
