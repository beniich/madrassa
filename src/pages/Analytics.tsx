import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Award,
  Clock,
  Filter,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  BrainCircuit,
  X,
  Sparkles,
  Zap,
  ChevronRight,
  PieChart,
  Activity
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ============================================================================
// COMPOSANT : RAPPORT IA (GLASSMORPHISM)
// ============================================================================

const AIReportModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative max-w-2xl w-full bg-white rounded-[3.5rem] shadow-[0_32px_80px_rgba(0,0,0,0.3)] overflow-hidden border-none animate-in zoom-in-95 duration-500">
        {/* Gradients animés en arrière-plan */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[80px] animate-pulse delay-700"></div>

        <div className="p-12 relative z-10 space-y-10">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-[#222222] rounded-3xl shadow-2xl shadow-black/20 group-hover:rotate-12 transition-transform">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{t('analytics.aiReport')}</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-3 italic">Généré le {new Date().toLocaleDateString()} • Alpha 5.0</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="h-12 w-12 bg-secondary/50 hover:bg-secondary rounded-2xl flex items-center justify-center text-gray-900 transition-all active:scale-95"
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-secondary/20 rounded-[2.5rem] border border-secondary/30 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                <Sparkles className="h-12 w-12 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.2em] relative z-10">
                <Sparkles className="h-4 w-4" /> Analyse Synthétique
              </div>
              <p className="text-gray-900 leading-relaxed font-black italic text-lg relative z-10">
                "L'établissement montre une croissance de <span className="text-primary font-black border-b-4 border-primary/20">12.4%</span> de l'assiduité sur le dernier trimestre. Les classes de 5ème surperforment en Mathématiques, suggérant l'efficacité de la nouvelle méthode pédagogique."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-[#222222] rounded-[2rem] border-none shadow-xl shadow-black/5 group">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 italic">Point Fort</p>
                <p className="text-sm font-black text-white leading-tight italic">Maitrise du Français en hausse constante (+18%)</p>
              </div>
              <div className="p-6 bg-primary rounded-[2rem] border-none shadow-xl shadow-primary/10 group">
                <p className="text-[10px] font-black text-[#222222] uppercase tracking-widest mb-2 italic">Vigilance</p>
                <p className="text-sm font-black text-white leading-tight italic">Retards récurrents en 3ème B le lundi matin.</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 italic">Recommandations IA</p>
              {['Optimiser le planning des 3ème B', 'Renforcer les tutorats en Sciences', 'Généraliser la méthode de Français'].map((rec, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-secondary/10 rounded-2xl border border-secondary/20 group hover:translate-x-3 transition-all cursor-pointer hover:bg-secondary/20">
                  <div className="h-2 w-2 rounded-full bg-primary group-hover:scale-150 transition-transform"></div>
                  <span className="text-sm font-black text-gray-700 italic">{rec}</span>
                  <ChevronRight className="h-5 w-5 ml-auto text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <Button 
            className="w-full h-20 bg-[#222222] hover:bg-black text-white font-black rounded-[2.5rem] shadow-2xl shadow-black/20 flex items-center justify-center gap-4 text-sm tracking-widest transition-all active:scale-95 group"
            onClick={onClose}
          >
            S'APPROPRIER LES CONSEILS <Zap className="h-6 w-6 fill-primary text-primary group-hover:rotate-12 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const DEMO_ANALYTICS = [
  { period: 'Sept', students: 245, attendance: 92, average: 13.2 },
  { period: 'Oct', students: 248, attendance: 94, average: 13.5 },
  { period: 'Nov', students: 250, attendance: 91, average: 13.8 },
  { period: 'Déc', students: 252, attendance: 88, average: 14.1 },
  { period: 'Jan', students: 255, attendance: 95, average: 14.3 },
  { period: 'Fév', students: 258, attendance: 93, average: 14.0 },
];

const SUBJECT_PERFORMANCE = [
  { subject: 'Mathématiques', average: 14.2, change: 2.5, color: 'from-primary to-orange-400' },
  { subject: 'Français', average: 13.8, change: 1.2, color: 'from-[#222222] to-gray-700' },
  { subject: 'Histoire-Géo', average: 15.1, change: 3.1, color: 'from-primary to-orange-400' },
  { subject: 'Anglais', average: 14.8, change: 1.8, color: 'from-[#222222] to-gray-700' },
  { subject: 'Sciences', average: 13.5, change: -0.5, color: 'from-primary to-orange-400' },
];

export const Analytics = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('month');
  const [showAIReport, setShowAIReport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Génération du rapport PDF...',
        success: 'Rapport exporté avec succès !',
        error: 'Erreur lors de l\'exportation',
      }
    );
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Premium Orange/Charbon */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-[#222222] p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-12 opacity-[0.05] group">
            <Activity className="h-32 w-32 -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
        </div>
        <div className="relative z-10 space-y-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.4em] px-5 py-1.5 rounded-full">
                {t('analytics.badge')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic leading-none">{t('analytics.title')}</h1>
            <p className="text-gray-400 font-medium text-sm max-w-md leading-relaxed">
                {t('analytics.subtitle')}
            </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-[1.8rem] p-2 backdrop-blur-md">
            {['week', 'month', 'year'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                title={`Afficher par ${p}`}
                className={`px-6 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  period === p
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
              </button>
            ))}
          </div>

          <Button 
            className="flex items-center gap-3 h-16 px-10 bg-primary hover:bg-primary/90 text-white rounded-[1.8rem] shadow-2xl shadow-primary/20 border-none font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 group"
            onClick={() => {
              toast.info("L'IA analyse les données actuelles...");
              setTimeout(() => setShowAIReport(true), 1500);
            }}
          >
            <BrainCircuit className="w-6 h-6 group-hover:rotate-12 transition-transform" /> {t('analytics.aiReport')}
          </Button>

          <Button 
            variant="outline" 
            className="h-16 w-16 border-white/10 rounded-[1.8rem] bg-white/5 text-white flex items-center justify-center p-0 hover:bg-white/10 transition-all active:scale-95 group"
            title="Exporter PDF"
            onClick={handleExport}
          >
            <Download className="w-6 h-6 text-primary group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: t('analytics.metrics.students'), val: '258', sub: '+3.2%', up: true, icon: Users, color: 'text-primary', bg: 'bg-primary/5' },
          { label: t('analytics.metrics.attendance'), val: '93%', sub: '+2.1%', up: true, icon: TrendingUp, color: 'text-[#222222]', bg: 'bg-secondary/50' },
          { label: t('analytics.metrics.success'), val: '14.2', sub: '+0.3', up: true, icon: Award, color: 'text-primary', bg: 'bg-primary/5' },
          { label: t('analytics.metrics.withdrawals'), val: '12', sub: '-1.5%', up: false, icon: Clock, color: 'text-[#222222]', bg: 'bg-secondary/50' },
        ].map((m, i) => (
          <Card key={i} className="p-8 border-none shadow-xl bg-white hover:translate-y-[-8px] transition-all duration-500 rounded-[2.5rem] group relative overflow-hidden">
             <div className={cn("absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-bl-full bg-[#222222]")}></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={cn("p-4 rounded-2xl transition-all group-hover:rotate-6 shadow-lg", m.bg, m.color)}>
                <m.icon className="h-7 w-7" />
              </div>
              <div className={cn("flex items-center gap-1 font-black text-xs px-3 py-1.5 rounded-full border shadow-sm", m.up ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100')}>
                {m.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {m.sub}
              </div>
            </div>
            <p className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic mb-2">{m.val}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">{m.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-10 border-none shadow-2xl bg-white rounded-[3.5rem] overflow-hidden relative">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none">{t('analytics.flowEvolution')}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3">Analyse d'Assiduité Mensuelle</p>
            </div>
            <div className="flex items-center gap-3 bg-secondary/30 px-5 py-2.5 rounded-2xl">
               <div className="h-2 w-2 rounded-full bg-primary animate-ping"></div>
               <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] italic">Live Stream</span>
            </div>
          </div>

          <div className="space-y-8">
            {DEMO_ANALYTICS.map((data, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-3 px-2">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{data.period}</span>
                  <span className="text-lg font-black text-gray-900 italic tracking-tighter group-hover:scale-110 transition-transform">{data.attendance}%</span>
                </div>
                <div className="h-5 bg-secondary/30 rounded-2xl overflow-hidden p-1 border border-secondary shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#222222] to-primary rounded-xl transition-all duration-1000 ease-out relative flex items-center justify-end group-hover:shadow-[0_0_20px_rgba(255,109,31,0.3)]"
                    style={{ width: isLoaded ? `${data.attendance}%` : '0%' }}
                  >
                    <div className="absolute right-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Subject Performance Radar simulation */}
        <Card className="p-10 border-none shadow-2xl bg-[#222222] text-white rounded-[3.5rem] relative overflow-hidden group">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[100px] animate-pulse"></div>
          
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-2xl font-black tracking-tighter italic mb-10 flex items-center gap-4 leading-none">
              {t('analytics.pedagogicalPerformance')} <Sparkles className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            </h3>

            <div className="space-y-8 flex-1 flex flex-col justify-center">
              {SUBJECT_PERFORMANCE.map((subject, idx) => (
                <div key={idx} className="space-y-3 group/item">
                  <div className="flex justify-between items-end px-1">
                    <div>
                      <span className="text-[9px] font-black uppercase text-gray-500 tracking-[0.3em] block mb-2 italic group-hover/item:text-primary transition-colors">Discipline</span>
                      <span className="font-black text-lg tracking-tighter italic leading-none">{subject.subject}</span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className={`text-[10px] font-black px-3 py-1 rounded-full italic ${subject.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                          {subject.change >= 0 ? 'AUGM' : 'REPLI'} {Math.abs(subject.change)}%
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter leading-none">{subject.average}</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-1000 flex items-center justify-end relative shadow-lg group-hover/item:shadow-primary/40`}
                      style={{ width: isLoaded ? `${(subject.average / 20) * 100}%` : '0%' }}
                    >
                        <div className="absolute right-1 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Class Ranking & AI Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card className="p-10 border-none shadow-2xl bg-white rounded-[3.5rem]">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-secondary/30 rounded-2xl flex items-center justify-center">
                    <PieChart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none uppercase">{t('analytics.globalRanking')}</h3>
               </div>
               <Badge className="bg-emerald-50 text-emerald-600 border-none font-black italic text-[10px] tracking-widest px-4 py-2">OPTIMAL</Badge>
            </div>
            
            <div className="space-y-5">
              {[
                { class: '5ème A', avg: '15.8', students: 28, trend: '+0.5', rank: 1, color: 'text-primary bg-primary/5 border-primary/10' },
                { class: '4ème B', avg: '14.2', students: 26, trend: '+1.2', rank: 2, color: 'text-[#222222] bg-secondary/30 border-secondary' },
                { class: '3ème A', avg: '13.9', students: 30, trend: '-0.2', rank: 3, color: 'text-gray-400 bg-gray-50 border-gray-100' },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-8 p-6 bg-white hover:bg-secondary/10 transition-all duration-500 rounded-[2.5rem] border border-gray-100/50 hover:border-primary/20 hover:translate-x-3 group cursor-pointer shadow-sm hover:shadow-xl">
                  <div className={`h-16 w-16 rounded-[1.5rem] border flex items-center justify-center font-black text-xl italic shadow-inner group-hover:rotate-12 transition-all ${c.color}`}>
                    {c.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 italic text-xl tracking-tighter leading-none group-hover:text-primary transition-colors">{c.class}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-2 italic">{c.students} EFFECTIFS</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{c.avg}</p>
                    <p className={`text-[10px] font-black mt-2 italic tracking-widest ${c.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{c.trend} PTS</p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* AI Alerts Sidebar Premium */}
        <div className="space-y-8">
          <Card className="p-8 border-none shadow-2xl bg-[#222222] text-white rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full scale-110 group-hover:scale-125 transition-transform"></div>
            
            <h3 className="text-2xl font-black tracking-tighter italic mb-8 flex items-center gap-3 leading-none relative z-10">
              {t('analytics.aiAlerts')} <Zap className="h-6 w-6 fill-primary text-primary group-hover:rotate-12 transition-transform" />
            </h3>
            
            <div className="space-y-5 relative z-10">
              {[
                { type: 'danger', msg: 'Baisse critique en 3ème A', detail: 'Indice Math : -2.3 pts' },
                { type: 'warning', msg: 'Absences prolongées', detail: '5 anomalies non traitées' },
                { type: 'success', msg: 'Record atteint 5ème A', detail: 'Taux Optimal : 99.2%' },
              ].map((alert, i) => (
                <div key={i} className="p-5 bg-white/5 backdrop-blur-3xl rounded-[1.8rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/alert hover:translate-y-[-5px]">
                  <div className="flex items-center gap-4 mb-2">
                    <div className={`h-3 w-3 rounded-full ${alert.type === 'danger' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : alert.type === 'warning' ? 'bg-primary shadow-[0_0_15px_rgba(255,109,31,0.6)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]'} group-hover/alert:scale-125 transition-transform`}></div>
                    <span className="text-sm font-black tracking-tighter italic group-hover/alert:text-primary transition-colors">{alert.msg}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-7 italic">{alert.detail}</p>
                </div>
              ))}
            </div>
            
            <Button 
                className="w-full mt-8 bg-white/5 hover:bg-primary hover:text-white border border-white/10 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] h-14 rounded-2xl transition-all shadow-xl"
                onClick={() => toast.info("Ouverture du registre d'alertes IA...")}
            >
              LOGS GÉNÉRAUX
            </Button>
          </Card>
          
          <div className="bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20 flex items-start gap-5 shadow-inner relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-[0.1] group-hover:scale-110 transition-transform">
                <Zap className="h-10 w-10 text-primary" />
             </div>
             <div className="p-3 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 relative z-10">
               <TrendingUp className="h-6 w-6" />
             </div>
             <div className="relative z-10">
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 italic">{t('analytics.insightOfDay')}</p>
               <p className="text-sm font-black text-[#222222] leading-relaxed italic">
                 Le taux de réussite est corrélé à <span className="text-primary tracking-tighter text-lg">84%</span> avec l'assiduité du lundi.
               </p>
             </div>
          </div>
        </div>
      </div>

      {/* MODAL : RAPPORT IA */}
      {showAIReport && <AIReportModal onClose={() => setShowAIReport(false)} />}
    </div>
  );
};

export default Analytics;


