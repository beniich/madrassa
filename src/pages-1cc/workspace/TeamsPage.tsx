import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useWorkspaceStore, Team } from '@/stores/useWorkspaceStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui-1cc/card';
import { Button } from '@/components/ui-1cc/button';
import { Input } from '@/components/ui-1cc/input';
import { Label } from '@/components/ui-1cc/label';
import { Badge } from '@/components/ui-1cc/badge';
import { Plus, Users, Search, MoreHorizontal, Settings, Trash2, Edit } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui-1cc/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui-1cc/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui-1cc/avatar';
import { toast } from 'sonner';

export default function TeamsPage() {
    const { getActiveWorkspace, getWorkspaceTeams, addTeam, removeTeam } = useWorkspaceStore();
    const activeWorkspace = getActiveWorkspace();
    const teams = getWorkspaceTeams();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamColor, setNewTeamColor] = useState('#3b82f6');

    if (!activeWorkspace) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Veuillez sélectionner un workspace.</p>
                </div>
            </DashboardLayout>
        )
    }

    const filteredTeams = teams.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateTeam = () => {
        if (!newTeamName.trim()) {
            toast.error("Le nom de l'équipe est requis");
            return;
        }
        addTeam(activeWorkspace.id, {
            name: newTeamName,
            color: newTeamColor,
            members: [],
            icon: 'Users'
        });
        toast.success("Équipe créée avec succès");
        setNewTeamName('');
        setIsDialogOpen(false);
    };

    const handleDeleteTeam = (teamId: string) => {
        removeTeam(activeWorkspace.id, teamId);
        toast.success("Équipe supprimée");
    }

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Équipes</h1>
                        <p className="text-muted-foreground mt-1">
                            Gérez les équipes et les membres de {activeWorkspace.name}
                        </p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nouvelle Équipe
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Créer une nouvelle équipe</DialogTitle>
                                <DialogDescription>
                                    Ajoutez une nouvelle équipe à votre workspace pour organiser vos collaborateurs.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom de l'équipe</Label>
                                    <Input id="name" placeholder="Ex: Chirurgie A" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Couleur</Label>
                                    <div className="flex gap-2">
                                        {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899', '#64748b'].map(color => (
                                            <button
                                                key={color}
                                                className={`w-6 h-6 rounded-full border-2 ${newTeamColor === color ? 'border-primary' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewTeamColor(color)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                                <Button onClick={handleCreateTeam}>Créer</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher une équipe..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map(team => (
                        <Card key={team.id} className="hover:shadow-md transition-shadow relative group">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: team.color }}>
                                            {team.name.substring(0, 1)}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{team.name}</CardTitle>
                                            <CardDescription>{team.members.length} membres</CardDescription>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Modifier</DropdownMenuItem>
                                            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Permissions</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteTeam(team.id)}>
                                                <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex -space-x-2 overflow-hidden py-2">
                                    {[...Array(Math.min(team.members.length + 2, 5))].map((_, i) => (
                                        <Avatar key={i} className="inline-block border-2 border-background h-8 w-8">
                                            <AvatarFallback className="bg-muted text-[10px]">U{i}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {/* Fake avatars for demo */}
                                    {team.members.length === 0 && (
                                        <p className="text-sm text-muted-foreground italic">Aucun membre assigné</p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                <Button variant="outline" size="sm" className="w-full">Gérer l'équipe</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
