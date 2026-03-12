import { 
  Users, BookOpen, Calendar, ClipboardCheck, 
  MessageSquare, Brain, BarChart3, Shield,
  Sparkles, Zap
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestion des Élèves",
    description: "Dossiers complets, historique académique, suivi comportemental. Tout en un clic !",
    emoji: "👨‍🎓",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "Examens & Notes",
    description: "Création d'évaluations, calcul auto des moyennes, bulletins générés par l'IA.",
    emoji: "📝",
    color: "secondary",
  },
  {
    icon: Calendar,
    title: "Emplois du Temps",
    description: "Génération intelligente qui respecte TOUTES les contraintes. Magie de l'IA !",
    emoji: "📅",
    color: "accent",
  },
  {
    icon: ClipboardCheck,
    title: "Présence & Discipline",
    description: "Suivi en temps réel, alertes automatiques parents, zéro paperasse.",
    emoji: "✅",
    color: "success",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Des modules puissants, <span className="text-primary">0 prise de tête</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque fonctionnalité a été pensée pour vous faire gagner du temps 
            et améliorer l'expérience de tous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card p-8 rounded-2xl border border-border hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
