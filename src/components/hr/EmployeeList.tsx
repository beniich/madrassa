import React, { useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive' | 'onLeave';
    joinDate: string;
}

// Données mockées
const mockEmployees: Employee[] = [
    { id: '1', name: 'Ahmed Benali', role: 'Enseignant Principal', department: 'Mathématiques', email: 'ahmed@school.com', phone: '+212 6 12 34 56 78', status: 'active', joinDate: '2023-01-15' },
    { id: '2', name: 'Fatima Zahra', role: 'Professeur', department: 'Français', email: 'fatima@school.com', phone: '+212 6 23 45 67 89', status: 'active', joinDate: '2022-09-01' },
    { id: '3', name: 'Youssef Alami', role: 'Directeur Adjoint', department: 'Administration', email: 'youssef@school.com', phone: '+212 6 34 56 78 90', status: 'active', joinDate: '2021-03-20' },
    { id: '4', name: 'Samira Idrissi', role: 'Enseignante', department: 'Sciences', email: 'samira@school.com', phone: '+212 6 45 67 89 01', status: 'onLeave', joinDate: '2023-06-10' },
    { id: '5', name: 'Karim Bennani', role: 'Enseignant', department: 'Informatique', email: 'karim@school.com', phone: '+212 6 56 78 90 12', status: 'active', joinDate: '2022-11-05' },
];

export const EmployeeList: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filtrage des données
    const filteredEmployees = useMemo(() => {
        return mockEmployees.filter((emp) => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
            const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
            return matchesSearch && matchesDepartment && matchesStatus;
        });
    }, [searchTerm, filterDepartment, filterStatus]);

    const StatusBadge = ({ status }: { status: string }) => {
        const variants: Record<string, { label: string; className: string }> = {
            active: { label: 'Actif', className: 'bg-green-100 text-green-700 border-green-200' },
            inactive: { label: 'Inactif', className: 'bg-gray-100 text-gray-700 border-gray-200' },
            onLeave: { label: 'En congé', className: 'bg-orange-100 text-orange-700 border-orange-200' },
        };
        const { label, className } = variants[status] || variants.active;
        return <Badge variant="outline" className={className}>{label}</Badge>;
    };

    const columnDefs = [
        { field: 'name', headerName: 'Nom', flex: 1, minWidth: 150 },
        { field: 'role', headerName: 'Rôle', flex: 1, minWidth: 150 },
        { field: 'department', headerName: 'Département', flex: 1, minWidth: 120 },
        { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
        { field: 'phone', headerName: 'Téléphone', flex: 1, minWidth: 150 },
        {
            field: 'status',
            headerName: 'Statut',
            flex: 0.5,
            minWidth: 120,
            cellRenderer: (params: any) => <StatusBadge status={params.value} />
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.8,
            minWidth: 180,
            cellRenderer: (params: any) => (
                <div className="flex gap-2 items-center h-full">
                    <Button size="sm" variant="outline" onClick={() => navigate('/profile')}>
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Rechercher par nom ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-3">
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Département" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les départements</SelectItem>
                            <SelectItem value="Mathématiques">Mathématiques</SelectItem>
                            <SelectItem value="Français">Français</SelectItem>
                            <SelectItem value="Sciences">Sciences</SelectItem>
                            <SelectItem value="Informatique">Informatique</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="onLeave">En congé</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvel employé
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="ag-theme-alpine h-[600px] w-full rounded-lg border bg-white">
                <AgGridReact
                    rowData={filteredEmployees}
                    columnDefs={columnDefs}
                    defaultColDef={{
                        sortable: true,
                        filter: false,
                        resizable: true,
                    }}
                    pagination={true}
                    paginationPageSize={10}
                    domLayout="normal"
                />
            </div>
        </div>
    );
};

export default EmployeeList;
