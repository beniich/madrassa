import { AlertTriangle, Lightbulb, ChevronRight, Bot, TrendingDown, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  description: string;
  student?: string;
  action?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const AIAlertsSection = () => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "danger",
      title: "Absences répétées",
      description: "3 absences non justifiées cette semaine",
      student: "Ahmed K. (4B)",
      action: "Contacter parents",
    },
    {
      id: "2",
      type: "warning",
      title: "Chute des notes",
      description: "Baisse de 4 points en mathématiques",
      student: "Lina M. (3A)",
      action: "Programmer soutien",
    },
    {
      id: "3",
      type: "warning",
      title: "Risque de décrochage",
      description: "Score de risque élevé détecté",
      student: "Youssef B. (5C)",
      action: "Réunion pédagogique",
    },
  ];

  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Réunion parents Classe 4B",
      description: "Taux d'absentéisme supérieur à la moyenne",
      priority: "high",
    },
    {
      id: "2",
      title: "Renforcer soutien français",
      description: "3 élèves en difficulté identifiés par l'IA",
      priority: "medium",
    },
    {
      id: "3",
      title: "Féliciter Classe 6A",
      description: "Meilleure progression du trimestre",
      priority: "low",
    },
  ];

  const typeStyles = {
    danger: "border-l-destructive bg-destructive/5",
    warning: "border-l-yellow-500 bg-yellow-500/5",
    info: "border-l-primary bg-primary/5",
  };

  const priorityStyles = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-yellow-500/10 text-yellow-600",
    low: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Alerts */}
      <Card className="border-2 border-dashed border-destructive/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            Élèves à Risque
            <Badge variant="destructive" className="ml-auto">
              {alerts.length} alertes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border-l-4 transition-all hover:shadow-md cursor-pointer",
                typeStyles[alert.type]
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {alert.type === "danger" ? (
                      <UserX className="h-4 w-4 text-destructive" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-semibold text-foreground">{alert.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.student && (
                    <p className="text-sm font-medium text-foreground mt-1">
                      👤 {alert.student}
                    </p>
                  )}
                </div>
                {alert.action && (
                  <Button variant="outline" size="sm" className="shrink-0">
                    {alert.action}
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full mt-2">
            Voir toutes les alertes <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-2 border-dashed border-primary/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            Recommandations IA
            <Badge variant="default" className="ml-auto bg-primary">
              <Bot className="h-3 w-3 mr-1" />
              Généré par IA
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {rec.title}
                    </span>
                    <Badge className={cn("text-xs", priorityStyles[rec.priority])}>
                      {rec.priority === "high" ? "Urgent" : rec.priority === "medium" ? "Important" : "Info"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full mt-2">
            Plus de recommandations <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAlertsSection;
