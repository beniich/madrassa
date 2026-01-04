import DetailPane from "@/components/dashboard/DetailPane";
import { Settings } from "lucide-react";

const SettingsModule = () => {
  return (
    <DetailPane title="Configuration" subtitle="Paramètres de l'application">
      <div className="text-center text-muted-foreground py-16">
        <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Paramètres</p>
        <p className="text-sm">Les options de configuration seront affichées ici</p>
      </div>
    </DetailPane>
  );
};

export default SettingsModule;
