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
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ClassesPage = () => {
    const classes = useClasses();
    const [isAddClassOpen, setIsAddClassOpen] = useState(false);
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
            toast.success("Classe créée avec succès");
            setIsAddClassOpen(false);
            setNewClass({ name: "", level: "", academicYear: "2024-2025", capacity: 30 });
        } catch (error) {
            toast.error("Erreur lors de la création");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Classes et Matières</h1>
                    <p className="text-muted-foreground">Gérez les structures pédagogiques de l'établissement</p>
                </div>
            </div>

            <Tabs defaultValue="classes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="classes" className="gap-2">
                        <School className="h-4 w-4" />
                        Classes
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="gap-2">
                        <BookOpen className="h-4 w-4" />
                        Matières
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="mt-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Toutes les Classes
                        </h2>
                        <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nouvelle Classe
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Créer une nouvelle classe</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddClass} className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="className">Nom de la classe (ex: 4ème B)</Label>
                                        <Input
                                            id="className"
                                            value={newClass.name}
                                            onChange={e => setNewClass({ ...newClass, name: e.target.value })}
                                            placeholder="Ex: 4B"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="level">Niveau</Label>
                                        <Input
                                            id="level"
                                            value={newClass.level}
                                            onChange={e => setNewClass({ ...newClass, level: e.target.value })}
                                            placeholder="Ex: 4ème année"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="capacity">Capacité max</Label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                value={newClass.capacity}
                                                onChange={e => setNewClass({ ...newClass, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Année Académique</Label>
                                            <Input
                                                id="year"
                                                value={newClass.academicYear}
                                                onChange={e => setNewClass({ ...newClass, academicYear: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full">Créer la classe</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {classes === undefined ? (
                            <div className="col-span-full h-24 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : classes.length === 0 ? (
                            <Card className="col-span-full p-12 text-center text-muted-foreground border-dashed border-2">
                                Aucune classe enregistrée.
                            </Card>
                        ) : (
                            classes.map((cls) => (
                                <Card key={cls.localId} className="p-5 hover:shadow-lg transition-all group border-primary/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{cls.name}</h3>
                                                <p className="text-xs text-muted-foreground">{cls.level}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Capacité</span>
                                            <span className="font-semibold">{cls.capacity} élèves</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Année</span>
                                            <Badge variant="outline" className="text-[10px]">{cls.academicYear}</Badge>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                                            <Settings2 className="h-3 w-3" /> Configurer
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 text-xs gap-1.5">
                                            <BookOpen className="h-3 w-3" /> Matières
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="subjects" className="mt-6">
                    <Card className="p-8 text-center text-muted-foreground border-dashed border-2">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Catalogue des Matières</h3>
                        <p className="max-w-md mx-auto mb-6"> Configurez les matières enseignées, leurs coefficients et les enseignants responsables.</p>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Créer une matière
                        </Button>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ClassesPage;
