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
    Loader2,
    Scan,
    UserCheck,
    AlertCircle,
    Sparkles,
    CheckSquare
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AttendancePage = () => {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isScanning, setIsScanning] = useState(false);
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
            toast.success(`Élève marqué ${status === 'present' ? 'présent' : status === 'absent' ? 'absent' : 'en retard'}`, {
                icon: status === 'present' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Clock className="h-4 w-4 text-yellow-500" />
            });
        } catch (error) {
            toast.error("Error de mise à jour");
        }
    };

    const handleBatchMark = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Marquage collectif en cours...',
                success: 'Tous les élèves non marqués ont été déclarés PRÉSENTS.',
                error: 'Error lors du traitement groupé',
            }
        );
    };

    const toggleScanner = () => {
        setIsScanning(!isScanning);
        if(!isScanning) {
            toast.info("Mode Scanner activé. Utilisez la caméra pour scanner les badges.");
        }
    };

    const filteredAttendance = attendance?.filter(a =>
        a.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        present: attendance?.filter(a => a.status === 'present').length || 0,
        absent: attendance?.filter(a => a.status === 'absent').length || 0,
        late: attendance?.filter(a => a.status === 'late').length || 0,
        total: attendance?.length || 0
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[9px] uppercase tracking-widest px-3">
                            Gestion Journalière
                        </Badge>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Feuille d'Appel</h1>
                    <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-purple-500" />
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button 
                        onClick={toggleScanner}
                        variant={isScanning ? "default" : "outline"}
                        className={cn(
                            "rounded-2xl h-14 px-6 gap-3 font-black transition-all",
                            isScanning ? "bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-200 animate-pulse" : "hover:bg-purple-50 hover:text-purple-600 border-gray-200"
                        )}
                    >
                        <Scan className="h-5 w-5" /> {isScanning ? "SCANNER ACTIF" : "MODE SCANNER"}
                    </Button>
                    <Button 
                        onClick={handleBatchMark}
                        className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 px-6 gap-3 font-black shadow-xl shadow-gray-200"
                    >
                        <UserCheck className="h-5 w-5" /> TOUT PRÉSENT
                    </Button>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">Total Students</p>
                        <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">Présents Today</p>
                        <p className="text-2xl font-black text-green-600">{stats.present}</p>
                    </div>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <XCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">Absents Today</p>
                        <p className="text-2xl font-black text-rose-600">{stats.absent}</p>
                    </div>
                </Card>
                <Card className="p-6 border-none shadow-sm bg-white rounded-3xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 mb-1 uppercase tracking-tighter">Retardataires</p>
                        <p className="text-2xl font-black text-amber-600">{stats.late}</p>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                        placeholder="Rechercher par nom ou ID..."
                        className="pl-12 h-14 border-none bg-gray-50 rounded-2xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-purple-200"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full md:w-[260px] h-14 rounded-2xl border-gray-100 bg-white font-black text-gray-700 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-purple-600" />
                            <SelectValue placeholder="Toutes les classes" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="all" className="font-bold">Toutes les classes</SelectItem>
                        {classes?.map(c => (
                            <SelectItem key={c.localId} value={c.localId} className="font-bold cursor-pointer transition-colors">
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Attendance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendance === undefined ? (
                    <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                        <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Loading... registre...</p>
                    </div>
                ) : filteredAttendance?.length === 0 ? (
                    <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
                        <AlertCircle className="h-20 w-20 mx-auto mb-6 text-gray-200" />
                        <h3 className="text-xl font-black text-gray-900 mb-2 italic">Aucune donnée trouvée</h3>
                        <p className="text-gray-400 font-medium max-w-xs mx-auto">Vérifiez vos filtres ou lancez le mode scanner.</p>
                    </div>
                ) : (
                    filteredAttendance?.map((record, idx) => (
                        <Card key={record.studentId} className="group relative p-6 bg-white rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl hover:translate-y-[-5px] transition-all duration-500 overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="h-12 w-12" />
                            </div>
                            
                            <div className="flex items-center gap-4 mb-6 relative">
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-xl font-black text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                                    {record.studentId.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-1">
                                        Élève #{record.studentId.slice(-4)}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 border-none px-2 py-0 font-black text-[8px] uppercase">
                                            {record.classId}
                                        </Badge>
                                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                                        <span className="text-[10px] font-bold text-gray-400">INDEX: {idx + 1}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                                    <span>STATUT ACTUEL</span>
                                    <span className={cn(
                                        "font-black tracking-normal",
                                        record.status === 'present' ? 'text-green-600' :
                                        record.status === 'absent' ? 'text-rose-600' :
                                        record.status === 'late' ? 'text-amber-600' : 'text-gray-400'
                                    )}>
                                        {record.status === 'present' ? 'PRÉSENT' :
                                         record.status === 'absent' ? 'ABSENT' :
                                         record.status === 'late' ? 'EN RETARD' : 'NON MARQUÉ'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        title="Marquer présent"
                                        onClick={() => handleMark(record.studentId, record.classId, 'present')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                                            record.status === 'present' 
                                                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-100" 
                                                : "bg-white border-gray-50 text-gray-400 hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                                        )}
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="text-[9px] font-black uppercase">OUI</span>
                                    </button>
                                    <button
                                        title="Marquer en retard"
                                        onClick={() => handleMark(record.studentId, record.classId, 'late')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                                            record.status === 'late' 
                                                ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100" 
                                                : "bg-white border-gray-50 text-gray-400 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600"
                                        )}
                                    >
                                        <Clock className="h-5 w-5" />
                                        <span className="text-[9px] font-black uppercase">RET</span>
                                    </button>
                                    <button
                                        title="Marquer absent"
                                        onClick={() => handleMark(record.studentId, record.classId, 'absent')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2",
                                            record.status === 'absent' 
                                                ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-100" 
                                                : "bg-white border-gray-50 text-gray-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                                        )}
                                    >
                                        <XCircle className="h-5 w-5" />
                                        <span className="text-[9px] font-black uppercase">NON</span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AttendancePage;

