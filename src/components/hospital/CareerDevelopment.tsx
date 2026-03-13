import { useHospitalStore } from "@/stores/useHospitalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Badge } from "@/components/ui-1cc/badge";
import { Button } from "@/components/ui-1cc/button";
import { Progress } from "@/components/ui-1cc/progress";
import { GraduationCap, Award, AlertTriangle, Star, TrendingUp } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";

interface CareerDevelopmentProps {
    staffId: string;
}

export function CareerDevelopment({ staffId }: CareerDevelopmentProps) {
    const { trainings, performances } = useHospitalStore();

    const staffTrainings = trainings.filter((t) => t.staffId === staffId);
    const staffPerformances = performances
        .filter((p) => p.staffId === staffId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const latestPerformance = staffPerformances[0];

    const expiringTrainings = staffTrainings.filter((t) => {
        if (!t.expiryDate) return false;
        const daysUntilExpiry = differenceInDays(new Date(t.expiryDate), new Date());
        return daysUntilExpiry > 0 && daysUntilExpiry < 90;
    });

    const completedTrainings = staffTrainings.filter((t) => t.status === "completed").length;
    const totalTrainings = staffTrainings.length;

    return (
        <div className="space-y-6">
            {/* Performance Score */}
            {latestPerformance && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" /> Dernière Évaluation
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            {format(new Date(latestPerformance.date), "dd MMMM yyyy", { locale: fr })}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground mb-2">Note Globale</p>
                                    <Progress value={latestPerformance.overallRating * 20} className="h-3" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-primary">
                                        {latestPerformance.overallRating}
                                    </p>
                                    <p className="text-xs text-muted-foreground">/5</p>
                                </div>
                            </div>

                            {latestPerformance.strengths.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" /> Points Forts
                                    </p>
                                    <ul className="space-y-1">
                                        {latestPerformance.strengths.slice(0, 3).map((strength, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span className="text-green-600">✓</span>
                                                {strength}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {latestPerformance.goals.length > 0 && (
                                <div className="border-t pt-3">
                                    <p className="text-xs font-semibold mb-2">Objectifs 2025</p>
                                    <ul className="space-y-1">
                                        {latestPerformance.goals.slice(0, 3).map((goal, idx) => (
                                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                                <span>•</span>
                                                {goal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Training Progress */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" /> Formations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Progression ({completedTrainings}/{totalTrainings})
                                </p>
                                <Progress
                                    value={totalTrainings > 0 ? (completedTrainings / totalTrainings) * 100 : 0}
                                    className="h-2"
                                />
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {completedTrainings} complétées
                            </Badge>
                        </div>

                        {expiringTrainings.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                                <p className="text-sm font-medium text-orange-900 dark:text-orange-100 flex items-center gap-2 mb-2">
                                    <AlertTriangle className="h-4 w-4" /> Certifications à renouveler
                                </p>
                                {expiringTrainings.map((training) => (
                                    <div key={training.id} className="text-xs text-orange-700 dark:text-orange-300">
                                        • {training.name} (expire le{" "}
                                        {format(new Date(training.expiryDate!), "dd/MM/yyyy")})
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-2">
                            {staffTrainings.slice(0, 4).map((training) => (
                                <div
                                    key={training.id}
                                    className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900 rounded border"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{training.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(training.startDate), "MMM yyyy", { locale: fr })}
                                            {training.type === "certification" && (
                                                <Award className="inline h-3 w-3 ml-1 text-yellow-600" />
                                            )}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            training.status === "completed"
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : training.status === "in-progress"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : training.status === "expired"
                                                        ? "bg-red-50 text-red-700 border-red-200"
                                                        : "bg-gray-50 text-gray-700 border-gray-200"
                                        }
                                    >
                                        {training.status === "completed"
                                            ? "Terminée"
                                            : training.status === "in-progress"
                                                ? "En cours"
                                                : training.status === "expired"
                                                    ? "Expirée"
                                                    : "Planifiée"}
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        {staffTrainings.length === 0 && (
                            <p className="text-center text-muted-foreground text-sm py-4">
                                Aucune formation enregistrée
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
                <Button variant="outline" className="flex-1 text-xs">
                    Planifier Formation
                </Button>
                <Button variant="outline" className="flex-1 text-xs">
                    Nouvel Entretien
                </Button>
            </div>
        </div>
    );
}
