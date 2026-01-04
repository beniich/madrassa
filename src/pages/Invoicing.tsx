import { useState } from "react";
import { useInvoices } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    AlertTriangle,
    Plus,
    Download,
    Search,
    Users,
    Loader2,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvoicingPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const invoices = useInvoices();

    const stats = [
        { title: "Chiffre d'affaires", value: "145,000 DH", icon: DollarSign, trend: "+12%", trendUp: true, color: "text-blue-600" },
        { title: "Paiements en attente", value: "24,500 DH", icon: AlertTriangle, trend: "-5%", trendUp: false, color: "text-amber-600" },
        { title: "Taux de recouvrement", value: "92%", icon: TrendingUp, trend: "+3%", trendUp: true, color: "text-green-600" },
    ];

    const filteredInvoices = invoices?.filter(inv =>
        selectedStatus === 'all' ? true : inv.status === selectedStatus
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Facturation et Paiements</h1>
                    <p className="text-muted-foreground">Suivi financier et encaissement des frais de scolarité</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Receipt className="h-4 w-4" />
                        Rapports
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        Nouvelle Facture
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 relative overflow-hidden group hover:shadow-xl transition-all border-primary/5">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-xl bg-gray-50 flex items-center justify-center", stat.color)}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <Badge variant="outline" className={cn(
                                "text-[10px] gap-1 px-1.5",
                                stat.trendUp ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50"
                            )}>
                                {stat.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend}
                            </Badge>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                        <div className="absolute bottom-0 right-0 p-1 opacity-5">
                            <stat.icon className="h-16 w-16" />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Rechercher par étudiant ou N° facture..." className="pl-10" />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="paid">Payé</SelectItem>
                        <SelectItem value="unpaid">En attente</SelectItem>
                        <SelectItem value="overdue">En retard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b">
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Facture</th>
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Étudiant</th>
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Montant</th>
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider">Statut</th>
                                <th className="p-4 text-xs font-bold uppercase text-muted-foreground tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {invoices === undefined ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td>
                                </tr>
                            ) : filteredInvoices?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">Aucune facture enregistrée pour cette sélection.</td>
                                </tr>
                            ) : (
                                filteredInvoices?.map((inv) => (
                                    <tr key={inv.localId} className="hover:bg-muted/30 transition-colors group">
                                        <td className="p-4 font-bold text-sm">#{inv.localId.substring(6, 12).toUpperCase()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <span className="text-sm font-medium">{inv.studentId}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-sm">{inv.amount} DH</td>
                                        <td className="p-4">
                                            <Badge variant={
                                                inv.status === 'paid' ? 'default' :
                                                    inv.status === 'unpaid' ? 'secondary' : 'destructive'
                                            } className={cn(
                                                inv.status === 'paid' && "bg-green-500 hover:bg-green-600",
                                                "capitalize"
                                            )}>
                                                {inv.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 border-blue-500/20 bg-blue-50/10">
                    <h4 className="font-bold flex items-center gap-2 mb-4">
                        <CreditCard className="h-5 w-5 text-blue-500" /> Mode de Paiement Local
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        Pour les zones avec connectivité limitée, vous pouvez enregistrer les paiements en espèces ou chèque localement.
                        Ils seront synchronisés avec le CRM principal dès qu'une connexion est établie.
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">Paiement Espèces</Button>
                        <Button size="sm" variant="outline" className="flex-1">Paiement Chèque</Button>
                    </div>
                </Card>

                <Card className="p-5 border-amber-500/20 bg-amber-50/10">
                    <h4 className="font-bold flex items-center gap-2 mb-4 text-amber-600">
                        <AlertTriangle className="h-5 w-5" /> Retards Détectés (IA)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        L'IA a identifié 3 familles ayant un historique de retard. Souhaitez-vous envoyer un rappel automatique par SMS ?
                    </p>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 w-full shadow-lg shadow-amber-600/20">Envoyer les Rappels</Button>
                </Card>
            </div>
        </div>
    );
};

export default InvoicingPage;

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
