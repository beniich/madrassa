import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Bell,
    Shield,
    Palette,
    Database,
    School,
    ImageIcon,
    Upload,
    RotateCcw,
    Languages,
    Phone,
    Mail
} from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolProfile, updateSchoolProfile } from "@/hooks/useOfflineData";

const Settings = () => {
    const { user } = useAuth();
    const schoolProfile = useSchoolProfile();

    // School Info State
    const [schoolName, setSchoolName] = useState("");
    const [schoolAddress, setSchoolAddress] = useState("");
    const [schoolPhone, setSchoolPhone] = useState("");
    const [schoolEmail, setSchoolEmail] = useState("");
    const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (schoolProfile) {
            setSchoolName(schoolProfile.name);
            setSchoolAddress(schoolProfile.address || "");
            setSchoolPhone(schoolProfile.phone || "");
            setSchoolEmail(schoolProfile.email || "");
            setSchoolLogo(schoolProfile.logo || null);
        }
    }, [schoolProfile]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSchoolLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSchool = async () => {
        if (!user?.schoolId) return;

        try {
            await updateSchoolProfile(user.schoolId, {
                name: schoolName,
                address: schoolAddress,
                phone: schoolPhone,
                email: schoolEmail,
                logo: schoolLogo || undefined
            });
            toast.success("Informations de l'établissement mises à jour !");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour.");
            console.error(error);
        }
    };

    const handleSave = (section: string) => {
        toast.success(`Paramètres ${section} sauvegardés avec succès !`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
                <p className="text-muted-foreground mt-2">
                    Gérez les configurations de votre compte et de l'établissement
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="w-full flex flex-wrap lg:grid lg:grid-cols-6 h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="profile" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Profil</span>
                    </TabsTrigger>
                    <TabsTrigger value="school" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <School className="h-4 w-4" />
                        <span className="hidden sm:inline">Établissement</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Sécurité</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <Palette className="h-4 w-4" />
                        <span className="hidden sm:inline">Apparence</span>
                    </TabsTrigger>
                    <TabsTrigger value="data" className="gap-2 flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border shadow-sm">
                        <Database className="h-4 w-4" />
                        <span className="hidden sm:inline">Données</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6 space-y-4">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Informations Personnelles
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Prénom</Label>
                                    <Input id="firstName" defaultValue={user?.firstName} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Nom</Label>
                                    <Input id="lastName" defaultValue={user?.lastName} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Professionnel</Label>
                                <Input id="email" type="email" defaultValue={user?.email} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rôle (Lecture seule)</Label>
                                <Input id="role" defaultValue={user?.role} disabled className="bg-muted" />
                            </div>
                            <Button onClick={() => handleSave("profil")} className="mt-2">Sauvegarder les modifications</Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="school" className="mt-6 space-y-4">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <School className="h-5 w-5 text-primary" />
                                Configuration de l'Établissement
                            </h3>
                            <Button variant="outline" size="sm" className="gap-2 focus-visible:ring-primary">
                                <RotateCcw className="h-4 w-4" />
                                Réinitialiser
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolName">Nom de l'école</Label>
                                        <Input
                                            id="schoolName"
                                            placeholder="Ex: École Al-Farabi"
                                            value={schoolName}
                                            onChange={(e) => setSchoolName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolEmail">Email de contact</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="schoolEmail"
                                                className="pl-10"
                                                placeholder="contact@ecole.ma"
                                                value={schoolEmail}
                                                onChange={(e) => setSchoolEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolPhone">Téléphone</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="schoolPhone"
                                                className="pl-10"
                                                placeholder="+212 5..."
                                                value={schoolPhone}
                                                onChange={(e) => setSchoolPhone(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="schoolAddress">Adresse physique</Label>
                                        <Input
                                            id="schoolAddress"
                                            placeholder="Adresse complète"
                                            value={schoolAddress}
                                            onChange={(e) => setSchoolAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Logo de l'établissement</Label>
                                    <div className="flex flex-col items-center gap-4 p-4 border rounded-xl bg-muted/10">
                                        <div className="h-32 w-32 rounded-xl border-2 border-dashed flex items-center justify-center bg-background overflow-hidden group hover:border-primary/50 transition-colors shadow-inner">
                                            {schoolLogo ? (
                                                <img src={schoolLogo} alt="Logo" className="h-full w-full object-contain p-2" />
                                            ) : (
                                                <ImageIcon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
                                            )}
                                        </div>
                                        <div className="w-full space-y-2">
                                            <input
                                                type="file"
                                                ref={logoInputRef}
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full gap-2"
                                                onClick={() => logoInputRef.current?.click()}
                                            >
                                                <Upload className="h-4 w-4" />
                                                Changer le logo
                                            </Button>
                                            <p className="text-[10px] text-muted-foreground text-center line-clamp-1">Format PNG, JPG ou SVG (Max 2Mo)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />
                            <Button onClick={handleSaveSchool} className="w-full shadow-lg shadow-primary/10">
                                Enregistrer les informations de l'établissement
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6 space-y-4">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Préférences de Notification
                        </h3>
                        <div className="space-y-4">
                            {[
                                { title: "Alertes Absence IA", desc: "Notification immédiate quand un élève dépasse 3 absences", checked: true },
                                { title: "Évolution des Notes", desc: "Alertes sur les baisses significatives de performances", checked: true },
                                { title: "Messages Direction", desc: "Recevoir les annonces globales de l'établissement", checked: true },
                                { title: "Mode Hors-ligne", desc: "Notifier quand la synchronisation est requise", checked: true }
                            ].map((notif, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-muted/5 hover:bg-muted/10 transition-colors">
                                    <div>
                                        <p className="font-medium">{notif.title}</p>
                                        <p className="text-sm text-muted-foreground">{notif.desc}</p>
                                    </div>
                                    <Switch defaultChecked={notif.checked} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6 space-y-4">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Sécurité du Compte
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                                <Input id="currentPassword" type="password" className="bg-muted/30 focus-visible:bg-background" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                    <Input id="newPassword" type="password" className="bg-muted/30 focus-visible:bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                    <Input id="confirmPassword" type="password" className="bg-muted/30 focus-visible:bg-background" />
                                </div>
                            </div>
                            <Button onClick={() => handleSave("sécurité")} className="mt-2">Changer le mot de passe</Button>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="mt-6 space-y-4">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            Personnalisation de l'Interface
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Mode Thème</p>
                                    <p className="text-sm text-muted-foreground">Basculer entre les modes Clair, Sombre et Système</p>
                                </div>
                                <div className="flex bg-muted p-1 rounded-lg">
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-md">Clair</Button>
                                    <Button variant="secondary" size="sm" className="h-8 px-3 rounded-md shadow-sm">Sombre</Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 rounded-md">Système</Button>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Languages className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Langue de l'interface</p>
                                        <p className="text-sm text-muted-foreground">Sélectionnez votre langue de préférence</p>
                                    </div>
                                </div>
                                <select className="bg-background border rounded-md p-2 text-sm focus:ring-2 focus:ring-primary outline-none transition-shadow">
                                    <option>Français (France)</option>
                                    <option>العربية (Maroc)</option>
                                    <option>English (UK)</option>
                                </select>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="data" className="mt-6 space-y-4">
                    <Card className="p-6 border-destructive/20 bg-destructive/5">
                        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-destructive">
                            <Database className="h-5 w-5" />
                            Gestion des Données (Zone Critique)
                        </h3>
                        <div className="space-y-6">
                            <div className="p-5 rounded-2xl border bg-yellow-500/10 border-yellow-500/20 shadow-sm shadow-yellow-500/5">
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-1 flex items-center gap-2">
                                    <Database className="h-4 w-4" />
                                    Sauvegarde Locale (IndexedDB)
                                </h4>
                                <p className="text-sm text-yellow-700/80 dark:text-yellow-400/80 mb-4">
                                    Vos données sont actuellement stockées sur cet appareil pour un accès hors-ligne.
                                    En vidant la base, vous forcerez une resynchronisation complète au prochain démarrage.
                                </p>
                                <Button variant="outline" className="bg-background border-yellow-500/50 text-yellow-700 hover:bg-yellow-500/10">
                                    Réinitialiser la base locale
                                </Button>
                            </div>

                            <div className="p-5 rounded-2xl border bg-destructive/10 border-destructive/20 shadow-sm shadow-destructive/5">
                                <h4 className="font-semibold text-destructive mb-1">Suppression du Compte</h4>
                                <p className="text-sm text-destructive/80 mb-4">
                                    Cette action supprimera définitivement vos accès et vos données de synchronisation.
                                    Les données de l'établissement ne seront pas affectées si vous n'êtes pas le dernier administrateur.
                                </p>
                                <Button variant="destructive" className="shadow-lg shadow-destructive/20">
                                    Désactiver mon compte
                                </Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
