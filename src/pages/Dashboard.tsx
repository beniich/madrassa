import { useState, useEffect, Suspense, lazy } from 'react';
import {
  UserPlus,
  FileText,
  Calendar,
  Send,
  Bot,
  BarChart3,
  Sparkles,
  ChevronRight,
  Clock,
  Bell,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StatsSkeleton, ChartSkeleton, ListSkeleton } from '@/components/ui/skeleton';

// Lazy loading for UI Streaming
const StatsSection = lazy(() => import('@/components/dashboard/StatsSection'));
const PerformanceSnapshot = lazy(() => import('@/components/dashboard/PerformanceSnapshot'));
const AIInsights = lazy(() => import('@/components/dashboard/AIInsights'));

export const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAIScan = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Analyse des données par l\'IA...',
        success: 'Analyse terminée : 2 anomalies détectées et corrigées.',
        error: 'Échec de la connexion IA',
      }
    );
  };

  const QUICK_ACTIONS = [
    { label: 'Nouvel Élève', icon: UserPlus, color: 'text-primary bg-primary/10', path: '/students' },
    { label: 'Saisir Note', icon: FileText, color: 'text-gray-700 bg-gray-100', path: '/exams' },
    { label: 'Planning', icon: Calendar, color: 'text-primary bg-primary/10', path: '/schedule' },
    { label: 'Message', icon: Send, color: 'text-gray-700 bg-gray-100', path: '/messages' },
    { label: 'Assistant', icon: Bot, color: 'text-primary bg-primary/10', path: '/dashboard' },
    { label: 'Analytique', icon: BarChart3, color: 'text-gray-700 bg-gray-100', path: '/analytics' },
    { label: 'Documents', icon: FileText, color: 'text-primary bg-primary/10', path: '/documents' },
    { label: 'Paramètres', icon: GraduationCap, color: 'text-gray-700 bg-gray-100 text-xs', path: '/settings' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome Banner - Sync (First Paint) */}
      <div className="relative overflow-hidden rounded-[3rem] bg-[#222222] p-8 md:p-14 text-white shadow-2xl shadow-black/20">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-primary/20 rounded-full blur-[120px] rotate-[-15deg]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-primary/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="max-w-xl space-y-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-black uppercase tracking-widest text-[9px] px-4 py-1.5 backdrop-blur-md">
                <Sparkles className="h-3 w-3 mr-2" /> {t('dashboard.academicOperations') || 'OPÉRATIONS ACADÉMIQUES'}
              </Badge>
              <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <Clock className="h-3 w-3" /> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">
              Prêt pour un cycle <span className="text-primary italic">optimal ?</span>
            </h1>
            <p className="text-gray-400 font-medium leading-relaxed max-w-md text-sm">
              Toutes les données de l'établissement sont synchronisées. 
              <span className="text-white font-bold ml-1">L'IA de SchoolGenius</span> est à votre service.
            </p>
            <div className="flex gap-4 pt-4">
                <Button className="bg-primary text-white hover:bg-primary/90 font-black rounded-2xl h-14 px-10 flex items-center gap-3 group transition-all shrink-0 shadow-xl shadow-primary/20">
                    {t('dashboard.viewReports') || 'RAPPORT COMPLET'} <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full md:w-auto items-end">
            <LanguageSwitcher />
            <Button 
                onClick={handleAIScan}
                className="bg-white/5 hover:bg-white/10 text-white font-black rounded-3xl h-16 px-8 border border-white/10 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group"
            >
              <div className="h-10 w-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 group-hover:rotate-12 transition-transform">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Assistant IA</p>
                  <p className="text-xs font-black">SCAN ÉTABLISSEMENT</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Streamed */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions Panel - Sync */}
            <Card className="p-10 border-none shadow-xl bg-white rounded-[3rem]">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Tableau de Commande</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Actions administratives prioritaires</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {QUICK_ACTIONS.map((act, i) => (
                        <button 
                            key={i} 
                            onClick={() => navigate(act.path)}
                            title={act.label}
                            className="flex flex-col items-center gap-4 p-6 rounded-[2rem] hover:bg-secondary/30 transition-all group relative overflow-hidden"
                        >
                            <div className={`p-5 rounded-2xl ${act.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm shadow-black/5`}>
                                <act.icon className="h-6 w-6" />
                            </div>
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter text-center">{act.label}</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Performance Snapshot - Streamed */}
            <Suspense fallback={<ChartSkeleton />}>
                <PerformanceSnapshot />
            </Suspense>
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
            {/* AI Insights - Streamed */}
            <Suspense fallback={<div className="p-10 bg-white rounded-[3rem] shadow-xl"><ListSkeleton count={3} /></div>}>
                <AIInsights />
            </Suspense>

            {/* Notification Center Snapshot - Sync */}
            <Card className="p-8 border-none shadow-2xl bg-primary text-white rounded-[3rem] relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <Bell className="h-20 w-20 rotate-12" />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-3 italic">
                            Centre d'Alerte
                        </h3>
                        <div className="h-8 w-8 bg-white text-primary rounded-full flex items-center justify-center font-black text-sm">12</div>
                    </div>
                    <div className="space-y-6">
                        {[
                            { time: '14:20', msg: 'Rapport mensuel prêt pour archivage' },
                            { time: '12:00', msg: 'Réunion départementale (Salle A)' },
                            { time: '09:15', msg: 'Validation budgétaire en attente' },
                        ].map((notif, i) => (
                            <div key={i} className="flex gap-4 items-start border-l-2 border-white/20 pl-5 py-1 hover:border-white transition-all cursor-pointer">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">{notif.time}</span>
                                <p className="text-xs font-black leading-snug">{notif.msg}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

