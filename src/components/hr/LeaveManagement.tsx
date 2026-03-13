import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, AlertCircle, Plus, ChevronRight, PieChart, BarChart2, Loader2 } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { hrService, LeaveRequest } from '@/services/hrService';
import { toast } from 'sonner';

const LEAVE_TYPES = [
    { name: 'Annuel', value: 45 },
    { name: 'Maladie', value: 25 },
    { name: 'Maternité', value: 15 },
    { name: 'Exceptionnel', value: 10 },
    { name: 'Sans Solde', value: 5 },
];

const MONTHLY_ABSENCE = [
    { month: 'Sep', days: 45 },
    { month: 'Oct', days: 52 },
    { month: 'Nov', days: 38 },
    { month: 'Déc', days: 85 },
    { month: 'Jan', days: 42 },
    { month: 'Fév', days: 65 },
];

const COLORS = ['#FFCD00', '#222222', '#FACC15', '#454545', '#71717A'];

export const LeaveManagement: React.FC = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await hrService.getLeaveRequests();
            setRequests(data);
        } catch (error) {
            toast.error("Erreur lors du chargement des demandes");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        try {
            await hrService.updateLeaveStatus(id, status);
            toast.success(`Demande ${status === 'approved' ? 'approuvée' : 'refusée'}`);
            loadRequests();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-emerald-50 text-emerald-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1';
            case 'pending': return 'bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3 py-1';
            case 'rejected': return 'bg-rose-50 text-rose-600 border-none font-black text-[10px] uppercase tracking-widest px-3 py-1';
            default: return 'bg-gray-100 text-gray-500 border-none font-black text-[10px]  px-3 py-1';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-primary" />;
            case 'rejected': return <XCircle className="w-4 h-4 text-rose-500" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-gray-900">Centre des Congés</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Gérez les absences et plannings</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-gray-200 text-gray-600 hover:bg-gray-50">
                        Calendrier Absences
                    </Button>
                    <Button className="flex-1 sm:flex-none h-12 bg-primary hover:bg-primary/90 text-[#222222] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" /> Saisir Congé
                    </Button>
                </div>
            </div>

            {/* Dashboard Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Evolution Absences */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl p-8 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <BarChart2 className="w-24 h-24 text-gray-900 -rotate-12" />
                    </div>
                    <CardHeader className="px-0 pt-0 border-b border-gray-100 pb-6 mb-8 relative z-10">
                        <CardTitle className="text-xl font-black italic tracking-tighter">Évolution Mensuelle</CardTitle>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Jours d'absence cumulés</p>
                    </CardHeader>
                    <div className="h-[250px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MONTHLY_ABSENCE}>
                                <defs>
                                    <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#222222" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#222222" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'black' }}
                                />
                                <Area type="monotone" dataKey="days" stroke="#222222" strokeWidth={3} fillOpacity={1} fill="url(#colorDays)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Repartition Types */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-[#222222] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                        <PieChart className="w-24 h-24 text-primary" />
                    </div>
                    <CardHeader className="px-0 pt-0 border-b border-white/10 pb-6 mb-8 relative z-10">
                        <CardTitle className="text-xl font-black italic tracking-tighter">Motifs d'Absence</CardTitle>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Distribution S1</p>
                    </CardHeader>
                    <div className="h-[200px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={LEAVE_TYPES}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {LEAVE_TYPES.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip cursor={false} contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', color: '#fff' }} />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-xl font-black italic leading-none text-primary">100%</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Requests List */}
            <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-black italic tracking-tighter text-gray-900">Demandes Récentes</h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{requests.filter(r => r.status === 'pending').length} En attente d'approbation</p>
                    </div>
                </div>
                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Accès Cloud RH...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-20">
                            <AlertCircle className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold italic tracking-tighter">Aucune demande détectée</p>
                        </div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="hidden sm:flex flex-col items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 min-w-[80px]">
                                        <span className="text-2xl font-black italic text-gray-900 leading-none">{req.days}</span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Jours</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="font-black italic text-gray-900 text-lg">{req.employee}</h4>
                                            <Badge variant="outline" className="border-gray-200 text-gray-500 font-bold text-[10px] uppercase tracking-widest bg-white">
                                                {req.department}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-5 text-xs">
                                            <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                                                <AlertCircle className="w-3.5 h-3.5 text-gray-400" />
                                                {req.type}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500 font-bold">
                                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                                {new Date(req.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} 
                                                <span className="text-gray-300 mx-1">→</span> 
                                                {new Date(req.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 lg:gap-6">
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2">
                                            <StatusIcon status={req.status} />
                                            <Badge className={getStatusStyle(req.status)}>
                                                {req.status === 'approved' ? 'Approuvé' : req.status === 'pending' ? 'En Attente' : 'Refusé'}
                                            </Badge>
                                        </div>
                                        {req.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleUpdateStatus(req.id, 'approved')}
                                                    className="text-[10px] font-black uppercase tracking-widest text-[#222222] hover:text-emerald-600 transition-colors underline decoration-2 underline-offset-4"
                                                >
                                                    Approuver
                                                </button>
                                                <span className="text-gray-300">•</span>
                                                <button 
                                                    onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                                    className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500 transition-colors"
                                                >
                                                    Refuser
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button aria-label="Voir les détails" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-primary hover:text-white text-gray-400 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                    <button className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-widest">
                        Voir tout l'historique
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default LeaveManagement;
