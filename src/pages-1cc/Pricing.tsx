import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Building2, Crown, ArrowRight, MessageSquare, Brain, Eye, Calendar, Users, Shield, BarChart3, Settings, Cpu } from "lucide-react";
import { Button } from "@/components/ui-1cc/button";
import { Badge } from "@/components/ui-1cc/badge";
import { Switch } from "@/components/ui-1cc/switch";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  icon: React.ReactNode;
  highlighted: boolean;
  badge?: string;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "default" | "outline" | "secondary";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    description: "Idéal pour découvrir la plateforme",
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <Sparkles className="h-6 w-6" />,
    highlighted: false,
    features: [
      { text: "Chat IA limité (50 requêtes/mois)", included: true },
      { text: "1 utilisateur", included: true },
      { text: "Accès aux processus de base", included: true },
      { text: "3 ordres de fabrication/mois", included: true },
      { text: "Support email standard", included: true },
      { text: "Analyse méthodes IA", included: false },
      { text: "Vision IA (détection défauts)", included: false },
      { text: "Intégrations ERP", included: false },
    ],
    cta: "Commencer gratuitement",
    ctaVariant: "outline",
  },
  {
    id: "pro",
    name: "Pro",
    description: "Pour les équipes de production",
    monthlyPrice: 49,
    yearlyPrice: 39,
    icon: <Zap className="h-6 w-6" />,
    highlighted: true,
    badge: "Populaire",
    features: [
      { text: "Chat IA illimité", included: true },
      { text: "GPT-4 / GPT-5 / Claude / Gemini", included: true },
      { text: "Analyse Méthodes IA (MTM/MOST)", included: true },
      { text: "Vision IA (détection défauts)", included: true },
      { text: "Optimisation planning intelligent", included: true },
      { text: "5 utilisateurs inclus", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Rapports avancés PDF/Excel", included: true },
      { text: "Intégrations ERP de base", included: true },
    ],
    cta: "Démarrer l'essai Pro",
    ctaVariant: "default",
  },
  {
    id: "business",
    name: "Business",
    description: "Solution multi-sites complète",
    monthlyPrice: 129,
    yearlyPrice: 99,
    icon: <Building2 className="h-6 w-6" />,
    highlighted: false,
    features: [
      { text: "Tout le plan Pro +", included: true },
      { text: "Multi-usines illimitées", included: true },
      { text: "OEE / TRS complet temps réel", included: true },
      { text: "Maintenance prédictive IA", included: true },
      { text: "API illimitée", included: true },
      { text: "Workers IA dédiés", included: true },
      { text: "Historique long terme (5 ans)", included: true },
      { text: "Permissions avancées RBAC", included: true },
      { text: "Sécurité Enterprise (SSO)", included: true },
    ],
    cta: "Contacter les ventes",
    ctaVariant: "secondary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Solution sur-mesure",
    monthlyPrice: null,
    yearlyPrice: null,
    icon: <Crown className="h-6 w-6" />,
    highlighted: false,
    features: [
      { text: "Tout le plan Business +", included: true },
      { text: "IA personnalisée fine-tuned", included: true },
      { text: "Intégration machine-to-cloud", included: true },
      { text: "Support 24/7 dédié", included: true },
      { text: "Hébergement cloud privé", included: true },
      { text: "Audit & conformité ISO", included: true },
      { text: "Connecteurs MES sur mesure", included: true },
      { text: "Formation équipe incluse", included: true },
      { text: "SLA garantie 99.9%", included: true },
    ],
    cta: "Nous contacter",
    ctaVariant: "outline",
  },
];

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "IA Industrielle Avancée",
    description: "Analyse méthodes, optimisation ligne, simulation planning automatique.",
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Planificateur Intelligent",
    description: "Gantt dynamique + IA qui propose le meilleur séquencement.",
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Maintenance Prédictive",
    description: "Détection anomalies machine + prévision panne avant incident.",
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "KPI & Analytics",
    description: "TRS, OEE, Pareto, qualité, rendement en temps réel.",
  },
  {
    icon: <Eye className="h-8 w-8" />,
    title: "Vision Industrielle",
    description: "Détection défaut, inspection produit, ergonomie poste.",
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Gestion Processus",
    description: "Création SOP, AMDEC, fiches opérateur automatisées.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Sécurité Enterprise",
    description: "RBAC, audit, isolation par usine, conformité.",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaboration Équipe",
    description: "5 comptes inclus, partage, commentaires, historique.",
  },
];

const faqs = [
  {
    question: "Puis-je changer de plan à tout moment ?",
    answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement avec un prorata sur votre facturation.",
  },
  {
    question: "Y a-t-il un essai gratuit pour les plans payants ?",
    answer: "Oui, tous les plans payants incluent un essai gratuit de 14 jours, sans engagement ni carte bancaire requise.",
  },
  {
    question: "Comment fonctionne la facturation annuelle ?",
    answer: "La facturation annuelle vous offre 2 mois gratuits par rapport à la facturation mensuelle. Vous êtes facturé une fois par an.",
  },
  {
    question: "Quelles intégrations ERP sont supportées ?",
    answer: "Nous supportons SAP, Oracle, Microsoft Dynamics, Sage, et de nombreux autres ERP. L'intégration personnalisée est disponible sur le plan Enterprise.",
  },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Tarification simple et transparente
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Choisissez le plan qui vous
              <span className="text-primary block mt-2">propulse vers l'excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Pas de frais cachés. Pas d'engagement. Commencez gratuitement et évoluez selon vos besoins.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Mensuel
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annuel
              </span>
              {isAnnual && (
                <Badge variant="default" className="bg-success text-success-foreground">
                  -20% économisé
                </Badge>
              )}
            </div>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`
                  relative rounded-2xl p-6 
                  ${plan.highlighted
                    ? 'bg-primary text-primary-foreground shadow-xl scale-105 border-2 border-primary'
                    : 'bg-card shadow-neu border border-border'
                  }
                `}
              >
                {plan.badge && (
                  <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground"
                  >
                    {plan.badge}
                  </Badge>
                )}

                <div className="mb-6">
                  <div className={`
                    inline-flex p-3 rounded-xl mb-4
                    ${plan.highlighted ? 'bg-primary-foreground/20' : 'bg-primary/10'}
                  `}>
                    <span className={plan.highlighted ? 'text-primary-foreground' : 'text-primary'}>
                      {plan.icon}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? '' : 'text-foreground'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.monthlyPrice !== null ? (
                    <>
                      <span className={`text-4xl font-bold ${plan.highlighted ? '' : 'text-foreground'}`}>
                        {isAnnual ? plan.yearlyPrice : plan.monthlyPrice}€
                      </span>
                      <span className={`text-sm ${plan.highlighted ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        /mois
                      </span>
                      {isAnnual && plan.monthlyPrice > 0 && (
                        <p className={`text-xs mt-1 ${plan.highlighted ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                          Facturé annuellement ({(plan.yearlyPrice ?? 0) * 12}€/an)
                        </p>
                      )}
                    </>
                  ) : (
                    <span className={`text-2xl font-bold ${plan.highlighted ? '' : 'text-foreground'}`}>
                      Sur devis
                    </span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${feature.included
                        ? plan.highlighted ? 'text-primary-foreground' : 'text-success'
                        : 'text-muted-foreground/40'
                        }`} />
                      <span className={`text-sm ${feature.included
                        ? plan.highlighted ? 'text-primary-foreground' : 'text-foreground'
                        : 'text-muted-foreground/60 line-through'
                        }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full group ${plan.highlighted
                    ? 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                    : ''
                    }`}
                  variant={plan.highlighted ? "default" : plan.ctaVariant}
                  asChild
                >
                  <Link to={
                    plan.id === 'enterprise'
                      ? '/contact'
                      : `/checkout?plan=${plan.id}&billing=${isAnnual ? 'yearly' : 'monthly'}`
                  }>
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fonctionnalités incluses
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Toutes les fonctionnalités dont vous avez besoin pour digitaliser votre industrie
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 shadow-neu hover:shadow-neu-hover transition-all duration-300 border border-border"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-neu border border-border"
              >
                <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary rounded-3xl p-12 text-center max-w-4xl mx-auto"
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-6 text-primary-foreground" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Besoin d'aide pour choisir ?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
              Notre équipe est là pour vous accompagner et trouver la solution adaptée à vos besoins industriels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/contact">
                  Parler à un expert
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/checkout?plan=free&billing=monthly">
                  Essayer gratuitement
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
