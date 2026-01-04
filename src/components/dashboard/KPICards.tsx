import { Users, UserCheck, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useStudentCount,
  useAttendanceRate,
  useAverageGrade,
  useUnhandledAlertCount
} from "@/hooks/useOfflineData";

interface KPICardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: React.ElementType;
  trend?: { value: string; positive: boolean };
  color: "primary" | "success" | "warning" | "destructive";
  loading?: boolean;
}

const KPICard = ({ title, value, subtext, icon: Icon, trend, color, loading }: KPICardProps) => {
  const colorClasses = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    success: "from-green-500/20 to-green-500/5 border-green-500/20",
    warning: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/20",
    destructive: "from-destructive/20 to-destructive/5 border-destructive/20",
  };

  const iconColorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-500",
    warning: "bg-yellow-500/10 text-yellow-500",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className={cn("bg-gradient-to-br border", colorClasses[color], "hover:shadow-lg transition-all duration-300 cursor-pointer group")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className={cn(
              "text-3xl font-bold text-foreground group-hover:scale-105 transition-transform",
              loading && "animate-pulse opacity-50"
            )}>
              {loading ? '...' : value}
            </p>
            <p className="text-xs text-muted-foreground">{subtext}</p>
          </div>
          <div className={cn("p-3 rounded-xl", iconColorClasses[color])}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 mt-4 text-sm", trend.positive ? "text-green-500" : "text-destructive")}>
            {trend.positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="font-medium">{trend.value}</span>
            <span className="text-muted-foreground">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KPICards = () => {
  const studentCount = useStudentCount();
  const attendanceRate = useAttendanceRate();
  const averageGrade = useAverageGrade();
  const alertCount = useUnhandledAlertCount();

  const kpis: KPICardProps[] = [
    {
      title: "Total Élèves",
      value: studentCount ?? "1,248",
      subtext: "Classes actives",
      icon: Users,
      trend: { value: "+12", positive: true },
      color: "primary",
      loading: studentCount === undefined,
    },
    {
      title: "Taux de Présence",
      value: attendanceRate !== undefined ? `${attendanceRate}%` : "92%",
      subtext: "Aujourd'hui",
      icon: UserCheck,
      trend: { value: "+2.3%", positive: true },
      color: "success",
      loading: attendanceRate === undefined,
    },
    {
      title: "Moyenne Générale",
      value: averageGrade !== undefined && averageGrade > 0 ? `${averageGrade}/20` : "13.4/20",
      subtext: "Trimestre en cours",
      icon: TrendingUp,
      trend: { value: "+0.8", positive: true },
      color: "warning",
      loading: averageGrade === undefined,
    },
    {
      title: "Alertes IA",
      value: alertCount ?? "7",
      subtext: "À traiter localement",
      icon: AlertTriangle,
      color: "destructive",
      loading: alertCount === undefined,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};

export default KPICards;
