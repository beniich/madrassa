import { useState } from "react";
import { useClasses, useTimetable } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    Loader2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const TimetablePage = () => {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const classes = useClasses();
    const timetable = useTimetable(selectedClass === "all" ? undefined : selectedClass);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Emploi du Temps</h1>
                    <p className="text-muted-foreground">Planning hebdomadaire des cours par classe</p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Sélectionner une classe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Toutes les classes</SelectItem>
                            {classes?.map(c => (
                                <SelectItem key={c.localId} value={c.localId}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Ajouter un cours
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-x-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[100px_repeat(6,1fr)] border-b bg-muted/50">
                        <div className="p-3 text-center border-r font-semibold text-xs text-muted-foreground uppercase tracking-wider">Heure</div>
                        {DAYS.map(day => (
                            <div key={day} className="p-3 text-center font-semibold text-xs text-muted-foreground uppercase tracking-wider border-r last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="relative">
                        {HOURS.map((hour, hIdx) => (
                            <div key={hour} className="grid grid-cols-[100px_repeat(6,1fr)] border-b last:border-b-0">
                                <div className="p-4 text-center border-r flex items-center justify-center font-medium text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1.5" /> {hour}
                                </div>
                                {DAYS.map((day, dIdx) => {
                                    const items = timetable?.filter(t => t.dayOfWeek === (dIdx + 1) && t.startTime.startsWith(hour.split(':')[0]));
                                    return (
                                        <div key={`${day}-${hour}`} className="p-2 border-r last:border-r-0 min-h-[100px] bg-muted/5 group hover:bg-muted/10 transition-colors relative">
                                            {items?.map((item, i) => (
                                                <Card key={i} className="p-2 mb-1 bg-primary/5 border-primary/20 shadow-none text-xs flex flex-col gap-1.5">
                                                    <div className="font-bold text-primary truncate">{item.subjectId}</div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <User className="h-2.5 w-2.5" />
                                                        <span className="truncate">{item.teacherId}</span>
                                                    </div>
                                                    {item.room && (
                                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                            <MapPin className="h-2.5 w-2.5" />
                                                            <span>{item.room}</span>
                                                        </div>
                                                    )}
                                                </Card>
                                            ))}
                                            {!items?.length && (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full border border-dashed text-muted-foreground">
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {timetable === undefined && (
                <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
        </div>
    );
};

export default TimetablePage;
