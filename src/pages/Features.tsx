import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">Nos Fonctionnalités</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez comment SchoolGenius simplifie la gestion de votre établissement avec des outils intelligents.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
