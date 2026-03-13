import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from 'lucide-react';

export const PerformanceSnapshot = () => {
    return (
        <Card className="p-10 border-none shadow-2xl bg-[#222222] text-white rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05]">
                <Zap className="h-24 w-24 text-primary" />
            </div>
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter italic">Flux Académique</h3>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Données consolidées</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] font-black px-4 py-1">TEMPS RÉEL</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8 text-center md:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Objectifs de Réussite</p>
                        <div className="relative h-48 w-48 mx-auto md:mx-0">
                            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-800" strokeWidth="3" />
                                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary" strokeWidth="3" strokeDasharray="88, 100" strokeLinecap="round" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-4xl font-black italic">88%</span>
                                <span className="text-[8px] font-black text-gray-500 uppercase">Global Index</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Présence Hebdomadaire</p>
                        <div className="space-y-5">
                            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'].map((d, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">{d}</span>
                                        <span className="text-xs font-black text-primary">{90 + (i*2)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${90 + (i*2)}%` } as React.CSSProperties}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default PerformanceSnapshot;
