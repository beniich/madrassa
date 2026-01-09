import React from 'react';
import { Camera, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProfileHeaderProps {
    name: string;
    role: string;
    email: string;
    location?: string;
    joinDate?: string;
    department?: string;
    avatarUrl?: string;
    bannerUrl?: string;
    onAvatarChange?: (file: File) => void;
    onBannerChange?: (file: File) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    name,
    role,
    email,
    location,
    joinDate,
    department,
    avatarUrl,
    bannerUrl,
    onAvatarChange,
    onBannerChange,
}) => {
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onAvatarChange) {
            onAvatarChange(file);
        }
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onBannerChange) {
            onBannerChange(file);
        }
    };

    return (
        <Card className="overflow-hidden border-0 shadow-lg">
            {/* Banner */}
            <div className="relative h-48 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
                {bannerUrl && (
                    <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <input
                    type="file"
                    id="banner-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleBannerUpload}
                />
                <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                    onClick={() => document.getElementById('banner-upload')?.click()}
                >
                    <Camera className="w-4 h-4 mr-2" />
                    Changer bannière
                </Button>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="avatar-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                        <button
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Camera className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="flex-1 pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                                <p className="text-lg text-gray-600 mt-1">{role}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline">Modifier profil</Button>
                                <Button>Partager</Button>
                            </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                            {email && (
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{email}</span>
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{location}</span>
                                </div>
                            )}
                            {department && (
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    <span>{department}</span>
                                </div>
                            )}
                            {joinDate && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Membre depuis {joinDate}</span>
                                </div>
                            )}
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 mt-4">
                            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                                ● En ligne
                            </Badge>
                            {department && (
                                <Badge variant="outline">{department}</Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProfileHeader;
