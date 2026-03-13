import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Une question ? Une démo personnalisée ? Notre équipe est à votre écoute.
        </p>
        <div className="max-w-md mx-auto p-6 border rounded-xl shadow-sm">
          <p className="font-semibold text-lg mb-2">Email</p>
          <a href="mailto:contact@schoolgenius.fr" className="text-primary hover:underline block mb-4">
            contact@schoolgenius.fr
          </a>
          <p className="font-semibold text-lg mb-2">Téléphone</p>
          <a href="tel:+33123456789" className="text-primary hover:underline">
            01 23 45 67 89
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
