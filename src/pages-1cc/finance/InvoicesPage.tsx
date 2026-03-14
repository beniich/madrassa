import { useState } from 'react';
import { useFinanceStore, Invoice } from '@/stores/useFinanceStore';
import { Button } from '@/components/ui-1cc/button';
import { Input } from '@/components/ui-1cc/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui-1cc/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui-1cc/dropdown-menu';
import { Plus, Search, MoreHorizontal, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui-1cc/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useNavigate } from 'react-router-dom';

export const InvoicesPage = () => {
    const navigate = useNavigate();
    const { invoices, deleteInvoice, markAsPaid } = useFinanceStore();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInvoices = invoices.filter(inv =>
        inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return 'Payée';
            case 'pending': return 'En attente';
            case 'overdue': return 'En retard';
            case 'draft': return 'Brouillon';
            case 'cancelled': return 'Annulée';
            default: return status;
        }
    };

    return (
        <>
            <div className="h-full flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Factures & Paiements</h1>
                        <p className="text-muted-foreground">Gérez les factures patients et le suivi des encaissements.</p>
                    </div>
                    <Button className="gap-2" onClick={() => navigate('/finance/invoices/new')}>
                        <Plus className="h-4 w-4" /> Nouvelle Facture
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par patient ou n°..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="rounded-md border bg-white dark:bg-[#191919]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Échéance</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.number}</TableCell>
                                    <TableCell>{invoice.patientName}</TableCell>
                                    <TableCell>{format(new Date(invoice.date), 'dd MMM yyyy', { locale: fr })}</TableCell>
                                    <TableCell>{format(new Date(invoice.dueDate), 'dd MMM yyyy', { locale: fr })}</TableCell>
                                    <TableCell>{invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`border-0 ${getStatusColor(invoice.status)}`}>
                                            {getStatusLabel(invoice.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" /> Voir / Modifier
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" /> Télécharger PDF
                                                </DropdownMenuItem>
                                                {invoice.status !== 'paid' && (
                                                    <DropdownMenuItem onClick={() => markAsPaid(invoice.id)}>
                                                        <span className="text-green-600 flex items-center">Marquer comme payée</span>
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem onClick={() => deleteInvoice(invoice.id)} className="text-red-600">
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};
