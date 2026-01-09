import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, UserCheck, AlertCircle } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {trend}
                            </p>
                        )}
                    </div>
                    <div className={`p-4 rounded-2xl ${color}`}>
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

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
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Tableau de bord RH</h2>
                <p className="text-gray-600 mt-1">Vue d'ensemble des ressources humaines</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Employés"
                    value={totalEmployees}
                    icon={Users}
                    trend="+12 ce mois"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <KPICard
                    title="Employés Actifs"
                    value={activeEmployees}
                    icon={UserCheck}
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <KPICard
                    title="Taux de Présence"
                    value={`${attendanceRate}%`}
                    icon={TrendingUp}
                    trend="+3% vs mois dernier"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <KPICard
                    title="Demandes en attente"
                    value={pendingRequests}
                    icon={AlertCircle}
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>
        </div>
    );
};

export default HRDashboard;
