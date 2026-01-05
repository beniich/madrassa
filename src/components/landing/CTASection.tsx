import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const benefits = [
  "Déploiement en 24h",
  "Formation équipe incluse",
  "Support 24/7 dédié",
  "Migration données gratuite",
];

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card text-primary px-4 py-2 rounded-full mb-8 border border-primary/20 shadow-lg">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-semibold">Offre de lancement</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Prêt à révolutionner{" "}
            <span className="text-gradient">votre établissement ?</span> 🚀
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Rejoignez les 500+ écoles qui ont déjà fait le pas vers l'éducation du futur. 
            Essai gratuit 30 jours, sans engagement, sans CB.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border"
              >
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="group">
              Démarrer l'essai gratuit
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl">
              Demander une démo personnalisée
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-lg"
                >
                  {['👩‍🏫', '👨‍💼', '👩‍💻', '👨‍🎓', '👩‍🔬'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">2,847 professionnels</span>{" "}
              utilisent SchoolGenius ce mois-ci
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
