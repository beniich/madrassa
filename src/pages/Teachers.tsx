import { useState } from "react";
import {
    useTeachers,
    addTeacher,
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
import { Badge } from "@/components/ui/badge";
import { UserPlus, Search, Filter, Loader2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TeachersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const teachers = useTeachers();
    const classes = useClasses();

    const [newTeacher, setNewTeacher] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subjects: [] as string[],
        classIds: [] as string[],
        status: "active" as const,
    });

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeacher.firstName || !newTeacher.lastName || !newTeacher.email) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        try {
            await addTeacher({
                ...newTeacher,
                schoolId: 'demo_school',
                hireDate: new Date().toISOString(),
            });
            toast.success("Enseignant ajouté avec succès");
            setIsAddDialogOpen(false);
            setNewTeacher({ firstName: "", lastName: "", email: "", phone: "", subjects: [], classIds: [], status: "active" });
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    const filteredTeachers = teachers?.filter(t =>
        `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gestion des Enseignants</h1>
                    <p className="text-muted-foreground">Gérez le corps professoral et les affectations</p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 shadow-lg shadow-primary/20">
                            <UserPlus className="h-4 w-4" />
                            Nouvel Enseignant
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Ajouter un enseignant</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddTeacher} className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input
                                        id="firstName"
                                        value={newTeacher.firstName}
                                        onChange={e => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input
                                        id="lastName"
                                        value={newTeacher.lastName}
                                        onChange={e => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={newTeacher.phone}
                                    onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Enregistrer</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex gap-4 items-center bg-card p-4 rounded-xl border shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par nom ou email..."
                        className="pl-10 bg-muted/30"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Enseignant</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Matières</TableHead>
                            <TableHead>Classes</TableHead>
                            <TableHead>Statut</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeachers === undefined ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    Aucun enseignant trouvé.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <TableRow key={teacher.localId}>
                                    <TableCell className="font-medium">
                                        {teacher.firstName} {teacher.lastName}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="h-3 w-3" /> {teacher.email}
                                            </div>
                                            {teacher.phone && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3" /> {teacher.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.subjects.map(s => (
                                                <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {teacher.classIds.map(cId => (
                                                <Badge key={cId} variant="outline" className="text-[10px]">{cId}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'} className={cn(
                                            teacher.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' : ''
                                        )}>
                                            {teacher.status === 'active' ? 'Actif' : 'Inactif'}
                                        </Badge>
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

export default TeachersPage;
