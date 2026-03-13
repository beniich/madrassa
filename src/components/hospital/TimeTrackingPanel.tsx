import { useState } from "react";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Button } from "@/components/ui-1cc/button";
import { Badge } from "@/components/ui-1cc/badge";
import { Clock, LogIn, LogOut, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks-1cc/use-toast";

interface TimeTrackingPanelProps {
    staffId: string;
    staffName: string;
}

export function TimeTrackingPanel({ staffId, staffName }: TimeTrackingPanelProps) {
    const { timeEntries, addTimeEntry, checkOut } = useHospitalStore();
    const [isWorking, setIsWorking] = useState(false);

    const todayEntries = timeEntries.filter(
        (e) => e.staffId === staffId && e.date === format(new Date(), "yyyy-MM-dd")
    );
    const currentEntry = todayEntries.find((e) => !e.checkOut);

    const handleCheckIn = () => {
        const now = new Date();
        addTimeEntry({
            staffId,
            staffName,
            date: format(now, "yyyy-MM-dd"),
            checkIn: format(now, "HH:mm"),
            status: "present",
        });
        setIsWorking(true);
        toast({
            title: "Pointage d'arrivée",
            description: `Enregistré à ${format(now, "HH:mm")}`,
            className: "bg-green-600 text-white",
        });
    };

    const handleCheckOut = () => {
        if (currentEntry) {
            const now = new Date();
            checkOut(currentEntry.id, format(now, "HH:mm"));
            setIsWorking(false);
            toast({
                title: "Pointage de départ",
                description: `Enregistré à ${format(now, "HH:mm")}`,
                className: "bg-blue-600 text-white",
            });
        }
    };

    const thisMonthEntries = timeEntries.filter((e) => {
        const entryDate = new Date(e.date);
        const now = new Date();
        return (
            e.staffId === staffId &&
            entryDate.getMonth() === now.getMonth() &&
            entryDate.getFullYear() === now.getFullYear()
        );
    });

    const totalHours = thisMonthEntries.reduce((sum, e) => sum + (e.totalHours || 0), 0);
    const totalOvertime = thisMonthEntries.reduce((sum, e) => sum + (e.overtimeHours || 0), 0);

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-5 w-5" /> Pointage Rapide
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button
                            onClick={handleCheckIn}
                            disabled={!!currentEntry}
                            className="flex-1 gap-2"
                            variant={currentEntry ? "outline" : "default"}
                        >
                            <LogIn className="h-4 w-4" /> Arrivée
                        </Button>
                        <Button
                            onClick={handleCheckOut}
                            disabled={!currentEntry}
                            className="flex-1 gap-2"
                            variant={currentEntry ? "default" : "outline"}
                        >
                            <LogOut className="h-4 w-4" /> Départ
                        </Button>
                    </div>
                    {currentEntry && (
                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                ✓ En service depuis {currentEntry.checkIn}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Monthly Summary */}
            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Heures ce mois</p>
                        <p className="text-3xl font-bold text-primary">{totalHours.toFixed(1)}h</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Heures Supp.</p>
                        <p className="text-3xl font-bold text-orange-600">{totalOvertime.toFixed(1)}h</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Entries */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Historique (7 derniers jours)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {thisMonthEntries.slice(-7).reverse().map((entry) => (
                            <div
                                key={entry.id}
                                className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border"
                            >
                                <div>
                                    <p className="font-medium text-sm">
                                        {format(new Date(entry.date), "EEEE dd MMM", { locale: fr })}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {entry.checkIn} - {entry.checkOut || "En cours"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{entry.totalHours?.toFixed(1) || "-"}h</p>
                                    {entry.overtimeHours && entry.overtimeHours > 0 ? (
                                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                                            +{entry.overtimeHours.toFixed(1)}h
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                        {thisMonthEntries.length === 0 && (
                            <p className="text-center text-muted-foreground text-sm py-4">
                                Aucun pointage ce mois-ci
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
