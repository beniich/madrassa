import React from 'react';
import { Button } from '@/components/ui-1cc/button';
import { Card, CardContent } from '@/components/ui-1cc/card';
import { Badge } from '@/components/ui-1cc/badge';
import {
    Brain,
    Calendar,
    Users,
    BedDouble,
    Shield,
    Check,
    ArrowRight,
    Clock,
    AlertTriangle,
    FileText,
    Stethoscope,
    Building2,
    Sparkles,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PitchPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        MedFlow AI
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link to="/auth">
                        <Button variant="ghost" className="text-white hover:bg-white/10">
                            Connexion
                        </Button>
                    </Link>
                    <Link to="/dashboard">
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            Démo Gratuite
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm px-4 py-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Plateforme Hospitalière Intelligente
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
                        MedFlow AI
                    </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-200 mb-8 max-w-3xl mx-auto">
                    La plateforme intelligente de gestion médicale et hospitalière.
                    <br />
                    <span className="text-cyan-300">Moderne. Intuitive. Propulsée par l'IA.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8 py-6">
                            Essayer Maintenant
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
                        Voir la Démo
                    </Button>
                </div>
            </section>

            {/* Pain Points Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Le Problème Actuel</h2>
                    <p className="text-blue-200 text-lg">Les établissements médicaux souffrent de...</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Clock, text: "Logiciels lourds, anciens, non intuitifs" },
                        { icon: Calendar, text: "Agenda mal synchronisé → RDV perdus" },
                        { icon: FileText, text: "Dossiers patients dispersés" },
                        { icon: AlertTriangle, text: "Mauvaise gestion des lits et du personnel" },
                    ].map((item, i) => (
                        <Card key={i} className="bg-red-500/10 border-red-500/30 text-white">
                            <CardContent className="p-6 flex items-center gap-4">
                                <item.icon className="h-8 w-8 text-red-400 flex-shrink-0" />
                                <span className="text-sm">{item.text}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <p className="text-lg text-red-300">
                        👉 Résultat : <strong>perte de temps</strong>, <strong>erreurs humaines</strong>, <strong>surcharge du personnel</strong>
                    </p>
                </div>
            </section>

            {/* Solution Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">💡 La Solution</h2>
                    <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
                        <strong>MedFlow AI</strong> centralise patients, personnel, lits et agenda
                        dans une plateforme intelligente, sécurisée et simple à utiliser.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-cyan-300 text-lg">
                        <Brain className="h-6 w-6" />
                        <span>L'IA ne remplace pas le médecin, <strong>elle l'assiste</strong>.</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">⚙️ Fonctionnalités Clés</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Users,
                            title: "Dossier Patient Intelligent",
                            features: ["Timeline médicale dynamique", "Historique complet", "Alertes automatiques (allergies)"]
                        },
                        {
                            icon: Calendar,
                            title: "Agenda Médical Intelligent",
                            features: ["Sync Google Calendar", "Gestion multi-ressources", "Proposition automatique créneaux"]
                        },
                        {
                            icon: BedDouble,
                            title: "Gestion des Lits & Services",
                            features: ["Vue temps réel", "États automatiques", "Prévision de saturation"]
                        },
                        {
                            icon: Stethoscope,
                            title: "Gestion du Personnel",
                            features: ["Planning par équipe", "Astreintes & gardes", "Vue charge de travail"]
                        },
                        {
                            icon: Brain,
                            title: "Assistant IA Médical",
                            features: ["Résumé automatique", "Génération compte rendu", "Aide à la décision clinique"]
                        },
                        {
                            icon: Shield,
                            title: "Sécurité & Conformité",
                            features: ["Gestion des rôles", "Traçabilité complète", "Prêt RGPD / HIPAA"]
                        },
                    ].map((feature, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <feature.icon className="h-10 w-10 text-cyan-400 mb-4" />
                                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                                <ul className="space-y-2">
                                    {feature.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-blue-200 text-sm">
                                            <Check className="h-4 w-4 text-green-400" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Target Market */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">👥 Pour Qui ?</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="bg-blue-500/10 border-blue-500/30">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-300">
                                <Building2 className="h-6 w-6" />
                                Marché Principal
                            </h3>
                            <ul className="space-y-2 text-blue-100">
                                {["Cliniques privées", "Cabinets médicaux multi-spécialités", "Centres de diagnostic", "Hôpitaux de taille moyenne"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-cyan-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-cyan-500/10 border-cyan-500/30">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-300">
                                <Sparkles className="h-6 w-6" />
                                Marché Secondaire
                            </h3>
                            <ul className="space-y-2 text-cyan-100">
                                {["Téléconsultation", "Réseaux médicaux", "Mutuelles (à terme)"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <ChevronRight className="h-4 w-4 text-blue-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">💰 Tarification</h2>
                <p className="text-center text-blue-200 mb-12">Abonnement SaaS mensuel - Simple et transparent</p>
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { name: "Starter", price: "29€", unit: "/ médecin", features: ["Agenda intelligent", "Gestion patients", "Support email"] },
                        { name: "Pro", price: "79€", unit: "/ médecin", features: ["Tout Starter +", "Assistant IA", "Gestion lits & staff", "Support prioritaire"], popular: true },
                        { name: "Enterprise", price: "Sur devis", unit: "", features: ["Tout Pro +", "API & Intégrations", "Support dédié", "Formation sur site"] },
                    ].map((plan, i) => (
                        <Card key={i} className={`relative ${plan.popular ? 'bg-gradient-to-b from-cyan-500/20 to-blue-500/20 border-cyan-400' : 'bg-white/5 border-white/10'}`}>
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-cyan-500 text-white">Populaire</Badge>
                                </div>
                            )}
                            <CardContent className="p-6 text-center">
                                <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                                <div className="text-4xl font-bold text-cyan-400 mb-1">{plan.price}</div>
                                <div className="text-sm text-blue-200 mb-6">{plan.unit}</div>
                                <ul className="space-y-3 text-left mb-6">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-2 text-blue-100 text-sm">
                                            <Check className="h-4 w-4 text-green-400" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button className={plan.popular ? 'w-full bg-cyan-500 hover:bg-cyan-600' : 'w-full bg-white/10 hover:bg-white/20'}>
                                    Commencer
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Competitive Advantage */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">🧠 Pourquoi MedFlow AI ?</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="bg-red-500/10 border-red-500/30">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4 text-red-300">❌ Autres Solutions</h3>
                            <ul className="space-y-2 text-red-200">
                                {["Rigides", "Chères", "Complexes", "Sans IA réelle"].map((item, i) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-green-500/10 border-green-500/30">
                        <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-4 text-green-300">✅ MedFlow AI</h3>
                            <ul className="space-y-2 text-green-200">
                                {["Moderne", "Modulaire", "Intelligente", "Pensée pour le terrain"].map((item, i) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à Transformer Votre Établissement ?</h2>
                <p className="text-xl text-blue-200 mb-8">Rejoignez les établissements qui font confiance à MedFlow AI.</p>
                <Link to="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-10 py-6">
                        Demander une Démo
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-8">
                <div className="container mx-auto px-6 text-center text-blue-300 text-sm">
                    <p>© 2024 MedFlow AI - Plateforme Hospitalière Intelligente</p>
                    <p className="mt-2">Propulsé par Cloud Industrie</p>
                </div>
            </footer>
        </div>
    );
};

export default PitchPage;
