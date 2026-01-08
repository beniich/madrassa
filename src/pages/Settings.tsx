import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Building2,
    Upload,
    X,
    Save,
    Loader2,
    Image as ImageIcon,
    Palette,
    Bell,
    Shield,
    Database,
    Users,
    CreditCard,
    Network,
    Cpu,
    Code2,
    Search,
    Download,
    Upload as UploadIcon,
    Copy,
    RotateCcw,
    LayoutTemplate,
    AlertCircle,
    Check,
    FileJson,
    FileCode,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useConfig } from '@/contexts/ConfigContext';
import { updateSchoolProfile, uploadLogo, removeLogo } from '@/services/configService';
import {
    AllSettings,
    TabType,
    SearchResult,
    SettingsPreset,
} from '@/types/settings';
import {
    getDefaultSettings,
    loadSettingsFromLocalStorage,
    saveSettingsToLocalStorage,
    exportToJSON,
    exportToYAML,
    downloadSettings,
    copySettingsToClipboard,
    importSettings,
    searchSettings,
} from '@/lib/settingsUtils';

import { SettingItem } from '@/components/settings/SettingItem';
import { ToggleWithIcon } from '@/components/settings/ToggleWithIcon';
import { PermissionItem } from '@/components/settings/PermissionItem';
import { PresetsPanel } from '@/components/settings/PresetsPanel';

export const Settings = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const { schoolProfile, refreshConfig, isLoading: configLoading } = useConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const importInputRef = useRef<HTMLInputElement>(null);

    const [activeTab, setActiveTab] = useState<TabType>('general');
    const [settings, setSettings] = useState<Partial<AllSettings>>(getDefaultSettings());
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const [schoolInfo, setSchoolInfo] = useState({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        academicYear: '',
        principalName: '',
        principalEmail: '',
    });

    const [logoPreview, setLogoPreview] = useState<string>('');
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [activePresetId, setActivePresetId] = useState<string | null>(null);

    const [permissions, setPermissions] = useState([
        { id: 'p1', name: 'Voir les élèves', description: 'Accès en lecture seule à la liste des élèves', category: 'students', enabled: true },
        { id: 'p2', name: 'Modifier les élèves', description: 'Créer, modifier et supprimer des fiches élèves', category: 'students', enabled: false },
        { id: 'p3', name: 'Gérer les notes', description: 'Saisir et modifier les notes des examens', category: 'grades', enabled: true },
        { id: 'p4', name: 'Accès financier', description: 'Voir les paiements et factures', category: 'finance', enabled: false },
        { id: 'p5', name: 'Configuration système', description: 'Accès complet aux paramètres', category: 'administration', enabled: false },
    ]);

    useEffect(() => {
        const loadedSettings = loadSettingsFromLocalStorage();
        setSettings(loadedSettings);
    }, []);

    useEffect(() => {
        if (schoolProfile) {
            setSchoolInfo({
                name: schoolProfile.name || '',
                address: schoolProfile.address || '',
                city: schoolProfile.city || '',
                postalCode: schoolProfile.postalCode || '',
                country: schoolProfile.country || '',
                phone: schoolProfile.phone || '',
                email: schoolProfile.email || '',
                website: schoolProfile.website || '',
                academicYear: schoolProfile.academicYear || '',
                principalName: schoolProfile.principalName || '',
                principalEmail: schoolProfile.principalEmail || '',
            });
            setLogoPreview(schoolProfile.logo || '');
        }
    }, [schoolProfile]);

    useEffect(() => {
        if (searchQuery.length > 1) {
            const results = searchSettings(searchQuery, settings, t);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, settings, t]);

    const handleSettingChange = (category: keyof AllSettings, key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value,
            },
        }));
        setIsDirty(true);
        if (category === 'appearance' && key === 'language') {
            i18n.changeLanguage(value);
        }
    };

    const handleSchoolInfoChange = (key: string, value: string) => {
        setSchoolInfo((prev) => ({ ...prev, [key]: value }));
        setIsDirty(true);
    };

    const handleSaveAll = async () => {
        try {
            setIsSaving(true);
            await updateSchoolProfile(schoolInfo);
            saveSettingsToLocalStorage(settings);
            await refreshConfig();
            setSaveSuccess(true);
            setIsDirty(false);
            setTimeout(() => setSaveSuccess(false), 3000);
            toast({ title: t('settings.success'), description: t('settings.actions.allSettingsSaved') });
        } catch (error) {
            toast({ title: t('settings.error'), description: t('settings.actions.saveFailed'), variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        if (confirm(t('settings.confirmReset'))) {
            const defaults = getDefaultSettings();
            setSettings(defaults);
            saveSettingsToLocalStorage(defaults);
            toast({ title: t('settings.success'), description: t('settings.settingsReset') });
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const imported = await importSettings(file);
            setSettings((prev) => ({ ...prev, ...imported }));
            setIsDirty(true);
            toast({ title: t('settings.success'), description: 'Configuration importée avec succès' });
        } catch (error) {
            toast({ title: t('settings.error'), description: 'Erreur lors de l\'importation', variant: 'destructive' });
        }
        if (importInputRef.current) importInputRef.current.value = '';
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploadingLogo(true);
            await uploadLogo(file);
            await refreshConfig();
            toast({ title: t('settings.success'), description: t('settings.logoUpdated') });
        } catch (error) {
            toast({ variant: 'destructive', title: t('settings.error'), description: t('settings.uploadFailed') });
        } finally {
            setIsUploadingLogo(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const tabs = [
        { id: 'general', label: t('settings.tabs.general'), icon: Building2 },
        { id: 'appearance', label: t('settings.tabs.appearance'), icon: Palette },
        { id: 'notifications', label: t('settings.tabs.notifications'), icon: Bell },
        { id: 'security', label: t('settings.tabs.security'), icon: Shield },
        { id: 'users', label: t('settings.tabs.users'), icon: Users },
        { id: 'data', label: t('settings.tabs.data'), icon: Database },
        { id: 'billing', label: t('settings.tabs.billing'), icon: CreditCard },
        { id: 'integrations', label: t('settings.tabs.integrations'), icon: Network },
        { id: 'system', label: t('settings.tabs.system'), icon: Cpu },
        { id: 'advanced', label: t('settings.tabs.advanced'), icon: Code2 },
    ];

    if (configLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-purple-600" /></div>;
    }

    return (
        <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 group flex items-center gap-3">
                        {t('settings.settings')}
                        {isDirty && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 animate-in fade-in">
                                {t('settings.actions.unsaved')}
                            </Badge>
                        )}
                    </h1>
                    <p className="text-gray-500 mt-2 text-lg">{t('settings.description')}</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    {/* SEARCH BAR */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder={t('settings.search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 bg-white"
                        />
                        {searchResults.length > 0 && (
                            <Card className="absolute top-full mt-2 left-0 w-full z-50 max-h-80 overflow-y-auto shadow-xl border-purple-100">
                                <CardContent className="p-2 space-y-1">
                                    {searchResults.map((result, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveTab(result.tab);
                                                setSearchQuery('');
                                                setSearchResults([]);
                                            }}
                                            className="w-full text-left p-2 hover:bg-purple-50 rounded-md transition-colors"
                                        >
                                            <div className="text-xs font-semibold text-purple-600 mb-0.5">{result.tabLabel}</div>
                                            <div className="text-sm font-medium text-gray-900">{result.settingKey}</div>
                                            <div className="text-xs text-gray-500 truncate">{String(result.settingValue)}</div>
                                        </button>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <Separator orientation="vertical" className="hidden md:block h-10" />

                    <Button variant="outline" onClick={() => setShowPresets(true)}>
                        <LayoutTemplate className="w-4 h-4 mr-2" />
                        Presets
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                {t('settings.actions.export')}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => downloadSettings(exportToJSON({ ...settings, schoolInfo } as AllSettings), 'json')}>
                                <FileJson className="w-4 h-4 mr-2" /> JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => downloadSettings(exportToYAML({ ...settings, schoolInfo } as AllSettings), 'yaml')}>
                                <FileCode className="w-4 h-4 mr-2" /> YAML
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copySettingsToClipboard({ ...settings, schoolInfo } as AllSettings)}>
                                <Copy className="w-4 h-4 mr-2" /> Copier
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <input ref={importInputRef} type="file" accept=".json,.yaml,.yml" className="hidden" onChange={handleImport} />
                    <Button variant="outline" onClick={() => importInputRef.current?.click()}>
                        <UploadIcon className="w-4 h-4 mr-2" />
                        {t('settings.actions.import')}
                    </Button>

                    <Button
                        onClick={handleSaveAll}
                        disabled={isSaving || !isDirty}
                        className={`min-w-[140px] transition-all duration-300 ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saveSuccess ? 'Enregistré !' : t('settings.actions.save')}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)} className="space-y-6">
                <ScrollArea className="w-full pb-2">
                    <TabsList className="flex h-auto w-full justify-start gap-1 bg-transparent p-0">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:border-purple-200 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 transition-all hover:text-purple-600 hover:bg-gray-50"
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </ScrollArea>

                {/* 1. GENERAL TAB */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.schoolInfo')}</CardTitle>
                            <CardDescription>{t('settings.schoolInfoDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="relative group shrink-0">
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-gray-300" />
                                        )}
                                    </div>
                                    {isUploadingLogo && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full"><Loader2 className="animate-spin text-purple-600" /></div>}
                                </div>
                                <div className="flex-1 space-y-4 text-center sm:text-left">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Logo de l'établissement</h3>
                                        <p className="text-sm text-gray-500">Recommandé: PNG transparent, min 200x200px</p>
                                    </div>
                                    <div className="flex gap-3 justify-center sm:justify-start">
                                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 mr-2" /> Changer
                                        </Button>
                                        {logoPreview && (
                                            <Button variant="ghost" size="sm" onClick={() => removeLogo().then(() => { setLogoPreview(''); refreshConfig(); })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <X className="w-4 h-4 mr-2" /> Supprimer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>{t('settings.schoolName')}</Label>
                                    <Input value={schoolInfo.name} onChange={(e) => handleSchoolInfoChange('name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('settings.academicYear')}</Label>
                                    <Input value={schoolInfo.academicYear} onChange={(e) => handleSchoolInfoChange('academicYear', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>{t('settings.schoolAddress')}</Label>
                                    <Input value={schoolInfo.address} onChange={(e) => handleSchoolInfoChange('address', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('settings.city')}</Label>
                                    <Input value={schoolInfo.city} onChange={(e) => handleSchoolInfoChange('city', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('settings.country')}</Label>
                                    <Input value={schoolInfo.country} onChange={(e) => handleSchoolInfoChange('country', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('settings.schoolEmail')}</Label>
                                    <Input value={schoolInfo.email} onChange={(e) => handleSchoolInfoChange('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('settings.schoolPhone')}</Label>
                                    <Input value={schoolInfo.phone} onChange={(e) => handleSchoolInfoChange('phone', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. APPEARANCE TAB */}
                <TabsContent value="appearance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>{t('settings.appearance')}</CardTitle>
                                <CardDescription>Personnalisez l'interface utilisateur</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label>{t('settings.theme')}</Label>
                                        <Select value={settings.appearance?.theme} onValueChange={(v) => handleSettingChange('appearance', 'theme', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">{t('settings.lightTheme')}</SelectItem>
                                                <SelectItem value="dark">{t('settings.darkTheme')}</SelectItem>
                                                <SelectItem value="auto">{t('settings.autoTheme')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>{t('settings.language')}</Label>
                                        <Select value={settings.appearance?.language} onValueChange={(v) => handleSettingChange('appearance', 'language', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fr">{t('settings.french')}</SelectItem>
                                                <SelectItem value="en">{t('settings.english')}</SelectItem>
                                                <SelectItem value="ar">{t('settings.arabic')}</SelectItem>
                                                <SelectItem value="es">{t('settings.spanish')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>{t('settings.dateFormat')}</Label>
                                        <Select value={settings.appearance?.dateFormat} onValueChange={(v) => handleSettingChange('appearance', 'dateFormat', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Police d'écriture</Label>
                                        <Select value={settings.appearance?.fontFamily} onValueChange={(v) => handleSettingChange('appearance', 'fontFamily', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Inter">Inter</SelectItem>
                                                <SelectItem value="Roboto">Roboto</SelectItem>
                                                <SelectItem value="Poppins">Poppins</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <ToggleWithIcon
                                        icon={LayoutTemplate}
                                        label={t('settings.compactMode')}
                                        description={t('settings.compactModeDesc')}
                                        checked={settings.appearance?.compactMode || false}
                                        onChange={(v) => handleSettingChange('appearance', 'compactMode', v)}
                                    />
                                    <ToggleWithIcon
                                        icon={X}
                                        label={t('settings.sidebarCollapsed')}
                                        description={t('settings.sidebarCollapsedDesc')}
                                        checked={settings.appearance?.sidebarCollapsed || false}
                                        onChange={(v) => handleSettingChange('appearance', 'sidebarCollapsed', v)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none">
                            <CardHeader>
                                <CardTitle className="text-white">Aperçu du Thème</CardTitle>
                                <CardDescription className="text-purple-100">Visualisez vos changements en temps réel</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm border border-white/20">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-white/20"></div>
                                        <div className="space-y-2">
                                            <div className="h-2 w-24 bg-white/20 rounded"></div>
                                            <div className="h-2 w-16 bg-white/20 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-20 w-full bg-white/10 rounded mb-4"></div>
                                    <div className="flex gap-2">
                                        <div className="h-8 w-20 bg-white/30 rounded"></div>
                                        <div className="h-8 w-20 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* 3. NOTIFICATIONS */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.notifications')}</CardTitle>
                            <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ToggleWithIcon icon={Bell} label="Email" checked={settings.notifications?.emailNotifications || false} onChange={(v) => handleSettingChange('notifications', 'emailNotifications', v)} />
                                <ToggleWithIcon icon={Bell} label="Push" checked={settings.notifications?.pushNotifications || false} onChange={(v) => handleSettingChange('notifications', 'pushNotifications', v)} />
                                <ToggleWithIcon icon={Bell} label="SMS" checked={settings.notifications?.smsNotifications || false} onChange={(v) => handleSettingChange('notifications', 'smsNotifications', v)} />
                            </div>
                            <Separator />
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Types d'alertes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ToggleWithIcon icon={Users} label={t('settings.notifyNewStudent')} checked={settings.notifications?.notifyNewStudent || false} onChange={v => handleSettingChange('notifications', 'notifyNewStudent', v)} />
                                    <ToggleWithIcon icon={AlertCircle} label={t('settings.notifyAbsence')} checked={settings.notifications?.notifyAbsence || false} onChange={v => handleSettingChange('notifications', 'notifyAbsence', v)} />
                                    <ToggleWithIcon icon={Check} label={t('settings.notifyGrade')} checked={settings.notifications?.notifyGrade || false} onChange={v => handleSettingChange('notifications', 'notifyGrade', v)} />
                                    <ToggleWithIcon icon={CreditCard} label={t('settings.notifyPayment')} checked={settings.notifications?.notifyPayment || false} onChange={v => handleSettingChange('notifications', 'notifyPayment', v)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 4. SECURITY */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.security')}</CardTitle>
                            <CardDescription>{t('settings.securityDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <SettingItem icon={Shield} label={t('settings.twoFactorAuth')} description={t('settings.twoFactorAuthDesc')}>
                                <Button variant={settings.security?.twoFactorAuth ? "destructive" : "default"}>
                                    {settings.security?.twoFactorAuth ? 'Désactiver' : 'Activer'}
                                </Button>
                            </SettingItem>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>{t('settings.sessionTimeout')}</Label>
                                    <Select value={String(settings.security?.sessionTimeout)} onValueChange={(v) => handleSettingChange('security', 'sessionTimeout', parseInt(v))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="15">15 minutes</SelectItem>
                                            <SelectItem value="30">30 minutes</SelectItem>
                                            <SelectItem value="60">1 heure</SelectItem>
                                            <SelectItem value="1440">24 heures</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiration Mot de Passe (jours)</Label>
                                    <Input type="number" value={settings.security?.passwordExpiry} onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 5. USERS & PERMISSIONS */}
                <TabsContent value="users" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.users.title')}</CardTitle>
                            <CardDescription>{t('settings.users.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <ToggleWithIcon icon={Users} label={t('settings.users.autoRegistration')} checked={settings.users?.autoRegistration || false} onChange={v => handleSettingChange('users', 'autoRegistration', v)} />
                                    <ToggleWithIcon icon={Shield} label={t('settings.users.emailVerification')} checked={settings.users?.emailVerification || false} onChange={v => handleSettingChange('users', 'emailVerification', v)} />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <Label>{t('settings.users.defaultRole')}</Label>
                                        <Select value={settings.users?.defaultRole} onValueChange={(v) => handleSettingChange('users', 'defaultRole', v)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="student">Étudiant</SelectItem>
                                                <SelectItem value="teacher">Enseignant</SelectItem>
                                                <SelectItem value="parent">Parent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <h3 className="text-lg font-semibold mb-4">{t('settings.users.permissions')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {permissions.map((perm) => (
                                        <PermissionItem
                                            key={perm.id}
                                            permission={perm as any}
                                            onToggle={(id, val) => {
                                                const newPerms = permissions.map(p => p.id === id ? { ...p, enabled: val } : p);
                                                setPermissions(newPerms);
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 6. DATA */}
                <TabsContent value="data" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.data')}</CardTitle>
                            <CardDescription>{t('settings.dataDesc')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Stockage utilisé</span>
                                    <span>2.3 GB / 5 GB</span>
                                </div>
                                <Progress value={46} className="h-2" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <ToggleWithIcon icon={Database} label={t('settings.autoBackup')} checked={settings.data?.autoBackup || false} onChange={v => handleSettingChange('data', 'autoBackup', v)} />
                                <ToggleWithIcon icon={Network} label={t('settings.offlineMode')} checked={settings.data?.offlineMode || false} onChange={v => handleSettingChange('data', 'offlineMode', v)} />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline"><Database className="w-4 h-4 mr-2" /> {t('settings.exportFullDatabase')}</Button>
                                <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"><RotateCcw className="w-4 h-4 mr-2" /> {t('settings.purgeCache')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="billing" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t('settings.billing.title')}</CardTitle></CardHeader>
                        <CardContent><p className="text-gray-500">Module de facturation à venir.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="integrations" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t('settings.integrations.title')}</CardTitle></CardHeader>
                        <CardContent><p className="text-gray-500">Module d'intégrations à venir.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="system" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t('settings.system')}</CardTitle></CardHeader>
                        <CardContent><p className="text-gray-500">Informations système affichées ici.</p></CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Avancé</CardTitle></CardHeader>
                        <CardContent><p className="text-gray-500">Paramètres développeur.</p></CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            <PresetsPanel
                isOpen={showPresets}
                onClose={() => setShowPresets(false)}
                activePresetId={activePresetId}
                onApply={(preset: SettingsPreset) => {
                    setActivePresetId(preset.id);
                    toast({ title: "Preset appliqué", description: `Le preset ${preset.name} a été activé.` });
                }}
            />
        </div>
    );
};

export default Settings;
