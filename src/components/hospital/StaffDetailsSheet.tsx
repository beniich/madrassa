
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui-1cc/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-1cc/tabs";
import { Staff } from "@/stores/useHospitalStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-1cc/avatar";
import { Badge } from "@/components/ui-1cc/badge";
import { Button } from "@/components/ui-1cc/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Separator } from "@/components/ui-1cc/separator";
import {
    Briefcase,
    Calendar,
    CreditCard,
    FileText,
    Mail,
    MapPin,
    Phone,
    Shield,
    Stethoscope,
    User,
    Heart,
    Clock,
    Download,
    Upload,
    AlertCircle,
    Plus,
    Edit,
    Save,
    X,
    Camera
} from "lucide-react";
import { useState, useEffect } from "react";
import { LeaveRequestDialog } from "@/components/hospital/LeaveRequestDialog";
import { useHospitalStore } from "@/stores/useHospitalStore";
import { Input } from "@/components/ui-1cc/input";
import { Textarea } from "@/components/ui-1cc/textarea";
import { toast } from "@/hooks-1cc/use-toast";
import { TimeTrackingPanel } from "@/components/hospital/TimeTrackingPanel";
import { PayrollSummary } from "@/components/hospital/PayrollSummary";
import { CareerDevelopment } from "@/components/hospital/CareerDevelopment";
import { generateStaffFullFilePDF, generateWorkCertificatePDF, generateEmploymentContractPDF } from "@/lib/pdfGenerator";

interface StaffDetailsSheetProps {
    staff: Staff | null;
    isOpen: boolean;
    onClose: () => void;
}

export function StaffDetailsSheet({ staff, isOpen, onClose }: StaffDetailsSheetProps) {
    const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedStaff, setEditedStaff] = useState(staff);
    const { updateStaff, timeEntries } = useHospitalStore();

    if (!staff) return null;

    // Update local state when staff prop changes
    useEffect(() => {
        setEditedStaff(staff);
    }, [staff]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setEditedStaff((prev) => ({ ...prev!, avatar: base64 }));
                if (!isEditMode) {
                    updateStaff(staff.id, { avatar: base64 });
                    toast({
                        title: "Photo mise à jour",
                        description: "Votre photo de profil a été modifiée.",
                        className: "bg-green-600 text-white"
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (editedStaff) {
            updateStaff(staff.id, editedStaff);
            setIsEditMode(false);
            toast({
                title: "Profil mis à jour",
                description: "Les modifications ont été enregistrées.",
                className: "bg-green-600 text-white"
            });
        }
    };

    const handleCancel = () => {
        setEditedStaff(staff);
        setIsEditMode(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Avatar className="h-16 w-16 border-2 border-primary/20">
                                    <AvatarImage src={editedStaff?.avatar} />
                                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                        {staff.name.split(" ").map((n) => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="h-6 w-6 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handlePhotoUpload}
                                    />
                                </label>
                            </div>
                            <div>
                                <SheetTitle className="text-2xl font-bold text-foreground">{staff.name}</SheetTitle>
                                <SheetDescription className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-primary border-primary/20">
                                        {staff.role === "Doctor" ? (
                                            <Stethoscope className="h-3 w-3 mr-1" />
                                        ) : (
                                            <Shield className="h-3 w-3 mr-1" />
                                        )}
                                        {staff.role}
                                    </Badge>
                                    {staff.specialty && (
                                        <Badge variant="secondary" className="font-normal">
                                            {staff.specialty}
                                        </Badge>
                                    )}
                                </SheetDescription>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 justify-end">
                                {isEditMode ? (
                                    <>
                                        <Button size="sm" variant="outline" onClick={handleCancel}>
                                            <X className="h-4 w-4 mr-1" /> Annuler
                                        </Button>
                                        <Button size="sm" onClick={handleSave}>
                                            <Save className="h-4 w-4 mr-1" /> Enregistrer
                                        </Button>
                                    </>
                                ) : (
                                    <Button size="sm" variant="outline" onClick={() => setIsEditMode(true)}>
                                        <Edit className="h-4 w-4 mr-1" /> Modifier
                                    </Button>
                                )}
                            </div>
                            {!isEditMode && (
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="gap-2"
                                    onClick={() => generateStaffFullFilePDF(staff, { timeEntries: timeEntries.filter(e => e.staffId === staff.id) })}
                                >
                                    <Download className="h-4 w-4" /> Exporter Dossier
                                </Button>
                            )}
                        </div>
                    </div>
                </SheetHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto pb-px mb-6 bg-transparent border-b h-auto rounded-none p-0 gap-6">
                        <TabsTrigger
                            value="general"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Info. Générales
                        </TabsTrigger>
                        <TabsTrigger
                            value="career"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Carrière & Contrats
                        </TabsTrigger>
                        <TabsTrigger
                            value="documents"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Documents
                        </TabsTrigger>
                        <TabsTrigger
                            value="absences"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Absences
                        </TabsTrigger>
                        <TabsTrigger
                            value="time"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Pointage
                        </TabsTrigger>
                        <TabsTrigger
                            value="payroll"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Paie
                        </TabsTrigger>
                        <TabsTrigger
                            value="career"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                        >
                            Carrière
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: GENERAL */}
                    <TabsContent value="general" className="space-y-6 animate-fade-in">
                        {/* Contact Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" /> État Civil & Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Email Professionnel</p>
                                        {isEditMode ? (
                                            <Input
                                                value={editedStaff?.email || ''}
                                                onChange={(e) => setEditedStaff({ ...editedStaff!, email: e.target.value })}
                                                className="h-8"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Mail className="h-3 w-3 text-muted-foreground" /> {staff.email}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Téléphone</p>
                                        {isEditMode ? (
                                            <Input
                                                value={editedStaff?.phone || ''}
                                                onChange={(e) => setEditedStaff({ ...editedStaff!, phone: e.target.value })}
                                                className="h-8"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Phone className="h-3 w-3 text-muted-foreground" /> {staff.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">Adresse Personnelle</p>
                                    {isEditMode ? (
                                        <Textarea
                                            value={editedStaff?.address || ''}
                                            onChange={(e) => setEditedStaff({ ...editedStaff!, address: e.target.value })}
                                            className="min-h-[60px]"
                                            placeholder="Adresse complète"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {staff.address || "Non renseignée - 12 Rue de l'Exemple, 75000 Paris"}
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">N° Sécurité Sociale</p>
                                        <p className="text-sm font-mono">{staff.socialSecurityNumber || "1 85 05 75 042 045 22"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Date de Naissance</p>
                                        <p className="text-sm">{staff.dateOfBirth || "12/05/1985 (39 ans)"}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Emergency Contact */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-red-500" /> Contact d'Urgence
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 pt-1">
                                {staff.emergencyContact ? (
                                    <div className="flex justify-between items-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">
                                        <div>
                                            <p className="font-medium text-sm">{staff.emergencyContact.name}</p>
                                            <p className="text-xs text-muted-foreground">{staff.emergencyContact.relation}</p>
                                        </div>
                                        <div className="font-mono text-sm font-medium">{staff.emergencyContact.phone}</div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
                                        <AlertCircle className="h-4 w-4" /> Aucun contact d'urgence renseigné.
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Bank Info */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-primary" /> Coordonnées Bancaires
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-dashed">
                                    <p className="text-xs text-muted-foreground mb-1">IBAN</p>
                                    <p className="font-mono text-sm tracking-widest">{staff.bankInfo?.iban || "FR76 1234 5678 9012 3456 7890 123"}</p>
                                    <div className="mt-2 flex justify-between">
                                        <div>
                                            <p className="text-xs text-muted-foreground">BIC</p>
                                            <p className="font-mono text-sm">{staff.bankInfo?.bic || "ABCDEFRP"}</p>
                                        </div>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Vérifié</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* TAB: CAREER */}
                    <TabsContent value="career" className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Ancienneté</p>
                                        <p className="text-2xl font-bold text-primary">3 Ans</p>
                                        <p className="text-xs text-muted-foreground">Depuis le {staff.joinDate || "01/03/2021"}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground mb-1">Type de Contrat</p>
                                        <p className="text-2xl font-bold text-blue-600">CDI</p>
                                        <p className="text-xs text-muted-foreground">Temps Plein</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Historique des Contrats
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 pl-6 py-2">
                                    <div className="relative">
                                        <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-950"></span>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-semibold">Contrat Durée Indéterminée (CDI)</h4>
                                                <p className="text-xs text-muted-foreground">Médecin Titulaire</p>
                                            </div>
                                            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">En cours</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Depuis le 01/01/2022 • 55k€ / an</p>
                                    </div>
                                    <div className="relative opacity-70">
                                        <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-slate-300 border-2 border-white dark:border-slate-950"></span>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-semibold">Contrat Durée Déterminée (CDD)</h4>
                                                <p className="text-xs text-muted-foreground">Remplacement</p>
                                            </div>
                                            <span className="text-xs font-mono text-muted-foreground">Terminé</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">01/03/2021 - 31/12/2021</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4 mt-4">
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-primary/20 hover:bg-primary/5"
                                onClick={() => generateWorkCertificatePDF(staff)}
                            >
                                <FileText className="h-4 w-4 text-primary" /> Générer Certificat
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 gap-2 border-primary/20 hover:bg-primary/5"
                                onClick={() => generateEmploymentContractPDF(staff)}
                            >
                                <Briefcase className="h-4 w-4 text-primary" /> Générer Contrat (Type)
                            </Button>
                        </div>
                    </TabsContent>

                    {/* TAB: DOCUMENTS */}
                    <TabsContent value="documents" className="space-y-6 animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-sm">Pièces jointes (4)</h3>
                            <Button size="sm" variant="outline" className="gap-2">
                                <Upload className="h-4 w-4" /> Ajouter
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {[
                                { name: "Contrat_Travail_Signé.pdf", date: "01/01/2022", size: "2.4 MB" },
                                { name: "Carte_Identité_RectoVerso.pdf", date: "15/02/2021", size: "1.1 MB" },
                                { name: "Diplome_Doctorat.pdf", date: "15/02/2021", size: "3.5 MB" },
                                { name: "RIB.pdf", date: "01/03/2021", size: "450 KB" }
                            ].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border rounded-lg hover:border-primary/50 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-red-50 text-red-600 rounded flex items-center justify-center">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{doc.name}</p>
                                            <p className="text-xs text-muted-foreground">{doc.date} • {doc.size}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="group-hover:text-primary">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* TAB: ABSENCES */}
                    <TabsContent value="absences" className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                                <CardContent className="pt-6 text-center">
                                    <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Congés Payés</h3>
                                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">18.5</p>
                                    <p className="text-xs text-blue-600">jours restants</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-purple-50/50 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/30">
                                <CardContent className="pt-6 text-center">
                                    <h3 className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">RTT</h3>
                                    <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">4.0</p>
                                    <p className="text-xs text-purple-600">jours restants</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30">
                                <CardContent className="pt-6 text-center">
                                    <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">Maladie</h3>
                                    <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">2</p>
                                    <p className="text-xs text-orange-600">jours pris (2024)</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Button
                            className="w-full gap-2"
                            onClick={() => setIsLeaveDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4" /> Demander un Congé
                        </Button>

                        <LeaveRequestDialog
                            staffId={staff.id}
                            staffName={staff.name}
                            isOpen={isLeaveDialogOpen}
                            onClose={() => setIsLeaveDialogOpen(false)}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> Dernières Absences
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    <li className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                            <span>Congés Payés</span>
                                        </div>
                                        <span className="text-muted-foreground">15 Août - 30 Août 2024</span>
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Validé</Badge>
                                    </li>
                                    <li className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                                            <span>RTT</span>
                                        </div>
                                        <span className="text-muted-foreground">12 Juillet 2024</span>
                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Validé</Badge>
                                    </li>
                                </ul>
                                <Button className="w-full mt-4" variant="outline">Voir tout l'historique</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="time" className="space-y-6 animate-fade-in">
                        <TimeTrackingPanel staffId={staff.id} staffName={staff.name} />
                    </TabsContent>

                    <TabsContent value="payroll" className="space-y-6 animate-fade-in">
                        <PayrollSummary staffId={staff.id} />
                    </TabsContent>

                    <TabsContent value="career" className="space-y-6 animate-fade-in">
                        <CareerDevelopment staffId={staff.id} />
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet >
    );
}
