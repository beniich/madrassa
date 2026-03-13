import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Activity, Settings as SettingsIcon } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import AboutTab from '@/components/profile/AboutTab';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
    Clock, 
    FileText, 
    MessageSquare, 
    LogOut, 
    Key, 
    Bell, 
    Globe,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';

const UserProfile: React.FC = () => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('about');

    // Données mockées pour le profil
    const [profileData, setProfileData] = useState({
        name: 'Ahmed Benali',
        role: 'Enseignant Principal',
        email: 'ahmed.benali@schoolgenius.com',
        location: 'Casablanca, Maroc',
        joinDate: 'Janvier 2023',
        department: 'Mathématiques',
        avatarUrl: '',
        bannerUrl: '',
        bio: 'Enseignant passionné avec plus de 10 ans d\'expérience dans l\'enseignement des mathématiques et des sciences.',
        phone: '+212 6 12 34 56 78',
        address: '123 Rue de la Liberté, Casablanca',
        website: 'https://ahmed-benali.com',
        birthDate: '1985-05-15',
        nationality: 'Marocaine',
    });

    const handleAvatarChange = (file: File) => {
        // Ici, vous implémenteriez l'upload vers le serveur
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData({ ...profileData, avatarUrl: reader.result as string });
            toast({
                title: 'Photo de profil mise à jour',
                description: 'Votre nouvelle photo a été téléchargée avec succès.',
            });
        };
        reader.readAsDataURL(file);
    };

    const handleBannerChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileData({ ...profileData, bannerUrl: reader.result as string });
            toast({
                title: 'Bannière mise à jour',
                description: 'Votre bannière a été téléchargée avec succès.',
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSaveAbout = (data: Partial<typeof profileData>) => {
        setProfileData({ ...profileData, ...data });
        toast({
            title: 'Profil enregistré',
            description: 'Vos informations ont été mises à jour avec succès.',
        });
    };

    return (
        <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            {/* Header */}
            <ProfileHeader
                name={profileData.name}
                role={profileData.role}
                email={profileData.email}
                location={profileData.location}
                joinDate={profileData.joinDate}
                department={profileData.department}
                avatarUrl={profileData.avatarUrl}
                bannerUrl={profileData.bannerUrl}
                onAvatarChange={handleAvatarChange}
                onBannerChange={handleBannerChange}
            />

            {/* Stats */}
            <ProfileStats
                stats={{
                    coursesCompleted: 12,
                    totalCourses: 18,
                    averageGrade: 85,
                    attendanceRate: 95,
                    projectsCompleted: 24,
                }}
            />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-white border">
                    <TabsTrigger value="about" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        À propos
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Activité récente
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        Paramètres
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                    <AboutTab
                        userData={{
                            bio: profileData.bio,
                            phone: profileData.phone,
                            email: profileData.email,
                            address: profileData.address,
                            website: profileData.website,
                            birthDate: profileData.birthDate,
                            nationality: profileData.nationality,
                        }}
                        onSave={handleSaveAbout}
                    />
                </TabsContent>

                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Flux d'activité</CardTitle>
                            <CardDescription>Vos dernières actions sur la plateforme</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', title: 'Connexion réussie', time: 'Il y a 2 heures', desc: 'Connexion depuis un nouvel appareil à Casablanca.' },
                                { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-50', title: 'Document envoyé', time: 'Hier à 14:30', desc: 'Vous avez partagé le relevé de notes "Classe 3A" avec la direction.' },
                                { icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50', title: 'Nouveau message', time: '10 Mars 2026', desc: 'Message envoyé à Mme. Laila concernant la prochaine réunion.' },
                                { icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50', title: 'Profil mis à jour', time: '08 Mars 2026', desc: 'Modification de la bio et des informations de contact.' },
                                { icon: LogOut, color: 'text-red-500', bg: 'bg-red-50', title: 'Déconnexion', time: '05 Mars 2026', desc: 'Session terminée sur PC-DESKTOP-01.' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 relative last:after:hidden after:absolute after:left-5 after:top-10 after:bottom-0 after:w-px after:bg-gray-100">
                                    <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center shrink-0 z-10 border border-white`}>
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <div className="pb-6">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                            <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded-full">{item.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-indigo-600">Voir tout l'historique</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Sécurité du compte</CardTitle>
                                    <CardDescription>Gérez votre mot de passe et vos sessions</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-pass">Mot de passe actuel</Label>
                                        <div className="relative">
                                            <Input id="current-pass" type="password" placeholder="••••••••" />
                                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3 text-slate-400">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-pass">Nouveau mot de passe</Label>
                                            <Input id="new-pass" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-pass">Confirmer le mot de passe</Label>
                                            <Input id="confirm-pass" type="password" />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button className="bg-indigo-600 hover:bg-indigo-700">Mettre à jour le mot de passe</Button>
                                    </div>
                                    
                                    <Separator className="my-6" />
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                                <Lock className="w-4 h-4 text-slate-400" />
                                                Double Authentification (2FA)
                                            </p>
                                            <p className="text-xs text-slate-500">Ajoute une couche de sécurité supplémentaire</p>
                                        </div>
                                        <Badge variant="outline" className="text-slate-400">Désactivé</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Préférences</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium">Notifications par email</span>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Activé</Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm font-medium">Profil Public</span>
                                        </div>
                                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border-none">Privé</Badge>
                                    </div>
                                    <Separator />
                                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                                        Supprimer le compte
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserProfile;
