import DetailPane from "@/components/dashboard/DetailPane";
import { FileText } from "lucide-react";

const ExamsModule = () => {
  return (
    <DetailPane title="Examens & Notes" subtitle="Trimestre 1 - 2024-2025">
      <div className="text-center text-muted-foreground py-16">
        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Gestion des notes</p>
        <p className="text-sm">Les examens et notes seront affichés ici</p>
      </div>
    </DetailPane>
  );
};

export default ExamsModule;
