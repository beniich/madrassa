import { useState } from "react";
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
    FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ExamsPage = () => {
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const exams = useExams(selectedClass === "all" ? undefined : selectedClass);
    const classes = useClasses();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Examens et Notes</h1>
                    <p className="text-muted-foreground">Suivi des évaluations et performances académiques</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <FileText className="h-4 w-4" />
                        Bulletins
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-4 w-4" />
                        Nouvel Examen
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4 bg-primary/5 border-primary/10">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Moyenne Générale</p>
                        <p className="text-2xl font-bold">14.5 / 20</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-green-500/5 border-green-500/10">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Taux de Réussite</p>
                        <p className="text-2xl font-bold text-green-600">88%</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4 bg-yellow-500/5 border-yellow-500/10">
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                        <Target className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Évaluations à venir</p>
                        <p className="text-2xl font-bold text-yellow-600">12</p>
                    </div>
                </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un examen..."
                        className="pl-10 pb-1"
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

            <div className="grid grid-cols-1 gap-4">
                {exams === undefined ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : exams.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground border-dashed border-2">
                        <Target className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Aucun examen programmé</h3>
                        <p className="max-w-md mx-auto">Commencez par planifier un examen pour l'une de vos classes ou importez les notes d'un devoir.</p>
                    </Card>
                ) : (
                    exams.map((exam) => (
                        <Card key={exam.localId} className="p-4 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
                            <div className="h-16 w-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center border border-primary/20 shrink-0">
                                <span className="text-xs uppercase font-bold text-primary/60">{new Date(exam.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                <span className="text-xl font-black text-primary">{new Date(exam.date).getDate()}</span>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold">{exam.name}</h3>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {exam.subjectId}</span>
                                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {exam.classId}</span>
                                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {exam.term}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <Badge variant="outline" className="bg-primary/5">Max: {exam.maxScore}/20</Badge>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline">Gérer les notes</Button>
                                    <Button size="sm">Détails</Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExamsPage;
