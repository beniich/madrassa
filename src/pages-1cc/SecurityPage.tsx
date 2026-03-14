
import { useState } from "react";
import { MultiTenantHeader } from "@/components/MultiTenantHeader";
import { AuditLogViewer } from "@/components/audit/AuditLogViewer";
import { SecurityOverview } from "@/components/audit/SecurityOverview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { ShieldAlert, UserCog, Edit, Save } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui-1cc/table";
import { Button } from "@/components/ui-1cc/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui-1cc/dialog";
import { Input } from "@/components/ui-1cc/input";
import { Label } from "@/components/ui-1cc/label";
import { Badge } from "@/components/ui-1cc/badge";
import { toast } from "@/hooks-1cc/use-toast";

const SecurityPage = () => {
    const [roles, setRoles] = useState([
        { id: 1, name: 'Administrateur', access: 'Accès complet', users: 3 },
        { id: 2, name: 'Médecin', access: 'Dossiers patients, Prescriptions', users: 12 },
        { id: 3, name: 'Infirmier', access: 'Soins, Constantes', users: 24 },
        { id: 4, name: 'Secrétaire', access: 'Agenda, Facturation', users: 5 },
    ]);
    const [editingRole, setEditingRole] = useState<any>(null);

    const handleSaveRole = () => {
        setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
        setEditingRole(null);
        toast({ title: "Profil mis à jour", description: `Les droits pour ${editingRole.name} ont été modifiés.` });
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-background/50">
                <MultiTenantHeader />

                <div className="p-6 md:p-8 space-y-8 flex-1 max-w-[1600px] mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <ShieldAlert className="h-8 w-8 text-primary" />
                                Centre de Sécurité
                            </h1>
                            <p className="text-muted-foreground">Surveillance en temps réel, audits et conformité RGPD.</p>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList className="bg-background/95 backdrop-blur-sm border border-border/50">
                            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                            <TabsTrigger value="logs">Journal d'Audit</TabsTrigger>
                            <TabsTrigger value="access">Gestion des Accès</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6 animate-fade-in">
                            <SecurityOverview />
                        </TabsContent>

                        <TabsContent value="logs" className="space-y-6 animate-fade-in">
                            <AuditLogViewer />
                        </TabsContent>

                        <TabsContent value="access" className="space-y-6 animate-fade-in">
                            <div className="bg-card rounded-xl border shadow-sm">
                                <div className="p-6 border-b">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <UserCog className="h-5 w-5 text-primary" />
                                        Gestion des Rôles et Profils
                                    </h3>
                                    <p className="text-muted-foreground text-sm">Définissez les permissions pour chaque type de personnel.</p>
                                </div>
                                <div className="p-6">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Rôle</TableHead>
                                                <TableHead>Niveau d'Accès</TableHead>
                                                <TableHead>Utilisateurs</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {roles.map((role) => (
                                                <TableRow key={role.id}>
                                                    <TableCell className="font-medium">{role.name}</TableCell>
                                                    <TableCell><Badge variant="outline">{role.access}</Badge></TableCell>
                                                    <TableCell>{role.users} actifs</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}>
                                                            <Edit className="h-4 w-4 mr-2" /> Modifier
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <Dialog open={!!editingRole} onOpenChange={(open) => !open && setEditingRole(null)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Modifier le Profil: {editingRole?.name}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Nom du Rôle</Label>
                                            <Input
                                                value={editingRole?.name || ''}
                                                onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Permissions (Description)</Label>
                                            <Input
                                                value={editingRole?.access || ''}
                                                onChange={(e) => setEditingRole({ ...editingRole, access: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleSaveRole}>
                                            <Save className="h-4 w-4 mr-2" /> Enregistrer les droits
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
};

export default SecurityPage;
