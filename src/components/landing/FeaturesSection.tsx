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
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Messagerie, notifications push, WhatsApp. Parents et profs enfin connectés !",
    emoji: "💬",
    color: "primary",
  },
  {
    icon: Brain,
    title: "Assistant IA",
    description: "Aide à la préparation de cours, génération d'exercices, feedback personnalisé.",
    emoji: "🤖",
    color: "secondary",
  },
  {
    icon: BarChart3,
    title: "Analytics Prédictifs",
    description: "Détection précoce des difficultés, score de risque décrochage, recommandations.",
    emoji: "📊",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Sécurité RGPD",
    description: "Données chiffrées, accès par rôles, conformité totale données mineurs.",
    emoji: "🔒",
    color: "success",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/20">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-semibold">Tout-en-un</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            8 modules puissants,{" "}
            <span className="text-gradient">0 prise de tête</span> <span role="img" aria-label="Cible">🎯</span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chaque fonctionnalité a été pensée pour vous faire gagner du temps 
            et améliorer l'expérience de tous : direction, profs, élèves et parents.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 delay-[${index * 100}ms]`}
            >
              {/* Emoji Badge */}
              <div className={`absolute -top-3 -right-3 text-3xl animate-float delay-[${index * 200}ms]`}>
                <span role="img" aria-label={feature.title}>{feature.emoji}</span>
              </div>

              {/* Icon */}
              <div className={`p-3 rounded-xl mb-4 inline-block ${
                feature.color === 'primary' ? 'bg-primary/10 text-primary' :
                feature.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
                feature.color === 'accent' ? 'bg-accent text-accent-foreground' :
                'bg-success/10 text-success'
              }`}>
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 gradient-primary rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-6 py-3 rounded-full">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-foreground font-medium">
              Et ce n'est que le début... L'IA apprend et s'améliore chaque jour !
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
