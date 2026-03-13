import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">À propos de SchoolGenius</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Nous transformons la gestion scolaire avec l'intelligence artificielle pour permettre aux enseignants de se concentrer sur l'essentiel : la réussite des élèves.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default About;
