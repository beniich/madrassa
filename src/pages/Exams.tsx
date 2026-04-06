import { useState, useMemo } from "react";
import { useClasses, useExams } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    Target,
    TrendingUp,
    Calendar,
    Plus,
    Search,
    BookOpen,
    Users,
    Loader2,
    FileText,
    CheckCircle2,
    X,
    ClipboardList,
    Printer,
    ArrowRight,
    GraduationCap,
    Star,
    AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// ============================================================================
// COMPOSANT : BULLETIN SCOLAIRE (DIPLOMA STYLE)
// ============================================================================

const ReportCardModal = ({ student, onClose }: { student: any; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <Card className="max-w-4xl w-full bg-white overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 border-none">
                {/* Bordure décorative premium */}
                <div className="absolute inset-4 border-4 border-double border-amber-200 pointer-events-none rounded-sm"></div>
                <div className="absolute inset-6 border border-amber-100 pointer-events-none rounded-sm"></div>
                
                <div className="p-12 space-y-8 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden z-10">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>

                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <GraduationCap className="h-16 w-16 text-amber-500" />
                        </div>
                        <h2 className="text-4xl font-serif text-gray-900 tracking-tighter uppercase italic">Bulletin de Grades Officiel</h2>
                        <div className="flex items-center justify-center gap-4 text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                            <span className="h-px w-10 bg-amber-200"></span>
                            Année Académique 2025 - 2026
                            <span className="h-px w-10 bg-amber-200"></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-amber-100">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Élève</p>
                            <p className="text-2xl font-black text-gray-900 italic">MOHAMED ALAMI</p>
                            <p className="text-sm text-gray-500 font-bold">Classe : 5ème Année A</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Établissement</p>
                            <p className="text-xl font-black text-purple-700">SCHOOL GENIUS MADRASSA</p>
                            <p className="text-sm text-gray-500 uppercase tracking-tighter">Secteur Éducation - Excellence</p>
                        </div>
                    </div>

                    <table className="w-full border-collapse mt-8">
                        <thead>
                            <tr className="bg-amber-50/50">
                                <th className="p-3 text-left border border-amber-100 text-[10px] font-black uppercase text-amber-800 tracking-widest">Matière</th>
                                <th className="p-3 text-center border border-amber-100 text-[10px] font-black uppercase text-amber-800 tracking-widest">Note</th>
                                <th className="p-3 text-center border border-amber-100 text-[10px] font-black uppercase text-amber-800 tracking-widest">Coefficient</th>
                                <th className="p-3 text-[10px] font-black text-center border border-amber-100 uppercase text-amber-800 tracking-widest">Observation</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                { m: 'Mathématiques', n: '18.5', c: '4', o: 'Excellent travail' },
                                { m: 'Arabe Littéraire', n: '16.0', c: '5', o: 'Très bons résultats' },
                                { m: 'Français', n: '14.5', c: '3', o: 'En progression' },
                                { m: 'Education Islamique', n: '19.0', c: '2', o: 'Parfait' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="p-3 border border-amber-100 font-bold text-gray-700">{row.m}</td>
                                    <td className="p-3 border border-amber-100 text-center font-black text-gray-900">{row.n} / 20</td>
                                    <td className="p-3 border border-amber-100 text-center text-gray-500">{row.c}</td>
                                    <td className="p-3 border border-amber-100 italic text-gray-600 font-serif">{row.o}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-amber-100/50">
                                <td className="p-4 border border-amber-100 font-black text-amber-900 text-center uppercase tracking-widest text-xs" colSpan={3}>MOYENNE GÉNÉRALE DU TRIMESTRE</td>
                                <td className="p-4 border border-amber-100 text-center">
                                    <span className="text-3xl font-black text-amber-700 italic">17.25 / 20</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="flex justify-between items-end pt-8">
                        <div className="text-center space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Sceau de l'École</p>
                            <div className="w-24 h-24 rounded-full border-4 border-amber-100 flex items-center justify-center opacity-30 rotate-[-15deg]">
                                <Star className="h-12 w-12 text-amber-200" />
                            </div>
                        </div>
                        <div className="text-center space-y-4 max-w-[200px] border-t-2 border-amber-200">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Signature du Directeur</p>
                            <div className="h-10"></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex gap-4 print:hidden">
                    <Button variant="outline" className="flex-1 border-gray-300" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100 gap-2" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" /> IMPRIMER LE BULLETIN
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// ============================================================================
// COMPOSANT : SAISIE DE NOTES (QUICK GRID)
// ============================================================================

const GradesEntryModal = ({ exam, onClose }: { exam: any; onClose: () => void }) => {
    const students = Array.from({ length: 10 }).map((_, i) => ({ id: `S${i}`, name: `Élève #${i + 1}` }));
    const [scores, setScores] = useState<Record<string, string>>({});

    const handleSave = () => {
        toast.success("Toutes les notes ont été enregistrées avec succès !");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full p-8 animate-in slide-in-from-bottom-5 duration-300 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-start mb-6 shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Saisie de Grades : <span className="text-purple-600">{exam.name}</span></h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1 italic">Mode rapide - Validation instantanée</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 border border-gray-100 rounded-2xl">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-white z-10 border-b-2 border-gray-100">
                            <tr>
                                <th className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Élève</th>
                                <th className="p-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest w-40">Note / 20</th>
                                <th className="p-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Commentaire</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {students.map((st, i) => (
                                <tr key={st.id} className="hover:bg-purple-50/30 transition-colors group">
                                    <td className="p-4 text-sm font-bold text-gray-700">{st.name}</td>
                                    <td className="p-4">
                                        <div className="relative group">
                                            <Input 
                                                type="number" 
                                                className="text-center font-black text-lg h-10 border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-200 transition-all"
                                                placeholder="??" 
                                                value={scores[st.id] || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (Number(val) > 20) return;
                                                    setScores({...scores, [st.id]: val});
                                                }}
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity">
                                                <Target className="h-3 w-3 text-purple-300" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Input placeholder="Obs..." className="h-9 border-none bg-transparent hover:bg-gray-50 focus:bg-white text-xs" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-4 pt-8 shrink-0">
                    <Button variant="outline" className="flex-1 h-12 font-bold" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 h-12 font-black bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100" onClick={handleSave}>
                        VALIDER LES NOTES
                    </Button>
                </div>
            </Card>
        </div>
    );
};

// ============================================================================
// PAGE PRINCIPALE
// ============================================================================

const ExamsPage = () => {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [showGradesEntry, setShowGradesEntry] = useState(false);
    const [showReportCard, setShowReportCard] = useState(false);
    const [showNewExam, setShowNewExam] = useState(false);
    const [currentExam, setCurrentExam] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const exams = useExams(selectedClass === "all" ? undefined : selectedClass);
    const classes = useClasses();

    const filteredExams = exams?.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.subjectId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight italic">Examens & Académique</h1>
                    <p className="text-gray-500 font-medium">Suivi rigoureux des performances et évaluations</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2 border-gray-300 shadow-sm font-bold"
                        onClick={() => setShowReportCard(true)}
                    >
                        <FileText className="h-4 w-4" />
                        Report Cards
                    </Button>
                    <Button 
                        className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-200 transition-all hover:scale-105"
                        onClick={() => setShowNewExam(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Nouvel Examen
                    </Button>
                </div>
            </div>

            {/* Stats Cards Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-5 border-none shadow-md bg-white flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <Badge variant="outline" className="text-[10px] border-blue-100 text-blue-400">+0.5 pts</Badge>
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Moyenne Générale</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter italic">14.50 / 20</p>
                </Card>
                <Card className="p-5 border-none shadow-md bg-white flex flex-col gap-1">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Taux de Réussite</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">88%</p>
                </Card>
                <Card className="p-5 border-none shadow-md bg-white flex flex-col gap-1">
                    <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Meilleure Note</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">19.5 / 20</p>
                </Card>
                <Card className="p-5 border-none shadow-md bg-white flex flex-col gap-1">
                    <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                        <TrendingUp className="h-5 w-5" />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Plus Basse</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">04.5 / 20</p>
                </Card>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    <Input
                        placeholder="Rechercher un examen (Maths, Trimestre, ...) "
                        className="pl-12 border-none bg-gray-50 h-11 text-base placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[200px] h-11 border-none bg-gray-50 font-bold">
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

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
                {exams === undefined ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-200" />
                        <p className="text-gray-400 font-bold tracking-widest animate-pulse">Synchronisation des notes...</p>
                    </div>
                ) : filteredExams?.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50 rounded-3xl">
                        <ClipboardList className="h-16 w-16 mx-auto mb-4 text-gray-300 opacity-50" />
                        <h3 className="text-xl font-black text-gray-500 uppercase tracking-tighter">Aucun examen trouvé</h3>
                        <p className="text-gray-400 mt-2 font-medium">Planifiez votre première évaluation pour commencer le suivi.</p>
                        <Button className="mt-8 bg-purple-600 hover:bg-purple-700" onClick={() => setShowNewExam(true)}>
                            Add un Examen
                        </Button>
                    </Card>
                ) : (
                    filteredExams?.map((exam) => (
                        <Card key={exam.localId} className="p-6 hover:shadow-xl transition-all border-none bg-white rounded-2xl flex flex-col md:flex-row items-center gap-8 group">
                            {/* Date Block */}
                            <div className="h-16 w-16 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                                <span className="text-[10px] uppercase font-black opacity-60">{new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                <span className="text-2xl font-black tracking-tighter leading-none">{new Date(exam.date).getDate()}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors italic">{exam.name}</h3>
                                    <Badge variant="outline" className="w-fit mx-auto md:mx-0 border-purple-100 text-purple-600 bg-purple-50/50 font-bold uppercase text-[9px]">
                                        {exam.term}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {exam.subjectId}</span>
                                    <span className="flex items-center gap-1.5 text-blue-500"><Users className="h-3.5 w-3.5" /> Classe : {exam.classId}</span>
                                </div>
                                
                                {/* Mini Performance Chart (Visual enhancement) */}
                                <div className="mt-4 pt-4 border-t border-gray-50 max-w-xs">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">Progression Classe</span>
                                        <span className="text-xs font-black text-purple-600 italic">14.2 / 20</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000" 
                                            style={{ width: '71%' }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 min-w-[160px]">
                                <Button 
                                    className="w-full h-11 bg-white border-2 border-purple-100 text-purple-600 hover:bg-purple-50 font-black tracking-tight"
                                    onClick={() => {
                                        setCurrentExam(exam);
                                        setShowGradesEntry(true);
                                    }}
                                >
                                    SAISIR NOTES
                                </Button>
                                <Button className="w-full h-11 bg-gray-900 hover:bg-black text-white font-black group-hover:scale-105 transition-transform shadow-lg shadow-gray-200 flex items-center gap-2">
                                    DÉTAILS <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* MODAL : SAISIE DE NOTES */}
            {showGradesEntry && currentExam && (
                <GradesEntryModal exam={currentExam} onClose={() => setShowGradesEntry(false)} />
            )}

            {/* MODAL : BULLETIN */}
            {showReportCard && (
                <ReportCardModal student={{}} onClose={() => setShowReportCard(false)} />
            )}
            
            {/* MODAL : NOUVEL EXAMEN */}
            {showNewExam && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <Card className="max-w-xl w-full p-8 animate-in slide-in-from-bottom-5 duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Nouvel Examen</h3>
                                <p className="text-gray-400 font-medium">Planification d'une évaluation sommative</p>
                            </div>
                            <button onClick={() => setShowNewExam(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-gray-400" />
                            </button>
                        </div>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name de l'évaluation</label>
                                    <Input placeholder="ex: Contrôle continu 1" className="h-12 bg-gray-50 border-none font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Matière</label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-gray-50 border-none font-bold">
                                            <SelectValue placeholder="Choisir..." />
                                        </SelectTrigger>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Coefficient</label>
                                    <Input type="number" defaultValue="1" className="h-12 bg-gray-50 border-none font-bold text-center" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Note Max</label>
                                    <Input type="number" defaultValue="20" className="h-12 bg-gray-50 border-none font-bold text-center" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Période</label>
                                    <Select>
                                        <SelectTrigger className="h-12 bg-gray-50 border-none font-bold">
                                            <SelectValue placeholder="T1" />
                                        </SelectTrigger>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date prévue</label>
                                <Input type="date" className="h-12 bg-gray-50 border-none font-bold" />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" className="flex-1 h-12 font-bold" onClick={() => setShowNewExam(false)}>
                                    Cancel
                                </Button>
                                <Button className="flex-1 h-12 font-black bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100" onClick={() => {
                                    toast.success("Examen planifié avec succès !");
                                    setShowNewExam(false);
                                }}>
                                    CONFIRMER LA CRÉATION
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ExamsPage;

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}

