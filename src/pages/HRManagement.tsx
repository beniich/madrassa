import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, LayoutDashboard, FileText, CalendarCheck } from 'lucide-react';
import HRDashboard from '@/components/hr/HRDashboard';
import EmployeeList from '@/components/hr/EmployeeList';
import LeaveManagement from '@/components/hr/LeaveManagement';

const HRManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 flex items-center gap-3">
                    <Users className="w-8 h-8 text-primary" />
                    Gestion des Ressources Humaines
                </h1>
                <p className="text-gray-400 font-bold mt-1 text-sm uppercase tracking-widest">
                    Gérez vos employés, les absences et les performances
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border border-gray-100 rounded-2xl p-1 h-auto flex flex-wrap gap-1 shadow-sm w-fit">
                    <TabsTrigger value="dashboard" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-10 px-5 font-black text-xs uppercase tracking-widest">
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                    </TabsTrigger>
                    <TabsTrigger value="employees" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-10 px-5 font-black text-xs uppercase tracking-widest">
                        <Users className="w-4 h-4" />
                        Staff
                    </TabsTrigger>
                    <TabsTrigger value="absences" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-10 px-5 font-black text-xs uppercase tracking-widest">
                        <CalendarCheck className="w-4 h-4" />
                        Congés & Absences
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-[#222222] data-[state=active]:text-white data-[state=active]:shadow-xl transition-all h-10 px-5 font-black text-xs uppercase tracking-widest">
                        <FileText className="w-4 h-4" />
                        Documents
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="mt-6 outline-none focus-visible:ring-0">
                    <HRDashboard
                        stats={{
                            totalEmployees: 156,
                            activeEmployees: 148,
                            attendanceRate: 92,
                            pendingRequests: 8,
                        }}
                    />
                </TabsContent>

                <TabsContent value="employees" className="mt-6 outline-none focus-visible:ring-0">
                    <EmployeeList />
                </TabsContent>

                <TabsContent value="absences" className="mt-6 outline-none focus-visible:ring-0">
                    <LeaveManagement />
                </TabsContent>

                <TabsContent value="documents" className="mt-6 outline-none focus-visible:ring-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                        <div className="w-24 h-24 mx-auto bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-black italic tracking-tighter text-gray-900 mb-2">Module en développement</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Gestion documentaire RH à venir</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HRManagement;

