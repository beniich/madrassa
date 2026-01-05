import DetailPane from "@/components/dashboard/DetailPane";
import { CreditCard } from "lucide-react";

const FinanceModule = () => {
  return (
    <DetailPane title="Facturation" subtitle="Gestion financière">
      <div className="text-center text-muted-foreground py-16">
        <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Facturation</p>
        <p className="text-sm">La gestion financière sera affichée ici</p>
      </div>
    </DetailPane>
  );
};

export default FinanceModule;
