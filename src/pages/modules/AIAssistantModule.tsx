import DetailPane from "@/components/dashboard/DetailPane";
import { Bot } from "lucide-react";
import { usePaneContext } from "@/components/dashboard/OutlookLayout";
import { Button } from "@/components/ui/button";

const AIAssistantModule = () => {
  const { setIsCopilotOpen } = usePaneContext();

  return (
    <DetailPane title="Assistant IA" subtitle="Copilot SchoolGenius">
      <div className="text-center text-muted-foreground py-16">
        <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-4">Assistant IA</p>
        <p className="text-sm mb-6">Utilisez Copilot pour obtenir de l'aide</p>
        <Button onClick={() => setIsCopilotOpen(true)}>
          Ouvrir Copilot
        </Button>
      </div>
    </DetailPane>
  );
};

export default AIAssistantModule;
