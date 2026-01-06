import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Upload, X, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useConfig } from '@/contexts/ConfigContext';
import { updateSchoolProfile, uploadLogo, removeLogo } from '@/services/configService';

export const Settings = () => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const { schoolProfile, refreshConfig, isLoading: configLoading } = useConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [schoolName, setSchoolName] = useState('');
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    // Charger les données initiales
    useEffect(() => {
        if (schoolProfile) {
            setSchoolName(schoolProfile.name || '');
            setLogoPreview(schoolProfile.logo || '');
        }
    }, [schoolProfile]);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingLogo(true);
            await uploadLogo(file);
            await refreshConfig();
            toast({
                title: t('settings.success'),
                description: t('settings.logoUpdated'),
            });
        } catch (error) {
            toast({
                title: t('settings.error'),
                description: error instanceof Error ? error.message : t('settings.uploadFailed'),
                variant: 'destructive',
            });
        } finally {
            setIsUploadingLogo(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveLogo = async () => {
        try {
            setIsUploadingLogo(true);
            await removeLogo();
            await refreshConfig();
            toast({
                title: t('settings.success'),
                description: t('settings.logoRemoved'),
            });
        } catch (error) {
            toast({
                title: t('settings.error'),
                description: t('settings.removeFailed'),
                variant: 'destructive',
            });
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSaveName = async () => {
        try {
            setIsSaving(true);
            await updateSchoolProfile({ name: schoolName });
            await refreshConfig();
            toast({
                title: t('settings.success'),
                description: t('settings.nameUpdated'),
            });
        } catch (error) {
            toast({
                title: t('settings.error'),
                description: t('settings.saveFailed'),
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    if (configLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('common.settings')}</h1>
                <p className="text-gray-600 mt-1">{t('settings.description')}</p>
            </div>

            {/* School Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        {t('settings.schoolInfo')}
                    </CardTitle>
                    <CardDescription>{t('settings.schoolInfoDesc')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Logo Section */}
                    <div className="space-y-4">
                        <Label>{t('settings.schoolLogo')}</Label>
                        <div className="flex items-start gap-6">
                            {/* Logo Preview */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="School Logo"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Upload Controls */}
                            <div className="flex-1 space-y-3">
                                <p className="text-sm text-gray-600">
                                    {t('settings.logoHint')}
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={isUploadingLogo}
                                        variant="outline"
                                    >
                                        {isUploadingLogo ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                {t('settings.uploading')}
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4 mr-2" />
                                                {t('settings.uploadLogo')}
                                            </>
                                        )}
                                    </Button>
                                    {logoPreview && (
                                        <Button
                                            type="button"
                                            onClick={handleRemoveLogo}
                                            disabled={isUploadingLogo}
                                            variant="outline"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            {t('settings.removeLogo')}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* School Name */}
                    <div className="space-y-2">
                        <Label htmlFor="schoolName">{t('settings.schoolName')}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="schoolName"
                                type="text"
                                value={schoolName}
                                onChange={(e) => setSchoolName(e.target.value)}
                                placeholder={t('settings.schoolNamePlaceholder')}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSaveName}
                                disabled={isSaving || schoolName === schoolProfile?.name}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t('settings.saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {t('settings.save')}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Language Section */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.language')}</CardTitle>
                    <CardDescription>{t('settings.languageDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600">
                        {t('settings.languageSwitcher')}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
