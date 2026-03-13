import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export const AIInsights = () => {
    return (
        <Card className="p-10 border-none shadow-xl bg-white rounded-[3rem]">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-4 w-4 rounded-full bg-primary animate-pulse shadow-glow shadow-primary/50"></div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic">Signal IA</h3>
            </div>
            <div className="space-y-8">
                {[
                    { title: 'Tendance Positive', msg: 'Hausse de 12% du taux d\'assiduité en cycle 2.', icon: TrendingUp, color: 'text-[#222222] bg-secondary' },
                    { title: 'Alerte Matériel', msg: 'Stock pédagogique insuffisant: Inventaire requis.', icon: AlertTriangle, color: 'text-rose-500 bg-rose-50' },
                    { title: 'Insight Académique', msg: 'Point d\'attention: Section Littéraire en 4ème.', icon: Sparkles, color: 'text-primary bg-primary/10' },
                ].map((insight, i) => (
                    <div key={i} className="flex gap-4 group cursor-pointer">
                        <div className={`h-14 w-14 rounded-2xl ${insight.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/5`}>
                            <insight.icon className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{insight.title}</p>
                            <p className="text-sm font-bold text-gray-900 leading-snug">{insight.msg}</p>
                        </div>
                    </div>
                ))}
            </div>
            <Button className="w-full mt-10 h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-xs uppercase tracking-widest border-none shadow-xl shadow-primary/20">
                ANALYSE DÉTAILLÉE
            </Button>
        </Card>
    );
};

export default AIInsights;
