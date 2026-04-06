import { Button } from "@/components/ui/button";
import { 
  Brain, Sparkles, MessageSquare, TrendingUp, 
  FileText, Calendar, ArrowRight, Bot
} from "lucide-react";

const aiFeatures = [
  {
    icon: MessageSquare,
    title: "Assistant Pédagogique",
    description: "Préparez vos cours en quelques minutes, générez des exercices adaptés au niveau de chaque élève.",
    demo: "« Génère-moi 5 exercices de maths niveau 3ème sur les équations »",
  },
  {
    icon: TrendingUp,
    title: "Analyse Prédictive",
    description: "Détectez les élèves en difficulté AVANT qu'il ne soit trop tard. L'IA analyse notes, absences et comportement.",
    demo: "⚠️ Alerte : Lucas montre des signes de décrochage (-15% cette semaine)",
  },
  {
    icon: FileText,
    title: "Report Cards Automatiques",
    description: "Fini les heures à rédiger des appréciations ! L'IA génère des commentaires personnalisés et pertinents.",
    demo: "« Marie fait preuve d'une excellente progression en français... »",
  },
  {
    icon: Calendar,
    title: "Emploi du Temps IA",
    description: "Génération optimisée qui respecte toutes les contraintes : profs, salles, matières, pauses...",
    demo: "✅ Emploi du temps optimisé généré en 2.3 secondes",
  },
];

const AISection = () => {
  return (
    <section id="ai" className="py-24 relative overflow-hidden bg-card">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[length:40px_40px]"
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Brain className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-semibold">Powered by AI</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            L'IA qui fait vraiment{" "}
            <span className="text-gradient">le boulot</span> <span role="img" aria-label="Robot">🤖</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pas de buzzwords, que du concret. Notre IA a été entraînée sur des milliers 
            de cas scolaires pour vous offrir une aide réellement utile.
          </p>
        </div>

        {/* AI Chat Demo */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-background rounded-3xl border border-border shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-muted/50 px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="p-2 gradient-primary rounded-xl">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">SchoolGenius AI</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" role="status" aria-label="En ligne" />
                  En ligne • Répond en ~2s
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 space-y-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground px-4 py-3 rounded-2xl rounded-br-md max-w-md" aria-label="Message de l'utilisateur">
                  <p className="text-sm">Génère-moi un contrôle de SVT sur la photosynthèse pour mes 6èmes <span role="img" aria-label="Plante">🌱</span></p>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md max-w-md" aria-label="Réponse de l'IA">
                  <p className="text-sm text-foreground mb-3">
                    Voici un contrôle adapté au niveau 6ème ! <span role="img" aria-label="Note">📝</span>
                  </p>
                  <div className="bg-background rounded-xl p-3 border border-border text-xs space-y-2">
                    <p className="font-bold text-foreground">CONTRÔLE SVT - La Photosynthèse</p>
                    <p className="text-muted-foreground">Exercice 1 : Légende le schéma (5pts)</p>
                    <p className="text-muted-foreground">Exercice 2 : QCM (6pts)</p>
                    <p className="text-muted-foreground">Exercice 3 : Expérience (9pts)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ✨ Barème et corrigé inclus • Adapté niveau 6ème
                  </p>
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm">L'IA peut aussi générer des exercices différenciés...</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aiFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-background p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 gradient-primary rounded-xl shrink-0">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>
                  <div className="bg-muted/50 px-4 py-2 rounded-lg border border-border">
                    <p className="text-xs text-foreground font-mono">
                      {feature.demo}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button variant="hero" size="xl" className="group">
            Tester l'IA gratuitement
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            🔒 Vos données ne sont jamais utilisées pour entraîner l'IA
          </p>
        </div>
      </div>
    </section>
  );
};

export default AISection;
