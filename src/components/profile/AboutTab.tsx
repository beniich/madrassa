import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, MapPin, Globe, Calendar, User, Save } from 'lucide-react';

interface AboutTabProps {
    userData?: {
        bio?: string;
        phone?: string;
        email?: string;
        address?: string;
        website?: string;
        birthDate?: string;
        nationality?: string;
    };
    onSave?: (data: any) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ userData = {}, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        bio: userData.bio || '',
        phone: userData.phone || '',
        email: userData.email || '',
        address: userData.address || '',
        website: userData.website || '',
        birthDate: userData.birthDate || '',
        nationality: userData.nationality || '',
    });

    const handleSave = () => {
        if (onSave) {
            onSave(formData);
        }
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>À propos</CardTitle>
                        <Button
                            variant={isEditing ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        >
                            {isEditing ? (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                </>
                            ) : (
                                'Modifier'
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Bio */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Biographie
                        </Label>
                        {isEditing ? (
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Parlez-nous de vous..."
                                rows={4}
                            />
                        ) : (
                            <p className="text-gray-700">
                                {formData.bio || 'Aucune biographie ajoutée'}
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.email || 'Non renseigné'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Téléphone
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.phone || 'Non renseigné'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Adresse
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.address || 'Non renseignée'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Site web
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="website"
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.website || 'Non renseigné'}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="birthDate" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date de naissance
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.birthDate || 'Non renseignée'}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nationality">Nationalité</Label>
                                {isEditing ? (
                                    <Input
                                        id="nationality"
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    />
                                ) : (
                                    <p className="text-gray-700">{formData.nationality || 'Non renseignée'}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AboutTab;
