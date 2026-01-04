import { useState } from "react";
import {
    useStudents,
    addStudent,
    deleteStudent,
    useClasses
} from "@/hooks/useOfflineData";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Search, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClass, setSelectedClass] = useState<string>("all");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Offline Hooks
    const students = useStudents(selectedClass === "all" ? undefined : selectedClass);
    const classes = useClasses();

    // Form State
    const [newStudent, setNewStudent] = useState({
        firstName: "",
        lastName: "",
        classId: "",
        status: "active" as const,
    });

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudent.firstName || !newStudent.lastName || !newStudent.classId) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            await addStudent({
                ...newStudent,
                schoolId: 'demo_school',
                dateOfBirth: new Date().toISOString(),
                enrollmentDate: new Date().toISOString(),
            });
            toast.success("Élève ajouté avec succès (sync en attente)");
            setIsAddDialogOpen(false);
            setNewStudent({ firstName: "", lastName: "", classId: "", status: "active" });
        } catch (error) {
            toast.error("Erreur lors de l'ajout de l'élève");
        }
    };

    const handleDeleteStudent = async (localId: string) => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet élève ?")) {
            try {
                await deleteStudent(localId);
                toast.success("Élève supprimé");
            } catch (error) {
                toast.error("Erreur lors de la suppression");
            }
        }
    };

    const filteredStudents = students?.filter(s =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestion des Élèves</h1>
                    <p className="text-muted-foreground">Consultez et gérez la liste des élèves de l'établissement</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
                            <UserPlus className="h-4 w-4" />
                            Inscrire un élève
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Inscription d'un nouvel élève</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        value={newStudent.firstName}
                                        onChange={e => setNewStudent({ ...newStudent, firstName: e.target.value })}
                                        placeholder="Ex: Ahmed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        value={newStudent.lastName}
                                        onChange={e => setNewStudent({ ...newStudent, lastName: e.target.value })}
                                        placeholder="Ex: Benali"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Classe</Label>
                                <Select
                                    value={newStudent.classId}
                                    onValueChange={val => setNewStudent({ ...newStudent, classId: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une classe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes?.map(c => (
                                            <SelectItem key={c.localId} value={c.localId}>{c.name}</SelectItem>
                                        ))}
                                        {(!classes || classes.length === 0) && (
                                            <SelectItem value="demo_class">Classe Démo 4B</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">Enregistrer l'élève</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters and search */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom ou prénom..."
                        className="pl-10 bg-muted/30 focus-visible:bg-background transition-colors"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-[180px] bg-muted/30">
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
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold">Nom de l'élève</TableHead>
                            <TableHead className="font-semibold">Classe</TableHead>
                            <TableHead className="font-semibold">Statut Sync</TableHead>
                            <TableHead className="font-semibold">Statut</TableHead>
                            <TableHead className="text-right font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents === undefined ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <div className="flex justify-center items-center gap-2 text-muted-foreground font-medium">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        Chargement des données locales...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredStudents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                    Aucun élève trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredStudents.map((student) => (
                                <TableRow key={student.localId} className="hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-medium">
                                        {student.firstName} {student.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-background">
                                            {student.classId}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "flex items-center gap-1.5 w-fit",
                                            student.syncStatus === 'synced' ? 'bg-green-500/10 border-green-500/20 text-green-600' :
                                                student.syncStatus === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' :
                                                    'bg-destructive/10 border-destructive/20 text-destructive'
                                        )}>
                                            <span className={cn(
                                                "h-1.5 w-1.5 rounded-full",
                                                student.syncStatus === 'synced' ? "bg-green-500" :
                                                    student.syncStatus === 'pending' ? "bg-yellow-500" : "bg-destructive"
                                            )} />
                                            {student.syncStatus === 'synced' ? 'Synchronisé' : 'En attente'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className={cn(
                                            student.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : ''
                                        )}>
                                            {student.status === 'active' ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            onClick={() => handleDeleteStudent(student.localId)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default StudentsPage;
