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

      {/* Floating Elements */}
      <div className="absolute top-32 right-20 animate-float hidden lg:block">
        <div className="bg-card p-3 rounded-2xl shadow-xl border border-border">
          <span className="text-3xl">🎓</span>
        </div>
      </div>
      <div className="absolute top-48 left-16 animate-float hidden lg:block" style={{ animationDelay: "0.5s" }}>
        <div className="bg-card p-3 rounded-2xl shadow-xl border border-border">
          <span className="text-3xl">🤖</span>
        </div>
      </div>
      <div className="absolute bottom-32 left-24 animate-float hidden lg:block" style={{ animationDelay: "1s" }}>
        <div className="bg-card p-3 rounded-2xl shadow-xl border border-border">
          <span className="text-3xl">📚</span>
        </div>
      </div>
      <div className="absolute bottom-48 right-32 animate-float hidden lg:block" style={{ animationDelay: "1.5s" }}>
        <div className="bg-card p-3 rounded-2xl shadow-xl border border-border">
          <span className="text-3xl">⭐</span>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Propulsé par l'IA nouvelle génération</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              La gestion scolaire,{" "}
              <span className="text-gradient">mais en mode</span>{" "}
              <span className="relative inline-block">
                <span className="text-gradient">génie 🧠✨</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Fini le chaos administratif ! SchoolGenius automatise, analyse et booste 
              votre établissement grâce à une IA qui comprend vraiment l'éducation. 
              <span className="text-primary font-semibold"> C'est comme avoir 10 assistants, mais en mieux.</span>
            </p>

            {/* Stats Mini */}
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
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/30 rounded-lg">
                  <Star className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground">500+</p>
                  <p className="text-xs text-muted-foreground">Écoles conquises</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" className="group">
                Commencer gratuitement
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl" className="group">
                <Play className="h-5 w-5" />
                Voir la démo
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="mt-6 text-sm text-muted-foreground">
              ✓ Pas de CB requise • ✓ Setup en 5 min • ✓ Support 24/7
            </p>
          </div>

          {/* Right Content - Hero Image */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 gradient-hero rounded-3xl blur-2xl opacity-30 scale-105" />
              
              {/* Main Image */}
              <img
                src={heroImage}
                alt="SchoolGenius Platform Preview"
                className="relative rounded-3xl shadow-2xl border border-border/50"
              />

              {/* Floating Card - AI Badge */}
              <div className="absolute -bottom-4 -left-4 bg-card p-4 rounded-2xl shadow-xl border border-border animate-float">
                <div className="flex items-center gap-3">
                  <div className="p-2 gradient-primary rounded-xl">
                    <Brain className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">IA Active</p>
                    <p className="text-xs text-muted-foreground">Analyse en cours...</p>
                  </div>
                </div>
              </div>

              {/* Floating Card - Notification */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-2xl shadow-xl border border-border animate-float" style={{ animationDelay: "0.7s" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <p className="font-bold text-foreground text-sm">+15 bulletins</p>
                    <p className="text-xs text-muted-foreground">Générés automatiquement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
