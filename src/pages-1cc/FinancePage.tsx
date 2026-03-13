
import { DashboardLayout } from "@/components/DashboardLayout";
import { MultiTenantHeader } from "@/components/MultiTenantHeader";
import { WalletCard } from "@/components/finance/WalletCard";
import { TransactionHistory } from "@/components/finance/TransactionHistory";
import { CustomerKYC } from "@/components/finance/CustomerKYC";

const FinancePage = () => {
    return (
        <DashboardLayout>
            <div className="flex flex-col min-h-screen bg-background/50">
                <MultiTenantHeader />

                <div className="p-6 md:p-8 space-y-8 flex-1 max-w-[1600px] mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Finance & Conformité</h1>
                            <p className="text-muted-foreground">Gestion sécurisée des fonds, paiements et identité.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Section Principale (Wallet & Transactions) - 8/12 */}
                        <div className="lg:col-span-8 space-y-8">
                            <WalletCard />
                            <TransactionHistory />
                        </div>

                        {/* Section Latérale (KYC & Identité) - 4/12 */}
                        <div className="lg:col-span-4 space-y-8">
                            <CustomerKYC />

                            {/* Placeholder pour futures intégrations (Stripe/Lemonway) */}
                            <div className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground">
                                <span className="text-sm font-medium">Méthodes de Paiement</span>
                                <span className="text-xs">Gérez vos cartes et comptes bancaires</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FinancePage;
