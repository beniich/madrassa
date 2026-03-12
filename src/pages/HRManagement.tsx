import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, LayoutDashboard, FileText } from 'lucide-react';
import HRDashboard from '@/components/hr/HRDashboard';
import EmployeeList from '@/components/hr/EmployeeList';

const HRManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    Gestion des Ressources Humaines
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                    Gérez vos employés, les absences, les performances et plus encore
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border">
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                    </TabsTrigger>
                    <TabsTrigger value="employees" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Liste des employés
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Documents RH
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard">
                    <HRDashboard
                        stats={{
                            totalEmployees: 156,
                            activeEmployees: 148,
                            attendanceRate: 92,
                            pendingRequests: 8,
                        }}
                    />
                </TabsContent>

                <TabsContent value="employees">
                    <EmployeeList />
                </TabsContent>

                <TabsContent value="documents">
                    <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Module de documents RH à venir</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HRManagement;
