import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Activity, Settings as SettingsIcon } from 'lucide-react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import AboutTab from '@/components/profile/AboutTab';
import { useToast } from '@/hooks/use-toast';

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

    const handleSaveAbout = (data: any) => {
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
                    <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Activité récente à venir</p>
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
                        <SettingsIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>Paramètres du profil à venir</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default UserProfile;
