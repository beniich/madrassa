import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    trend?: string;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600">{title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-600">{trend}</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

interface ProfileStatsProps {
    stats?: {
        coursesCompleted?: number;
        totalCourses?: number;
        averageGrade?: number;
        attendanceRate?: number;
        projectsCompleted?: number;
    };
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats = {} }) => {
    const {
        coursesCompleted = 12,
        totalCourses = 18,
        averageGrade = 85,
        attendanceRate = 95,
        projectsCompleted = 24,
    } = stats;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
                <p className="text-gray-600 mt-1">Vue d'ensemble de vos performances</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Cours complétés"
                    value={`${coursesCompleted}/${totalCourses}`}
                    icon={Users}
                    trend="+12% ce mois"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Moyenne générale"
                    value={`${averageGrade}%`}
                    icon={Award}
                    trend="+5% ce trimestre"
                    color="bg-gradient-to-br from-green-500 to-green-600"
                />
                <StatCard
                    title="Taux de présence"
                    value={`${attendanceRate}%`}
                    icon={Clock}
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                />
                <StatCard
                    title="Projets terminés"
                    value={projectsCompleted}
                    icon={TrendingUp}
                    trend="+8 ce mois"
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                />
            </div>
        </div>
    );
};

export default ProfileStats;
