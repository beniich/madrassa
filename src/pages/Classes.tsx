import { useState } from "react";
import { useClasses, addClass } from "@/hooks/useOfflineData";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Users,
    BookOpen,
    Plus,
    School,
    Settings2,
    Trophy,
    MoreVertical,
    Loader2,
    Search,
    ChevronRight,
    GraduationCap,
    ArrowUpRight,
    Sparkles,
    LayoutGrid
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ClassesPage = () => {
    const classes = useClasses();
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newClass, setNewClass] = useState({
        name: "",
        level: "",
        academicYear: "2024-2025",
        capacity: 30
    });

    const handleAddClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addClass({ ...newClass, schoolId: 'demo_school' });
            toast.success("Structure pédagogique créée avec succès", {
                icon: <Plus className="h-4 w-4 text-green-500" />
            });
            setIsAddClassOpen(false);
            setNewClass({ name: "", level: "", academicYear: "2024-2025", capacity: 30 });
        } catch (error) {
            toast.error("Échec de la création");
        }
    };

    const filteredClasses = classes?.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <School className="h-24 w-24 rotate-12" />
                </div>
                <div className="relative z-10 space-y-2">
                    <Badge className="bg-purple-50 text-purple-600 border-purple-100 font-black text-[9px] uppercase tracking-widest px-3 mb-2">
                        SYSTÈME PÉDAGOGIQUE
                    </Badge>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">Classes & Matières</h1>
                    <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
                        Gérez les structures et l'organisation académique de l'établissement
                    </p>
                </div>
                <div className="flex gap-3 relative z-10">
                    <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 px-8 gap-3 font-black shadow-xl shadow-gray-200 group">
                                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                                NOUVELLE CLASSE
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8 max-w-md bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic tracking-tight mb-4">Structure de Classe</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddClass} className="space-y-6 pt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom de la classe</Label>
                                    <Input
                                        value={newClass.name}
                                        onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                                        className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ex: 4ème Alpha"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Niveau Scolaire</Label>
                                    <Input
                                        value={newClass.level}
                                        onChange={e => setNewClass({ ...newClass, level: e.target.value })}
                                        className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-purple-200"
                                        placeholder="Ex: Primaire / Collège"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Effectif Max</Label>
                                        <Input
                                            type="number"
                                            value={newClass.capacity}
                                            onChange={e => setNewClass({ ...newClass, capacity: parseInt(e.target.value) })}
                                            className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-purple-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Année Académique</Label>
                                        <Input
                                            value={newClass.academicYear}
                                            onChange={e => setNewClass({ ...newClass, academicYear: e.target.value })}
                                            className="h-12 rounded-xl bg-gray-50 border-none font-bold focus:ring-2 focus:ring-purple-200"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-lg shadow-purple-100">
                                    CRÉER LA CLASSE
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="classes" className="w-full space-y-8">
                <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 shadow-sm h-14 w-full md:w-[460px] flex gap-2">
                    <TabsTrigger value="classes" className="flex-1 rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all">
                        <LayoutGrid className="h-4 w-4 mr-2" /> Classes
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="flex-1 rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all">
                        <BookOpen className="h-4 w-4 mr-2" /> Catalogue Matières
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                            <Input
                                placeholder="Rechercher une classe ou un niveau..."
                                className="pl-12 h-14 border-none bg-gray-50 rounded-2xl font-bold placeholder:text-gray-400 focus:ring-2 focus:ring-purple-200"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl text-purple-600 font-black text-xs">
                             <Trophy className="h-4 w-4" /> {classes?.length || 0} SECTIONS ACTIVES
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes === undefined ? (
                            <div className="col-span-full h-64 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                                <p className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Chargement des sections...</p>
                            </div>
                        ) : filteredClasses?.length === 0 ? (
                            <div className="col-span-full text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
                                <Users className="h-20 w-20 mx-auto mb-6 text-gray-200" />
                                <h3 className="text-xl font-black text-gray-900 mb-2 italic">Aucune classe répertoriée</h3>
                                <p className="text-gray-400 font-medium max-w-xs mx-auto">Vérifiez vos filtres ou créez une nouvelle section pédagogique.</p>
                            </div>
                        ) : (
                            filteredClasses?.map((cls, idx) => (
                                <Card key={cls.localId} className="group relative p-8 bg-white rounded-[2.5rem] border-none shadow-lg hover:shadow-2xl hover:translate-y-[-10px] transition-all duration-500 overflow-hidden">
                                    <div className={cn(
                                        "absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity rounded-bl-[100px]",
                                        idx % 3 === 0 ? "bg-purple-600" : idx % 3 === 1 ? "bg-blue-600" : "bg-emerald-600"
                                    )}></div>
                                    
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500",
                                                idx % 3 === 0 ? "bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-100" : 
                                                idx % 3 === 1 ? "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-100" : 
                                                "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-100"
                                            )}>
                                                <GraduationCap className="h-7 w-7" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 tracking-tight italic">{cls.name}</h3>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{cls.level}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" title="Options" className="h-10 w-10 rounded-xl hover:bg-gray-50 flex-shrink-0">
                                            <MoreVertical className="h-5 w-5 text-gray-400" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Capacité</span>
                                            <span className="text-lg font-black text-gray-900 leading-none">{cls.capacity}</span>
                                            <span className="text-[8px] font-bold text-gray-500">SIÈGES DISPO</span>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Année</span>
                                            <Badge variant="outline" className="text-[10px] font-black border-gray-200 mt-1">{cls.academicYear}</Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 h-12 rounded-2xl border-gray-100 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 gap-2">
                                            <Settings2 className="h-4 w-4" /> CONFIG
                                        </Button>
                                        <Button className="flex-1 h-12 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest gap-2">
                                            <BookOpen className="h-4 w-4" /> MATIÈRES <ArrowUpRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="subjects" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="rounded-[3rem] border-none shadow-sm bg-white p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                            <BookOpen className="h-64 w-64" />
                        </div>
                        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
                            <div className="h-24 w-24 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-inner group-hover:rotate-12 transition-transform">
                                <Sparkles className="h-10 w-10" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black italic tracking-tight text-gray-900">Intelligence Pédagogique</h2>
                                <p className="text-gray-500 font-medium leading-relaxed">
                                    Configurez les matières enseignées, connectez les enseignants experts et définissez les coefficients pour une analyse prédictive des résultats.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button className="h-14 px-8 bg-gray-900 hover:bg-black text-white rounded-2xl font-black gap-3 shadow-xl shadow-gray-200">
                                    <Plus className="h-5 w-5" /> CRÉER UNE MATIÈRE
                                </Button>
                                <Button variant="outline" className="h-14 px-8 rounded-2xl border-gray-200 font-black gap-3 hover:bg-gray-50">
                                    <BookOpen className="h-5 w-5" /> EXPORTER LE CATALOGUE
                                </Button>
                            </div>
                            
                            <div className="pt-12 grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    { label: 'Mathématiques', color: 'bg-blue-500' },
                                    { label: 'Français', color: 'bg-purple-500' },
                                    { label: 'Sciences', color: 'bg-emerald-500' },
                                    { label: 'Langues', color: 'bg-amber-500' },
                                ].map((sub, i) => (
                                    <div key={i} className="p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                                        <div className={cn("h-3 w-3 rounded-full", sub.color)}></div>
                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{sub.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ClassesPage;

