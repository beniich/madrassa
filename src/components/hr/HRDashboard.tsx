import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-1cc/card';
import { Users, TrendingUp, UserCheck, AlertCircle, PieChart, Calendar, Briefcase } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 border-none bg-white shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{title}</p>
                        <p className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">{value}</p>
                        {trend && (
                            <p className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1 uppercase">
                                <TrendingUp className="w-3 h-3" />
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-black/5`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const DEPT_DATA = [
    { name: 'Maths', value: 45 },
    { name: 'Français', value: 38 },
    { name: 'Sciences', value: 32 },
    { name: 'Admin', value: 25 },
    { name: 'Sport', value: 16 },
];

const PRESENCE_DATA = [
    { month: 'Sep', rate: 94 },
    { month: 'Oct', rate: 92 },
    { month: 'Nov', rate: 88 },
    { month: 'Déc', rate: 91 },
    { month: 'Jan', rate: 95 },
    { month: 'Fév', rate: 93 },
];

const COLORS = ['#FFCD00', '#222222', '#FACC15', '#454545', '#71717A'];

interface HRDashboardProps {
    stats?: {
        totalEmployees?: number;
        activeEmployees?: number;
        attendanceRate?: number;
        pendingRequests?: number;
    };
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ stats = {} }) => {
    const {
        totalEmployees = 156,
        activeEmployees = 148,
        attendanceRate = 92,
        pendingRequests = 8,
    } = stats;

    return (
        <div className="space-y-8 pb-10">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Effectif Total"
                    value={totalEmployees}
                    icon={Users}
                    trend="+12 Annuel"
                    color="bg-[#222222]"
                />
                <KPICard
                    title="Taux d'Activité"
                    value={`${((activeEmployees / totalEmployees) * 100).toFixed(1)}%`}
                    icon={UserCheck}
                    color="bg-primary"
                />
                <KPICard
                    title="Présentéisme"
                    value={`${attendanceRate}%`}
                    icon={TrendingUp}
                    trend="+3% ce mois"
                    color="bg-primary"
                />
                <KPICard
                    title="Alertes RH"
                    value={pendingRequests}
                    icon={AlertCircle}
                    color="bg-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Analytics */}
                <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl p-8 bg-white">
                    <CardHeader className="px-0 pt-0 border-b pb-6 mb-8 border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black italic tracking-tighter">Flux de Présentéisme</CardTitle>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Analyse comparative mensuelle</p>
                            </div>
                            <Briefcase className="w-5 h-5 text-gray-300" />
                        </div>
                    </CardHeader>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={PRESENCE_DATA}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }} 
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255, 205, 0, 0.1)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'black' }}
                                />
                                <Bar dataKey="rate" fill="#FFCD00" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Distribution */}
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-[#222222] text-white">
                    <CardHeader className="px-0 pt-0 border-b border-white/10 pb-6 mb-8">
                        <div>
                            <CardTitle className="text-xl font-black italic tracking-tighter text-white">Répartition Staff</CardTitle>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Par Secteur Académique</p>
                        </div>
                    </CardHeader>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={DEPT_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {DEPT_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-3xl font-black italic leading-none text-primary">{totalEmployees}</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Total</span>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        {DEPT_DATA.slice(0, 3).map((dept, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">{dept.name}</span>
                                </div>
                                <span className="text-sm font-black text-white">{dept.value}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Upcoming Events Widget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-[#222222] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                        <Calendar className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter mb-6 relative z-10">Prochains Anniversaires</h3>
                    <div className="space-y-4 relative z-10">
                        {[
                            { name: 'Ahmed Benali', date: 'Demain', age: '42 ans' },
                            { name: 'Fatima Zahra', date: '21 Mar', age: '29 ans' },
                            { name: 'Youssef Alami', date: '25 Mar', age: '35 ans' },
                        ].map((event, i) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#222222] font-black text-xs">
                                        {event.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black italic">{event.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{event.age}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-primary uppercase bg-primary/20 px-3 py-1 rounded-full">{event.date}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white border border-gray-100 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                        <AlertCircle className="w-16 h-16 text-red-500" />
                    </div>
                    <h3 className="text-xl font-black italic tracking-tighter mb-6 text-gray-900 relative z-10">Fin de Contrats (30j)</h3>
                    <div className="space-y-4 relative z-10">
                        {[
                            { name: 'Karim Bennani', dept: 'Informatique', date: '15 Mar', risk: 'high' },
                            { name: 'Samira Idrissi', dept: 'Sciences', date: '28 Mar', risk: 'low' },
                        ].map((contract, i) => (
                            <div key={i} className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 hover:border-primary/50 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-10 rounded-full ${contract.risk === 'high' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                                    <div>
                                        <p className="text-sm font-black italic text-gray-900">{contract.name}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{contract.dept}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-gray-900">{contract.date}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase">Échéance</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default HRDashboard;
