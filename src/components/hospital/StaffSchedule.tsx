import { Card } from "@/components/ui-1cc/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-1cc/avatar";
import { Badge } from "@/components/ui-1cc/badge";
import { ScrollArea, ScrollBar } from "@/components/ui-1cc/scroll-area";
import { format, addDays, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, Shield, AlertTriangle } from "lucide-react";

interface ScheduleShift {
    day: string;
    type: 'morning' | 'afternoon' | 'night' | 'off';
    onCall?: boolean;
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    avatar: string;
    shifts: ScheduleShift[];
}

// Mock Schedule Data generator
const generateMockSchedule = (): TeamMember[] => {
    const roles = ['Doctor', 'Nurse', 'Admin'];
    const shifts: ('morning' | 'afternoon' | 'night' | 'off')[] = ['morning', 'afternoon', 'night', 'off'];

    return [
        { id: '1', name: 'Dr. House', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=House', shifts: [] },
        { id: '2', name: 'Dr. Wilson', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wilson', shifts: [] },
        { id: '3', name: 'Cuddy', role: 'Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cuddy', shifts: [] },
        { id: '4', name: 'Cameron', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cameron', shifts: [] },
        { id: '5', name: 'Chase', role: 'Doctor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chase', shifts: [] },
    ].map(member => {
        const memberShifts = Array.from({ length: 7 }).map((_, i) => ({
            day: format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i), 'yyyy-MM-dd'),
            type: shifts[Math.floor(Math.random() * shifts.length)],
            onCall: Math.random() > 0.8
        }));
        return { ...member, shifts: memberShifts };
    });
};

const staffSchedule = generateMockSchedule();

export const StaffSchedule = () => {
    const weekDays = Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i)
    );

    const getShiftColor = (type: string) => {
        switch (type) {
            case 'morning': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'afternoon': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
            case 'night': return 'bg-slate-800 text-slate-300';
            default: return 'bg-transparent text-muted-foreground';
        }
    };

    const getShiftLabel = (type: string) => {
        switch (type) {
            case 'morning': return '07h-15h';
            case 'afternoon': return '15h-23h';
            case 'night': return '23h-07h';
            default: return '-';
        }
    };

    return (
        <Card className="glass-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Planning des Équipes
                    </h2>
                    <p className="text-sm text-muted-foreground">Roulement de la semaine (Matin / Après-midi / Nuit)</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="border-orange-500/50 text-orange-600 bg-orange-500/10 gap-1">
                        <AlertTriangle className="h-3 w-3" /> Astreinte
                    </Badge>
                </div>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="min-w-[800px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 mb-4 border-b border-border/50 pb-2">
                        <div className="font-medium text-muted-foreground">Membre</div>
                        {weekDays.map(day => (
                            <div key={day.toString()} className="text-center">
                                <div className="text-sm font-bold capitalize">{format(day, 'EEE', { locale: fr })}</div>
                                <div className="text-xs text-muted-foreground">{format(day, 'd MMM')}</div>
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="space-y-3">
                        {staffSchedule.map(member => (
                            <div key={member.id} className="grid grid-cols-[200px_repeat(7,1fr)] gap-4 items-center hover:bg-muted/20 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="overflow-hidden">
                                        <div className="font-medium text-sm truncate">{member.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{member.role}</div>
                                    </div>
                                </div>

                                {member.shifts.map((shift, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center gap-1">
                                        <div className={`text-xs font-medium px-2 py-1 rounded w-full text-center ${getShiftColor(shift.type)}`}>
                                            {getShiftLabel(shift.type)}
                                        </div>
                                        {shift.onCall && (
                                            <Badge className="h-1.5 w-1.5 p-0 bg-orange-500 rounded-full animate-pulse" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Card>
    );
};
