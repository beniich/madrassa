import { useState } from "react";
import { useClasses, useAttendanceToday, markAttendance } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Calendar as CalendarIcon,
    Users,
    Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AttendancePage = () => {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const classes = useClasses();
    const attendance = useAttendanceToday(selectedClass === "all" ? undefined : selectedClass);

    const handleMark = async (studentId: string, classId: string, status: 'present' | 'absent' | 'late') => {
        try {
            await markAttendance(
                'demo_school',
                studentId,
                classId,
                status,
                'current_user'
            );
            toast.success("Statut mis à jour");
        } catch (error) {
            toast.error("Erreur de mise à jour");
        }
    };

    const filteredAttendance = attendance?.filter(a =>
        a.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Feuille d'Appel</h1>
                    <p className="text-muted-foreground">Registre de présence du {new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg text-primary font-medium">
                    <CalendarIcon className="h-4 w-4" />
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un élève..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[200px]">
                        <Users className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Toutes les classes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les classes</SelectItem>
                        {classes?.map(c => (
                            <SelectItem key={c.localId} value={c.localId}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendance === undefined ? (
                    <div className="col-span-full h-32 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredAttendance?.length === 0 ? (
                    <p className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        Aucun élève trouvé pour cette sélection.
                    </p>
                ) : (
                    filteredAttendance?.map((record) => (
                        <Card key={record.studentId} className="p-4 flex flex-col gap-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">Élève {record.studentId.slice(-6)}</h3>
                                    <p className="text-xs text-muted-foreground">Classe: {record.classId}</p>
                                </div>
                                <Badge variant={
                                    record.status === 'present' ? 'default' :
                                        record.status === 'absent' ? 'destructive' :
                                            record.status === 'late' ? 'secondary' : 'outline'
                                } className={cn(
                                    record.status === 'present' && "bg-green-500 hover:bg-green-600",
                                    record.status === 'late' && "bg-yellow-500 hover:bg-yellow-600 text-white"
                                )}>
                                    {record.status === 'present' ? 'Présent' :
                                        record.status === 'absent' ? 'Absent' :
                                            record.status === 'late' ? 'En retard' : 'Non marqué'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    size="sm"
                                    variant={record.status === 'present' ? 'default' : 'outline'}
                                    className={cn("gap-1", record.status === 'present' && "bg-green-500 hover:bg-green-600 border-green-500")}
                                    onClick={() => handleMark(record.studentId, record.classId, 'present')}
                                >
                                    <CheckCircle2 className="h-3 w-3" />
                                    P
                                </Button>
                                <Button
                                    size="sm"
                                    variant={record.status === 'late' ? 'default' : 'outline'}
                                    className={cn("gap-1", record.status === 'late' && "bg-yellow-500 hover:bg-yellow-600 border-yellow-500")}
                                    onClick={() => handleMark(record.studentId, record.classId, 'late')}
                                >
                                    <Clock className="h-3 w-3" />
                                    R
                                </Button>
                                <Button
                                    size="sm"
                                    variant={record.status === 'absent' ? 'default' : 'outline'}
                                    className={cn("gap-1", record.status === 'absent' && "bg-destructive hover:bg-destructive/90 border-destructive")}
                                    onClick={() => handleMark(record.studentId, record.classId, 'absent')}
                                >
                                    <XCircle className="h-3 w-3" />
                                    A
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AttendancePage;
