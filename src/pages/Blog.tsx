import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-6">Blog SchoolGenius</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez nos derniers articles sur l'éducation et l'intelligence artificielle.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
