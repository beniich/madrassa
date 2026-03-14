import { MessageSquare, TrendingUp, FileText, Calendar, Bot, Send, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui-1cc/card";
import { Button } from "@/components/ui-1cc/button";
import { Input } from "@/components/ui-1cc/input";

const AIAssistant = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-[#e11d48]" />
          AI Hub Entreprise
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          L'intelligence artificielle au service de votre établissement scolaire.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <Card className="p-6 bg-[#fcfaf5] border-[#eae4d3] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-sm">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-foreground/90">Assistant Pédagogique</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Préparez vos cours en quelques minutes, générez des exercices adaptés au niveau de chaque élève.
              </p>
              <div className="bg-[#f5f1e8] text-sm text-foreground/80 p-3.5 rounded-xl border border-[#e5dec9] font-mono shadow-inner">
                « Génère-moi 5 exercices de maths niveau 3ème sur les équations »
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="p-6 bg-[#fcfaf5] border-[#eae4d3] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-foreground/90">Analyse Prédictive</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Détectez les élèves en difficulté AVANT qu'il ne soit trop tard. L'IA analyse notes, absences et comportement.
              </p>
              <div className="bg-[#f5f1e8] text-sm text-foreground/80 p-3.5 rounded-xl border border-[#e5dec9] flex flex-col sm:flex-row gap-2 font-mono shadow-inner">
                <span className="text-orange-500 font-bold flex-shrink-0">⚠️ Alerte :</span> 
                <span>Lucas montre des signes de décrochage (-15% cette semaine)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 3 */}
        <Card className="p-6 bg-[#fcfaf5] border-[#eae4d3] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-sm">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-foreground/90">Bulletins Automatiques</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Fini les heures à rédiger des appréciations ! L'IA génère des commentaires personnalisés et pertinents.
              </p>
              <div className="bg-[#f5f1e8] text-sm text-foreground/80 p-3.5 rounded-xl border border-[#e5dec9] font-mono shadow-inner">
                « Marie fait preuve d'une excellente progression en français... »
              </div>
            </div>
          </div>
        </Card>

        {/* Card 4 */}
        <Card className="p-6 bg-[#fcfaf5] border-[#eae4d3] shadow-sm hover:shadow-md transition-shadow rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-foreground/90">Emploi du Temps IA</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Génération optimisée qui respecte toutes les contraintes : profs, salles, matières, pauses...
              </p>
              <div className="bg-[#f5f1e8] text-sm text-foreground/80 p-3.5 rounded-xl border border-[#e5dec9] flex items-center gap-2 font-mono shadow-inner">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Emploi du temps optimisé généré en 2.3 secondes</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="bg-[#f7f5ef] border-[#eae4d3] shadow-lg overflow-hidden flex flex-col rounded-3xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#eae4d3] flex items-center gap-4 bg-[#f2ebd9]/40 backdrop-blur-sm">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-sm">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">SchoolGenius AI</h2>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 mt-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              En ligne • Répond en ~2s
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-6 md:p-8 flex-1 min-h-[450px] space-y-8 flex flex-col justify-end">
          {/* User Message */}
          <div className="flex justify-end w-full">
            <div className="bg-[#f97316] text-white px-6 py-4 rounded-3xl rounded-tr-md max-w-[90%] md:max-w-[70%] shadow-md text-lg font-medium leading-relaxed">
              Génère-moi un contrôle de SVT sur la photosynthèse pour mes 6èmes 🌱
            </div>
          </div>

          {/* AI Response Container */}
          <div className="flex flex-col gap-3 w-full max-w-[90%] md:max-w-[75%]">
            <div className="bg-[#eeeade] p-6 rounded-3xl rounded-tl-md border border-[#e2d8c9] shadow-sm">
              <p className="text-lg mb-5 text-foreground/90 font-medium">Voici un contrôle adapté au niveau 6ème ! 📝</p>
              
              {/* Inner generated card */}
              <div className="bg-[#fcfaf5] rounded-2xl border border-[#e2d8c9] p-5 shadow-sm space-y-4 mb-5">
                <h4 className="font-bold text-foreground text-lg">CONTRÔLE SVT - La Photosynthèse</h4>
                <div className="text-foreground/80 space-y-2.5 text-base">
                  <p className="flex justify-between"><span>Exercice 1 : Légende le schéma</span> <span className="text-muted-foreground">(5pts)</span></p>
                  <p className="flex justify-between"><span>Exercice 2 : QCM</span> <span className="text-muted-foreground">(6pts)</span></p>
                  <p className="flex justify-between"><span>Exercice 3 : Expérience</span> <span className="text-muted-foreground">(9pts)</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground/90 font-medium">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>Barème et corrigé inclus • Adapté niveau 6ème</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground/80 text-sm font-medium pl-3 mt-1">
              <Sparkles className="h-4 w-4 text-orange-500/80" />
              <span>L'IA peut aussi générer des exercices différenciés...</span>
            </div>
          </div>
        </div>

        {/* Input Area (Mock) */}
        <div className="p-5 bg-white border-t border-[#eae4d3]">
          <div className="relative max-w-5xl mx-auto flex items-center gap-3">
            <Input 
              placeholder="Ex: Génère 3 exercices différenciés sur les fractions pour les 5ème B..." 
              className="h-14 pl-6 pr-4 rounded-full border-[#eae4d3] bg-[#fcfaf5] shadow-sm text-base focus-visible:ring-primary/20 transition-all font-medium flex-1"
            />
            <Button size="icon" className="rounded-full h-14 w-14 bg-gradient-to-br from-[#e11d48] to-[#9333ea] shadow-md hover:opacity-90 flex-shrink-0">
              <Send className="h-5 w-5 text-white ml-0.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIAssistant;
