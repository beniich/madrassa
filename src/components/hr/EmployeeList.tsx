import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, Trash2, Mail, Phone, Calendar, Briefcase, MapPin, X, ChevronRight, User, Loader2, FileText } from 'lucide-react';
import { hrService, HRMember } from '@/services/hrService';
import { toast } from 'sonner';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'onLeave';
    joinDate: string;
    avatar?: string;
    address?: string;
    contractType?: string;
}

// Données mockées étendues
export const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<HRMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState<HRMember | null>(null);

    React.useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        setIsLoading(true);
        try {
            const data = await hrService.getHRMembers();
            setEmployees(data);
        } catch (error) {
            toast.error("Error lors du chargement du staff");
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrage des données
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = filterDepartment === 'all' || emp.subject === filterDepartment;
            const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [employees, searchTerm, filterDepartment, filterStatus]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black italic tracking-widest text-[10px] uppercase';
            case 'inactive': return 'bg-gray-100 text-gray-500 border-none px-3 py-1 font-black italic tracking-widest text-[10px] uppercase';
            case 'onLeave': return 'bg-primary/10 text-primary border-none px-3 py-1 font-black italic tracking-widest text-[10px] uppercase';
            default: return 'bg-gray-100 text-gray-500 border-none px-3 py-1 font-black italic tracking-widest text-[10px] uppercase';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'inactive': return 'Inactif';
            case 'onLeave': return 'En congé';
            default: return 'Inconnu';
        }
    };

    return (
        <div className="flex h-[calc(100vh-14rem)] bg-gray-50/30 rounded-3xl overflow-hidden border border-gray-100 relative">
            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedEmployee ? 'w-2/3 border-r border-gray-100' : 'w-full'}`}>
                
                {/* Filters Header */}
                <div className="p-6 bg-white border-b border-gray-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black italic tracking-tight text-gray-900">Annuaire Staff</h2>
                        <Button className="bg-[#222222] hover:bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 transition-all active:scale-95">
                            <Plus className="w-4 h-4 mr-2" /> New Profile
                        </Button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-2 rounded-2xl">
                        <div className="relative flex-1 w-full group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Recherche par nom ou matricule..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 border-none bg-transparent shadow-none h-10 font-bold focus-visible:ring-0 placeholder:text-gray-400"
                            />
                        </div>
                        <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                                <SelectTrigger className="w-full md:w-[180px] border-none bg-white font-bold h-10 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Département" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous Départements</SelectItem>
                                    <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                                    <SelectItem value="Français">Français</SelectItem>
                                    <SelectItem value="Sciences">Sciences</SelectItem>
                                    <SelectItem value="Informatique">Informatique</SelectItem>
                                    <SelectItem value="Administration">Administration</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full md:w-[140px] border-none bg-white font-bold h-10 rounded-xl shadow-sm">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous Statuts</SelectItem>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                    <SelectItem value="onLeave">En congé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* List View */}
                <div className="flex-1 overflow-auto p-6 space-y-3">
                    {filteredEmployees.length === 0 ? (
                        <div className="text-center py-20">
                            <User className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">Aucun employé ne correspond à vos critères.</p>
                        </div>
                    ) : (
                        filteredEmployees.map((emp) => (
                            <div 
                                key={emp.id}
                                onClick={() => setSelectedEmployee(emp)}
                                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                                    selectedEmployee?.id === emp.id 
                                    ? 'bg-primary/5 border-primary shadow-md' 
                                    : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-gray-100 hover:-translate-y-0.5'
                                }`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 shadow-inner ${
                                        selectedEmployee?.id === emp.id ? 'bg-primary text-[#222222]' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {emp.photo || emp.firstName.charAt(0) + emp.lastName.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-black italic text-gray-900 truncate">{emp.firstName} {emp.lastName}</h3>
                                            <Badge className={getStatusStyle(emp.status)}>{getStatusLabel(emp.status)}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 truncate mt-0.5">
                                            <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-gray-300" /> {emp.subject}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden lg:flex items-center gap-8 mr-8">
                                    <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-300" />
                                        {emp.email}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-2">
                                     <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                        selectedEmployee?.id === emp.id ? 'bg-[#222222] text-white' : 'bg-gray-50 group-hover:bg-primary group-hover:text-white text-gray-300'
                                     }`}>
                                        <ChevronRight className="w-4 h-4" />
                                     </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Slide-over Detail Panel */}
            {selectedEmployee && (
                <div className="w-1/3 bg-white flex flex-col border-l border-gray-100 animate-in slide-in-from-right-8 duration-300 min-w-[320px]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#222222] text-white">
                        <h3 className="font-black italic tracking-tight">Fiche Collaborateur</h3>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setSelectedEmployee(null)}
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-auto p-8">
                        <div className="text-center mb-10">
                            <div className="w-24 h-24 mx-auto bg-primary rounded-[2rem] flex items-center justify-center font-black text-4xl text-[#222222] shadow-[0_0_30px_rgba(255,205,0,0.3)] mb-6 -rotate-3 transition-transform hover:rotate-0">
                                {selectedEmployee.photo || selectedEmployee.firstName.charAt(0) + selectedEmployee.lastName.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black italic tracking-tighter text-gray-900 leading-none mb-2">{selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
                            <p className="text-primary font-black uppercase text-[10px] tracking-widest">{selectedEmployee.subject}</p>
                            <div className="mt-4 flex justify-center">
                                <Badge className={getStatusStyle(selectedEmployee.status)}>{getStatusLabel(selectedEmployee.status)}</Badge>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Informations Contact</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Mail className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Email Pro</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedEmployee.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Phone className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Téléphone</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedEmployee.phone}</p>
                                        </div>
                                    </div>
                                    {selectedEmployee.address && (
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <MapPin className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Adresse</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedEmployee.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-2 mt-8">Profile Professionnel</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                                            <Briefcase className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Matière / Rôle</p>
                                            <p className="text-sm font-bold text-gray-900">{selectedEmployee.subject}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                                            <Calendar className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Date d'embauche</p>
                                            <p className="text-sm font-bold text-gray-900">
                                                {new Date(selectedEmployee.hireDate).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    {selectedEmployee.contractType && (
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                                                <FileText className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Type Contrat</p>
                                                <p className="text-sm font-bold text-gray-900">{selectedEmployee.contractType}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Panel */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                        <Button className="flex-1 bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 rounded-xl shadow-sm font-black text-[10px] uppercase tracking-widest">
                            <Edit className="w-4 h-4 mr-2" /> Éditer
                        </Button>
                        <Button className="w-12 h-10 bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-100 rounded-xl shadow-sm p-0 flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;
