import { UserPlus, FileText, Calendar, Megaphone, Bot, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const QuickActions = () => {
  const actions = [
    {
      icon: UserPlus,
      label: "Nouvel Élève",
      color: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
    },
    {
      icon: FileText,
      label: "Ajouter Note",
      color: "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white",
    },
    {
      icon: Calendar,
      label: "Créer Séance",
      color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white",
    },
    {
      icon: Megaphone,
      label: "Envoyer Annonce",
      color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500 hover:text-white",
    },
    {
      icon: Bot,
      label: "Demander à l'IA",
      color: "bg-accent/20 text-accent-foreground hover:bg-accent hover:text-accent-foreground",
    },
    {
      icon: BarChart3,
      label: "Voir Rapports",
      color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500 hover:text-white",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-auto py-4 flex flex-col items-center gap-2 transition-all duration-300 ${action.color}`}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
