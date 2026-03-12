import { Button } from "@/components/ui/button";
import { Sparkles, Play, ArrowRight, Brain, Zap, Star } from "lucide-react";
import heroImage from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Propulsé par l'IA nouvelle génération</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              La gestion scolaire,{" "}
              <span className="text-gradient">mais en mode</span>{" "}
              <span className="relative inline-block">
                <span className="text-gradient">génie 🧠✨</span>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Fini le chaos administratif ! SchoolGenius automatise, analyse et booste 
              votre établissement grâce à une IA qui comprend vraiment l'éducation. 
              <span className="text-primary font-semibold"> C'est comme avoir 10 assistants, mais en mieux.</span>
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-bold text-foreground">-70%</p>
                  <p className="text-xs text-muted-foreground">Temps admin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">+40%</p>
                  <p className="text-xs text-muted-foreground">Réussite élèves</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="group">
                Commencer gratuitement
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="h-5 w-5 mr-2" />
                Voir la démo
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl opacity-30 scale-105" />
              <img
                src={heroImage}
                alt="SchoolGenius Preview"
                className="relative rounded-3xl shadow-2xl border border-border/50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
