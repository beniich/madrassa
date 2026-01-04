import { Clock, UserCheck, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "attendance" | "grade" | "message" | "alert";
  title: string;
  description: string;
  time: string;
  user: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    {
      id: "1",
      type: "grade",
      title: "Notes ajoutées",
      description: "Devoir de mathématiques - Classe 4A",
      time: "Il y a 10 min",
      user: "M. Benali",
    },
    {
      id: "2",
      type: "attendance",
      title: "Présence saisie",
      description: "Classe 6B - Cours de français",
      time: "Il y a 25 min",
      user: "Mme. Dupont",
    },
    {
      id: "3",
      type: "alert",
      title: "Absence signalée",
      description: "Élève Karim M. absent sans justificatif",
      time: "Il y a 1h",
      user: "Système",
    },
    {
      id: "4",
      type: "message",
      title: "Message envoyé",
      description: "Convocation réunion parents - 15 destinataires",
      time: "Il y a 2h",
      user: "Direction",
    },
    {
      id: "5",
      type: "grade",
      title: "Bulletin généré",
      description: "Bulletins T1 - Classe 3A prêts",
      time: "Il y a 3h",
      user: "Système IA",
    },
  ];

  const typeConfig = {
    attendance: {
      icon: UserCheck,
      color: "text-green-500 bg-green-500/10",
    },
    grade: {
      icon: FileText,
      color: "text-primary bg-primary/10",
    },
    message: {
      icon: MessageSquare,
      color: "text-blue-500 bg-blue-500/10",
    },
    alert: {
      icon: AlertTriangle,
      color: "text-destructive bg-destructive/10",
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Activité Récente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;

            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className={cn("p-2 rounded-lg", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{activity.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.user}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
