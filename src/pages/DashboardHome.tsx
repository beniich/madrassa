import KPICards from "@/components/dashboard/KPICards";
import AIAlertsSection from "@/components/dashboard/AIAlertsSection";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { generateOfflineAlerts } from "@/hooks/useOfflineData";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const DashboardHome = () => {
    const { user } = useAuth();

    const handleGenerateOfflineAlerts = async () => {
        try {
            const alerts = await generateOfflineAlerts();
            toast.success(`${alerts.length} nouvelles alertes IA générées localement !`);
        } catch (error) {
            toast.error("Erreur lors de la génération des alertes.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {user?.role === 'direction' ? 'Tableau de Bord Direction' :
                            user?.role === 'teacher' ? 'Espace Enseignant' :
                                user?.role === 'parent' ? 'Espace Parent' : 'Tableau de Bord'}
                    </h1>
                    <p className="text-muted-foreground">
                        Vue d'ensemble de votre établissement • {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        onClick={handleGenerateOfflineAlerts}
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/30 hover:bg-primary/5"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <Sparkles className="h-4 w-4 text-primary" />
                        Scanner anomalies (IA Offline)
                    </Button>
                </div>
            </div>

            {/* Role-Specific Content */}
            {user?.role === 'parent' ? (
                <div className="grid grid-cols-1 gap-6">
                    <KPICards />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RecentActivity />
                        <AIAlertsSection />
                    </div>
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <KPICards />

                    {/* Quick Actions */}
                    <QuickActions />

                    {/* AI Alerts & Recommendations */}
                    <AIAlertsSection />

                    {/* Charts */}
                    <DashboardCharts />

                    {/* Recent Activity */}
                    <RecentActivity />
                </>
            )}
        </div>
    );
};

export default DashboardHome;
