import { DashboardLayout } from "@/components/DashboardLayout";
import { DepartmentGrid } from "@/components/hospital/DepartmentGrid";
import { mockDepartments, mockHospitalBeds } from "@/lib/mockData";
import { BedDouble, Filter, RefreshCw } from "lucide-react";
import { ServiceManager } from "@/components/hospital/ServiceManager";
import { BedManager } from "@/components/hospital/BedManager";
import { Button } from "@/components/ui-1cc/button";
import { useState } from "react";
import { toast } from "sonner";

const BedManagementPage = () => {
    const [stats] = useState({
        total: mockHospitalBeds.length,
        occupied: mockHospitalBeds.filter(b => b.status === 'occupied').length,
        available: mockHospitalBeds.filter(b => b.status === 'available').length,
        cleaning: mockHospitalBeds.filter(b => b.status === 'cleaning').length,
    });

    const handleBedClick = (bedId: string) => {
        toast.info(`Lit ${bedId} sélectionné`, {
            description: "Détails du patient en cours de chargement..."
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Plan des Services & Lits
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Vue en temps réel de l'occupation hospitalière.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <ServiceManager />
                        <BedManager />
                        <Button variant="secondary" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                            <Filter className="h-4 w-4" />
                            Filtrer
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Lits', value: stats.total, color: 'text-foreground' },
                        { label: 'Occupés', value: stats.occupied, color: 'text-red-500' },
                        { label: 'Disponibles', value: stats.available, color: 'text-green-500' },
                        { label: 'Nettoyage', value: stats.cleaning, color: 'text-yellow-500' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-4 flex flex-col items-center justify-center text-center">
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Departments Grid */}
                <div className="space-y-8">
                    {mockDepartments.map((dept) => {
                        const deptBeds = mockHospitalBeds.filter(bed => bed.deptId === dept.id);
                        if (deptBeds.length === 0) return null;

                        return (
                            <DepartmentGrid
                                key={dept.id}
                                department={dept}
                                beds={deptBeds}
                                onBedClick={handleBedClick}
                            />
                        );
                    })}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BedManagementPage;
