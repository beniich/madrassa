import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, LayoutDashboard, FileText, CalendarCheck } from 'lucide-react';
import HRDashboard from '@/components/hr/HRDashboard';
import EmployeeList from '@/components/hr/EmployeeList';
import LeaveManagement from '@/components/hr/LeaveManagement';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Search, 
    Plus, 
    MoreVertical, 
    Folder, 
    File, 
    Download, 
    Trash2, 
    Share2, 
    Filter,
    ArrowUpDown
} from 'lucide-react';

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
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Rechercher un document..." className="pl-10 rounded-xl bg-white border-gray-200" />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button variant="outline" className="rounded-xl border-gray-200 bg-white gap-2 font-black text-[10px] uppercase tracking-widest h-10 px-4">
                                    <Filter className="w-3.5 h-3.5" />
                                    Filtrer
                                </Button>
                                <Button className="rounded-xl bg-[#222222] text-white hover:bg-black gap-2 font-black text-[10px] uppercase tracking-widest h-10 px-4 shadow-xl shadow-gray-200">
                                    <Plus className="w-3.5 h-3.5" />
                                    Nouveau
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { name: "Contrats de travail", count: 142, icon: Folder, color: "text-blue-500", bg: "bg-blue-50" },
                                { name: "Bulletins de paie", count: 865, icon: Folder, color: "text-amber-500", bg: "bg-amber-50" },
                                { name: "Certificats médicaux", count: 28, icon: Folder, color: "text-red-500", bg: "bg-red-50" },
                                { name: "Formations & Diplômes", count: 94, icon: Folder, color: "text-emerald-500", bg: "bg-emerald-50" },
                            ].map((folder, idx) => (
                                <Card key={idx} className="border-gray-100 hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group rounded-2xl">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={`w-12 h-12 ${folder.bg} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                            <folder.icon className={`w-6 h-6 ${folder.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-black italic text-sm tracking-tighter">{folder.name}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{folder.count} fichiers</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Card className="border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                            <CardHeader className="bg-gray-50/50 flex flex-row items-center justify-between py-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-black italic tracking-tighter uppercase">Documents Récents</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Aperçu des 10 derniers fichiers</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" className="font-black text-[10px] uppercase tracking-widest text-primary">
                                    Voir tout
                                    <ArrowUpDown className="ml-2 w-3 h-3" />
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                            <tr>
                                                <th className="px-6 py-4">Nom du fichier</th>
                                                <th className="px-6 py-4">Propriétaire</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4">Taille</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {[
                                                { name: "Contrat_Ahmed_Benali.pdf", owner: "Ahmed Benali", date: "Il y a 2h", size: "1.2 MB" },
                                                { name: "Bulletin_Mars_2026.pdf", owner: "Système", date: "Aujourd'hui", size: "450 KB" },
                                                { name: "Certificat_Medical_Sophie.jpg", owner: "Sophie Martin", date: "Hier", size: "2.8 MB" },
                                                { name: "Diplome_Master_Youssef.pdf", owner: "Youssef Alaoui", date: "10 Mars 2026", size: "5.4 MB" },
                                                { name: "Reglement_Interieur_V2.pdf", owner: "Direction", date: "08 Mars 2026", size: "860 KB" },
                                            ].map((file, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                <File className="w-4 h-4 text-gray-500" />
                                                            </div>
                                                            <span className="text-sm font-black italic tracking-tighter text-gray-700">{file.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-black italic text-indigo-600">
                                                                {file.owner.charAt(0)}
                                                            </div>
                                                            <span className="text-xs font-bold text-gray-500">{file.owner}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">{file.date}</td>
                                                    <td className="px-6 py-4 text-xs font-bold text-gray-400">{file.size}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-primary">
                                                                <Download className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-primary">
                                                                <Share2 className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="w-8 h-8 text-gray-400 hover:text-red-500">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HRManagement;

