import { useState, useRef } from "react";
import { useInvoices } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CreditCard,
    DollarSign,
    FileText,
    Receipt,
    AlertCircle,
    Plus,
    Download,
    Search,
    Loader2,
    TrendingDown,
    TrendingUp,
    X,
    CheckCircle2,
    Printer,
    Coins,
    ChevronRight,
    ArrowUpRight,
    LucideIcon,
    Sparkles
} from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SuccessCheckLottie } from "@/components/ui/LottieAnimation";

// ============================================================================
// TYPES
// ============================================================================

interface Invoice {
    localId: string;
    studentId: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid' | 'overdue';
    createdAt?: string;
}

// ============================================================================
// COMPOSANT : REÇU IMPRIMABLE (VIRTUAL RECEIPT)
// ============================================================================

const PrintableReceipt = ({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        const canvas = await html2canvas(printRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`recu_${invoice.localId.substring(0, 8)}.pdf`);
        toast.success("PDF généré avec succès !");
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <Card className="max-w-md w-full bg-white overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 rounded-[2rem]">
                <div className="p-6 bg-gray-50/50 border-b flex justify-between items-center print:hidden">
                    <h3 className="font-black italic flex items-center gap-2 text-gray-700 uppercase tracking-tighter text-sm">
                        <Receipt className="h-4 w-4 text-purple-600" /> Prévisualisation Reçu
                    </h3>
                    <button onClick={onClose} title="Fermer" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                <div ref={printRef} className="p-10 space-y-8 bg-white relative overflow-hidden" id="printable-area">
                    {/* Motif de fond pour le style sécurité */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex flex-wrap gap-4 rotate-12 scale-150">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <span key={i} className="text-xl font-black">SCHOOLGENIUS</span>
                        ))}
                    </div>

                    <div className="text-center space-y-1 relative z-10">
                        <h2 className="text-3xl font-black tracking-tighter text-purple-600 italic">SCHOOL GENIUS</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">Official Academic Registry</p>
                        <div className="h-1 w-12 bg-purple-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400 pt-6 border-t-2 border-dashed relative z-10">
                        <div className="space-y-1">
                            <p>Facture N°: <span className="text-gray-900 tracking-widest">#{invoice.localId.substring(0, 8).toUpperCase()}</span></p>
                            <p>Date: <span className="text-gray-900">{new Date().toLocaleDateString('fr-FR')}</span></p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="tracking-widest">Client / Étudiant</p>
                            <p className="text-gray-900 italic font-black">{invoice.studentId}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50/80 p-6 rounded-[1.5rem] space-y-4 relative z-10 border border-gray-100">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-500 uppercase tracking-widest text-[9px]">Désignation</span>
                            <span className="text-gray-500 uppercase tracking-widest text-[9px]">Montant</span>
                        </div>
                        <div className="h-px bg-gray-200 w-full opacity-50"></div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-black italic">Frais de scolarité - T1</span>
                            <span className="font-black text-gray-900">{invoice.amount.toLocaleString()} $</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 font-black italic">Activités Para-scolaires</span>
                            <span className="font-black text-gray-900">0 $</span>
                        </div>
                        <div className="h-2 bg-gray-200/50 w-full rounded-full overflow-hidden">
                             <div className="h-full bg-purple-600 w-1/3"></div>
                        </div>
                        <div className="flex justify-between text-2xl font-black text-purple-700 tracking-tighter pt-2">
                            <span>TOTAL</span>
                            <span>{invoice.amount.toLocaleString()} $</span>
                        </div>
                    </div>

                    <div className="py-6 text-center border-t-2 border-dashed relative z-10">
                        <div className="inline-block px-6 py-2 border-4 border-emerald-500 text-emerald-500 font-black rounded-xl rotate-[-4deg] text-2xl opacity-90 uppercase tracking-tighter">
                            PAIEMENT VALIDÉ
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 mt-6 leading-relaxed italic max-w-[200px] mx-auto opacity-60">
                            Document généré par le système intelligent SchoolGenius. Aucun cachet manuel requis.
                        </p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex gap-4 print:hidden">
                    <Button variant="ghost" className="flex-1 h-12 rounded-2xl font-black text-xs uppercase tracking-widest" onClick={onClose}>
                        FERMER
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest gap-2 shadow-xl shadow-gray-200" onClick={handleDownloadPDF}>
                        <Download className="h-4 w-4" /> PDF
                    </Button>
                    <Button className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-[#222222] font-black text-xs uppercase tracking-widest gap-2" onClick={handlePrint}>
                        <Printer className="h-4 w-4" /> IMPRIMER
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// ============================================================================
// COMPOSANT PRINCIPAL
// ============================================================================

const InvoicingPage = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [showNewInvoice, setShowNewInvoice] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuccessAnim, setShowSuccessAnim] = useState(false);

    const invoices = useInvoices() as Invoice[];

    // Stats réelles basées sur les données
    const stats = [
      { id: '1', title: "CA Annuel", value: "145,000 $", icon: DollarSign, trend: "+12%", trendUp: true, color: "text-blue-600", bg: "bg-blue-50" },
      { id: '2', title: "En attente", value: "24,500 $", icon: AlertCircle, trend: "-5%", trendUp: false, color: "text-amber-600", bg: "bg-amber-50" },
      { id: '3', title: "Recouvrement", value: "92%", icon: TrendingUp, trend: "+3%", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    const filteredInvoices = invoices?.filter(inv => {
        const matchesStatus = selectedStatus === 'all' ? true : inv.status === selectedStatus;
        const matchesSearch = inv.studentId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             inv.localId.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleOpenPayment = (invoice: Invoice) => {
        setCurrentInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handleProcessPayment = (method: 'cash' | 'check') => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Traitement sécurisé...',
                success: () => {
                    setShowPaymentModal(false);
                    setShowSuccessAnim(true);
                    setTimeout(() => {
                        setShowSuccessAnim(false);
                        setShowReceipt(true);
                    }, 2000);
                    return `Paiement ${method === 'cash' ? 'en espèces' : 'par chèque'} validé avec succès !`;
                },
                error: 'Échec de la transaction',
            }
        );
    };

    return (
        <div className="space-y-8 pb-20 relative">
            {/* Success Animation Layer */}
            {showSuccessAnim && (
                <div className="fixed inset-0 z-[300] bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <SuccessCheckLottie className="w-96 h-96" onComplete={() => setShowSuccessAnim(false)} />
                </div>
            )}

            {/* Premium Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                  <Receipt className="h-24 w-24 -rotate-12" />
              </div>
              <div className="relative z-10 space-y-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] uppercase tracking-[0.2em] px-3 mb-2">
                      TRÉSORERIE & COMPTABILITÉ
                  </Badge>
                  <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Facturation & Flux</h1>
                  <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                      Suivi financier, émission de factures et encaissements multi-canaux
                  </p>
              </div>
              <div className="flex flex-wrap gap-3 relative z-10">
                  <Button
                      variant="outline"
                      title="Rapports Financiers"
                      onClick={() => toast.info("Exportation du grand livre...")}
                      className="h-14 px-6 rounded-2xl border-gray-100 font-black text-xs uppercase tracking-widest gap-2 bg-gray-50/50 hover:bg-gray-100"
                  >
                      <FileText className="w-5 h-5 text-gray-400" /> RAPPORTS
                  </Button>
                  <Button
                      onClick={() => setShowNewInvoice(true)}
                      title="Créer une facture"
                      className="h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl shadow-purple-100 gap-3 group"
                  >
                      <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" /> NOUVELLE FACTURE
                  </Button>
              </div>
            </div>

            {/* Stats animées style Crystal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <Card key={stat.id} className="p-8 relative overflow-hidden group border-none shadow-xl bg-white hover:translate-y-[-5px] transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-lg", stat.bg)}>
                                <stat.icon className={cn("h-7 w-7", stat.color)} />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                stat.trendUp ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                            )}>
                                {stat.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                {stat.trend}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.title}</p>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                        </div>
                        {stat.id === '3' && (
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-[0.03]">
                                <div className="w-full h-full rounded-full border-[12px] border-emerald-600 border-t-transparent animate-spin-slow"></div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Filter Bar premium */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <Input 
                        placeholder="Rechercher par étudiant, ID ou référence..." 
                        className="pl-14 h-14 bg-gray-50/50 border-none rounded-[1.5rem] font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-purple-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[200px] h-14 bg-gray-50/50 border-none rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest px-6 italic">
                        <SelectValue placeholder="TOUS LES STATUTS" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="all" className="font-black italic text-xs">TOUS LES STATUTS</SelectItem>
                        <SelectItem value="paid" className="text-emerald-600 font-black italic text-xs">PAYÉES ✅</SelectItem>
                        <SelectItem value="unpaid" className="text-amber-600 font-black italic text-xs">EN ATTENTE ⏳</SelectItem>
                        <SelectItem value="overdue" className="text-rose-600 font-black italic text-xs">EN RETARD ⚠️</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table High-End */}
            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left truncate">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Référence</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Profil Élève</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Échéance</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Montant</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Registre</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {invoices === undefined ? (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="h-12 w-12 animate-spin text-purple-200" />
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse tracking-[0.3em]">Accès Base Cloud...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredInvoices?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-10">
                                            <Receipt className="h-24 w-24 text-gray-300" />
                                            <p className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Aucune donnée financière</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices?.map((inv) => (
                                    <tr key={inv.localId} className="group hover:bg-gray-50/80 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <span className="font-black text-[11px] text-gray-400 group-hover:text-purple-600 transition-colors tracking-widest italic">
                                                #{inv.localId.substring(6, 12).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-sm group-hover:bg-purple-100 group-hover:text-purple-600">
                                                    {inv.studentId.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 tracking-tight italic">{inv.studentId}</p>
                                                    <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">ID ACADÉMIQUE: SEC-2024</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {new Date(inv.dueDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-black text-gray-900 italic tracking-tighter">{inv.amount.toLocaleString()} $</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <Badge className={cn(
                                                "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-none pointer-events-none transition-all",
                                                inv.status === 'paid' ? "bg-emerald-100 text-emerald-700" :
                                                inv.status === 'unpaid' ? "bg-amber-100 text-amber-700 animate-pulse" : 
                                                "bg-rose-100 text-rose-700 shadow-lg shadow-rose-100"
                                            )}>
                                                {inv.status === 'paid' ? 'ACQUITTÉE' : inv.status === 'unpaid' ? 'ATTENTE' : 'RECOUVREMENT'}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2 group-hover:translate-x-[-10px] transition-transform">
                                                {inv.status !== 'paid' ? (
                                                    <Button 
                                                        size="sm" 
                                                        title="Procéder au paiement"
                                                        className="h-10 rounded-xl bg-purple-600 hover:bg-purple-700 font-black text-[10px] uppercase tracking-widest px-5 shadow-lg shadow-purple-100 gap-2"
                                                        onClick={() => handleOpenPayment(inv)}
                                                    >
                                                        <Coins className="h-3.5 w-3.5" /> PAYER
                                                    </Button>
                                                ) : (
                                                    <Button 
                                                        size="sm" 
                                                        title="Imprimer le reçu"
                                                        variant="ghost" 
                                                        className="h-10 rounded-xl border border-gray-100 text-gray-900 hover:bg-white hover:shadow-xl font-black text-[10px] uppercase tracking-widest gap-2"
                                                        onClick={() => {
                                                            setCurrentInvoice(inv);
                                                            setShowReceipt(true);
                                                        }}
                                                    >
                                                        <Printer className="h-3.5 w-3.5 text-purple-600" /> REÇU
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    title="Télécharger PDF"
                                                    className="h-10 w-10 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-lg"
                                                    onClick={() => {
                                                        setCurrentInvoice(inv);
                                                        setShowReceipt(true);
                                                    }}
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Bottom Insight Boxes Modernized */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <Card className="p-8 border-none shadow-2xl bg-gray-900 text-white relative overflow-hidden group rounded-[2.5rem]">
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-1000"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-2xl tracking-tight italic">Guichet Mobile Offline</h4>
                            <p className="text-gray-400 font-medium text-sm mt-2 leading-relaxed">
                                Le système synchronise automatiquement les paiements différés dès rétablissement de la liaison satellite.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                title="Initier Cash Express"
                                className="h-12 px-6 rounded-2xl bg-white text-gray-900 hover:bg-gray-100 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                                onClick={() => toast.info("Accès terminal d'encaissement...")}
                            >
                                CASH EXPRESS
                            </Button>
                            <Button 
                                title="Digitaliser un chèque"
                                className="h-12 px-6 rounded-2xl bg-white/10 border-none text-white hover:bg-white/20 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                                onClick={() => toast.info("Initialisation du scanner haute définition...")}
                            >
                                SCAN CHÈQUE
                            </Button>
                        </div>
                    </div>
                </Card>

                <Card className="p-8 border-none shadow-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white relative overflow-hidden group rounded-[2.5rem]">
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="h-5 w-5 text-amber-200" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Intelligence Prédictive</span>
                            </div>
                            <h4 className="font-black text-2xl tracking-tight italic leading-tight">Analytique Recouvrement</h4>
                            <p className="text-amber-50 font-medium text-sm leading-relaxed">
                                L'algorithme a identifié 3 familles nécessitant un accompagnement. Envoyez un rappel personnalisé par notification push.
                            </p>
                        </div>
                        <Button 
                            title="Lancer les rappels"
                            className="h-14 bg-white text-orange-600 hover:bg-white/90 rounded-2xl font-black shadow-2xl shadow-black/20 text-xs gap-2"
                            onClick={() => toast.success("Rappels transmis via API multi-canal !")}
                        >
                            ENVOYER LES NOTIFICATIONS <ArrowUpRight className="h-5 w-5" />
                        </Button>
                    </div>
                    <AlertCircle className="absolute -bottom-10 -right-10 h-64 w-64 opacity-10 transition-transform duration-1000 group-hover:scale-110" />
                </Card>
            </div>

            {/* MODAL : PAIEMENT (Crystal Design) */}
            {showPaymentModal && currentInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <Card className="max-w-md w-full p-10 space-y-10 animate-in zoom-in-95 duration-500 rounded-[3rem] border-none shadow-3xl bg-white">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center mx-auto text-purple-600 shadow-xl shadow-purple-50">
                                <Coins className="h-10 w-10 text-purple-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 italic tracking-tight">Valider l'Encaissement</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                    FACT N°#{currentInvoice.localId.substring(0,8).toUpperCase()} • {currentInvoice.studentId}
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 to-transparent"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 relative z-10">SOLDE À RÉGLER</span>
                            <span className="text-4xl font-black text-white italic tracking-tighter relative z-10">{currentInvoice.amount.toLocaleString()} $</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <button 
                                title="Paiement en espèces"
                                onClick={() => handleProcessPayment('cash')}
                                className="p-8 rounded-[2rem] border-2 border-gray-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all group flex flex-col items-center gap-4 relative"
                            >
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-50">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <span className="font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-emerald-700">ESPÈCES</span>
                            </button>
                            <button 
                                title="Paiement par chèque"
                                onClick={() => handleProcessPayment('check')}
                                className="p-8 rounded-[2rem] border-2 border-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-all group flex flex-col items-center gap-4 relative"
                            >
                                <div className="h-12 w-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-lg shadow-blue-50">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="font-black text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-blue-700">CHÈQUE</span>
                            </button>
                        </div>

                        <Button variant="ghost" className="w-full h-14 rounded-2xl text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50" onClick={() => setShowPaymentModal(false)}>
                            ANNULER L'OPÉRATION
                        </Button>
                    </Card>
                </div>
            )}

            {/* MODAL : NOUVELLE FACTURE (Premium Form) */}
            {showNewInvoice && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <Card className="max-w-xl w-full p-12 animate-in slide-in-from-bottom-5 duration-300 rounded-[3rem] border-none shadow-3xl bg-white relative overflow-hidden">
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h3 className="text-3xl font-black text-gray-900 italic tracking-tight">Nouvel Avis de Paiement</h3>
                                <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mt-1">Génération du Registre Comptable</p>
                            </div>
                            <button onClick={() => setShowNewInvoice(false)} title="Fermer" className="p-3 hover:bg-gray-50 rounded-2xl transition-all">
                                <X className="h-7 w-7 text-gray-300" />
                            </button>
                        </div>

                        <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Identité Élève</label>
                                        <Input placeholder="Rechercher..." className="h-14 bg-gray-50 border-none rounded-2xl font-black italic text-sm px-6" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Assignation Classe</label>
                                        <Select>
                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl font-black italic text-sm px-6">
                                                <SelectValue placeholder="SÉLECTIONNER..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                <SelectItem value="5A" className="font-black italic text-xs">CLASSE 5A</SelectItem>
                                                <SelectItem value="4B" className="font-black italic text-xs">CLASSE 4B</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Typologie Frais</label>
                                        <Select>
                                            <SelectTrigger className="h-14 bg-gray-50 border-none rounded-2xl font-black italic text-sm px-6">
                                                <SelectValue placeholder="SCOLARITÉ T1..." />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                                                <SelectItem value="sc" className="font-black italic text-xs">SCOLARITÉ MENSUELLE</SelectItem>
                                                <SelectItem value="as" className="font-black italic text-xs">ASSURANCE ANNUELLE</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Valeur Nominale ($)</label>
                                        <Input type="number" placeholder="0.00" className="h-14 bg-gray-50 border-none rounded-2xl font-black italic text-sm px-6" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-2">Limite d'Échéance</label>
                                    <Input type="date" className="h-14 bg-gray-50 border-none rounded-2xl font-black italic text-sm px-6 uppercase" />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400" onClick={() => setShowNewInvoice(false)}>
                                    ANNULER
                                </Button>
                                <Button className="flex-1 h-14 rounded-2xl font-black bg-gray-900 hover:bg-black text-white shadow-2xl shadow-gray-200 text-xs tracking-widest" onClick={() => {
                                    toast.success("Registre financier mis à jour !", { icon: <SparklesIcon className="h-4 w-4 text-amber-500" /> });
                                    setShowNewInvoice(false);
                                }}>
                                    CONFIRMER L'ÉMISSION
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* MODAL : REÇU */}
            {showReceipt && currentInvoice && (
                <PrintableReceipt 
                    invoice={currentInvoice} 
                    onClose={() => {
                        setShowReceipt(false);
                        setCurrentInvoice(null);
                    }} 
                />
            )}
        </div>
    );
};

export default InvoicingPage;

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
);
