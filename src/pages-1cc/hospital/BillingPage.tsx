import { DashboardLayout } from "@/components/DashboardLayout";
import { InvoiceEditor } from "@/components/finance/InvoiceEditor";

const BillingPage = () => {
    return (
        <DashboardLayout>
            <div className="space-y-6 pb-12 animate-fade-in">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Facturation & Paiements
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestion des factures patients (Éditeur Avancé)
                    </p>
                </div>

                <InvoiceEditor />
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
