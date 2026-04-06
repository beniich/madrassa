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
    CreditCard as BillingIcon,
    History,
    ExternalLink,
    Slack,
    Github,
    Activity,
    Server,
    Terminal,
    Wrench,
    Trash2,
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
    AppearanceSettings,
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
    savePermissionsToLocalStorage,
    loadPermissionsFromLocalStorage,
} from '@/lib/settingsUtils';

import { SettingItem } from '@/components/settings/SettingItem';
import { ToggleWithIcon } from '@/components/settings/ToggleWithIcon';
import { PermissionItem } from '@/components/settings/PermissionItem';
import { PresetsPanel } from '@/components/settings/PresetsPanel';

const COLOR_THEMES = [
  { id: "blue", name: "Bleu Académique", emoji: "🔵", primary: "#2563EB", primaryLight: "#EFF6FF", primaryDark: "#1E40AF", sidebar: "#1E293B", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "teal", name: "Teal Moderne", emoji: "🟦", primary: "#0D9488", primaryLight: "#F0FDFA", primaryDark: "#0F766E", sidebar: "#134E4A", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "indigo", name: "Indigo Prestige", emoji: "🟣", primary: "#4F46E5", primaryLight: "#EEF2FF", primaryDark: "#3730A3", sidebar: "#1E1B4B", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#0D9488" },
  { id: "slate", name: "Ardoise Sobre", emoji: "⚫", primary: "#475569", primaryLight: "#F8FAFC", primaryDark: "#1E293B", sidebar: "#0F172A", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "green", name: "Vert Nature", emoji: "🟢", primary: "#15803D", primaryLight: "#F0FDF4", primaryDark: "#14532D", sidebar: "#14532D", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "rose", name: "Rose Dynamique", emoji: "🌸", primary: "#DB2777", primaryLight: "#FFF1F2", primaryDark: "#9D174D", sidebar: "#4C0519", success: "#16A34A", warning: "#D97706", danger: "#E11D48", admin: "#7C3AED" },
  { id: "caterpillar", name: "Caterpillar Industrial", emoji: "🏗️", primary: "#FFCD00", primaryLight: "#FFF7D6", primaryDark: "#E6B800", sidebar: "#0D0D0D", success: "#16A34A", warning: "#FFCD00", danger: "#E11D48", admin: "#FFCD00" },
];

export const Settings = () => {
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    const { schoolProfile, refreshConfig, isLoading: configLoading, updateAppearance } = useConfig();
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
        { id: 'p2', name: 'Edit les élèves', description: 'Create, modifier et supprimer des fiches élèves', category: 'students', enabled: false },
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

        const loadedPermissions = loadPermissionsFromLocalStorage();
        if (loadedPermissions) {
            setPermissions(loadedPermissions);
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSettingChange = (category: keyof AllSettings, key: string, value: any) => {
        setSettings((prev) => {
            const updated = {
                ...prev,
                [category]: {
                    ...prev[category],
                    [key]: value,
                },
            };
            
            if (category === 'appearance') {
                updateAppearance(updated.appearance as AppearanceSettings);
                if (key === 'language') {
                    i18n.changeLanguage(value);
                }
            }
            
            return updated;
        });
        setIsDirty(true);
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
            savePermissionsToLocalStorage(permissions);
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
            toast({ title: t('settings.error'), description: 'Error lors de l\'importation', variant: 'destructive' });
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
            {/* HEADER */}
            <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                            <LayoutTemplate className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent group flex items-center gap-3 font-inter">
                            {t('settings.settings')}
                            {isDirty && (
                                <span className="inline-flex items-center rounded-md px-2.5 py-0.5 border bg-amber-100 text-amber-700 border-amber-200 animate-in fade-in text-xs font-bold">
                                    {t('settings.actions.unsaved')}
                                </span>
                            )}
                        </h1>
                    </div>
                    <p className="text-slate-500 mt-1 text-base ml-13 pl-1">{t('settings.description')}</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full xl:w-auto">
                    {/* SEARCH BAR */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            id="settings-search"
                            placeholder={t('settings.search.placeholder')}
                            aria-label={t('settings.search.placeholder')}
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
                            <DropdownMenuItem aria-label="Export JSON" onClick={() => downloadSettings(exportToJSON({ ...settings, schoolInfo } as AllSettings), 'json')}>
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

                    <input ref={importInputRef} type="file" accept=".json,.yaml,.yml" className="hidden" title="Importer des paramètres" onChange={handleImport} />
                    <Button variant="outline" onClick={() => importInputRef.current?.click()}>
                        <UploadIcon className="w-4 h-4 mr-2" />
                        {t('settings.actions.import')}
                    </Button>

                    <Button
                        onClick={handleSaveAll}
                        disabled={isSaving || !isDirty}
                        className={`min-w-[140px] font-bold transition-all duration-300 shadow-lg ${
                            saveSuccess
                                ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200'
                        }`}
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {saveSuccess ? 'Enregistré !' : t('settings.actions.save')}
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as TabType)} className="space-y-6">
                <ScrollArea className="w-full pb-2">
                    <TabsList className="flex h-auto w-full justify-start gap-1.5 bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-indigo-100 shadow-sm">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-semibold text-slate-500 data-[state=active]:border-indigo-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all hover:text-indigo-600 hover:bg-indigo-50"
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
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white flex items-center justify-center overflow-hidden" role="img" aria-label="Aperçu du logo">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo de l'établissement" className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="w-10 h-10 text-gray-300" aria-hidden="true" />
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
                                        <input ref={fileInputRef} type="file" accept="image/*" title="Uploader un logo" onChange={handleLogoUpload} className="hidden" />
                                        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="w-4 h-4 mr-2" /> Changer
                                        </Button>
                                        {logoPreview && (
                                            <Button variant="ghost" size="sm" onClick={() => removeLogo().then(() => { setLogoPreview(''); refreshConfig(); })} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <X className="w-4 h-4 mr-2" /> Delete
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="school-name">{t('settings.schoolName')}</Label>
                                    <Input id="school-name" value={schoolInfo.name} onChange={(e) => handleSchoolInfoChange('name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="academic-year">{t('settings.academicYear')}</Label>
                                    <Input id="academic-year" value={schoolInfo.academicYear} onChange={(e) => handleSchoolInfoChange('academicYear', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="school-address">{t('settings.schoolAddress')}</Label>
                                    <Input id="school-address" value={schoolInfo.address} onChange={(e) => handleSchoolInfoChange('address', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-city">{t('settings.city')}</Label>
                                    <Input id="school-city" value={schoolInfo.city} onChange={(e) => handleSchoolInfoChange('city', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-country">{t('settings.country')}</Label>
                                    <Input id="school-country" value={schoolInfo.country} onChange={(e) => handleSchoolInfoChange('country', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-email">{t('settings.schoolEmail')}</Label>
                                    <Input id="school-email" value={schoolInfo.email} onChange={(e) => handleSchoolInfoChange('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="school-phone">{t('settings.schoolPhone')}</Label>
                                    <Input id="school-phone" value={schoolInfo.phone} onChange={(e) => handleSchoolInfoChange('phone', e.target.value)} />
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
                                    <div className="space-y-3 md:col-span-2">
                                        <Label>Thème de couleurs</Label>
                                        <p className="text-sm text-gray-500 mb-2">
                                            Couleur principale de l'interface, navigation et boutons.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {COLOR_THEMES.map((t) => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => handleSettingChange('appearance', 'colorScheme', t.id)}
                                                    className={`border-2 rounded-xl p-3 flex flex-col gap-3 transition-all text-left ${
                                                        settings.appearance?.colorScheme === t.id
                                                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                                                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span className="font-semibold text-sm flex items-center gap-2">
                                                            <span>{t.emoji}</span> {t.name}
                                                        </span>
                                                        {settings.appearance?.colorScheme === t.id && (
                                                            <Check className="w-4 h-4 text-indigo-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex gap-1.5" aria-hidden="true">
                                                        <div className="w-6 h-6 rounded-md shadow-sm bg-[var(--bg-color)]" style={{ '--bg-color': t.primary } as React.CSSProperties} title="Primaire" />
                                                        <div className="w-6 h-6 rounded-md shadow-sm bg-[var(--bg-color)]" style={{ '--bg-color': t.sidebar } as React.CSSProperties} title="Sidebar" />
                                                        <div className="w-6 h-6 rounded-md shadow-sm bg-[var(--bg-color)]" style={{ '--bg-color': t.success } as React.CSSProperties} title="Success" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
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
                                                <SelectItem value="Archivo Black">Archivo Black (Caterpillar)</SelectItem>
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
                                    <Label htmlFor="password-expiry">Expiration Mot de Passe (jours)</Label>
                                    <Input id="password-expiry" type="number" value={settings.security?.passwordExpiry} onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))} />
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
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                        <CardHeader>
                            <CardTitle>{t('settings.billing.title')}</CardTitle>
                            <CardDescription>Gérez votre abonnement et vos factures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                                        <BillingIcon className="text-indigo-600 w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Plan Premium Académique</p>
                                        <p className="text-sm text-slate-500">29.00€ / mois • Renouvellement le 12 Avril 2026</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="bg-white hover:bg-white shadow-sm font-semibold border-indigo-200">
                                    Gérer
                                </Button>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                    <History className="w-4 h-4 text-slate-400" />
                                    Historique des factures
                                </h3>
                                <div className="border rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                            <tr>
                                                <th className="px-4 py-3">Date</th>
                                                <th className="px-4 py-3">Montant</th>
                                                <th className="px-4 py-3">Statut</th>
                                                <th className="px-4 py-3 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr>
                                                <td className="px-4 py-3 font-medium">12 Mars 2026</td>
                                                <td className="px-4 py-3">29.00€</td>
                                                <td className="px-4 py-3"><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Payé</Badge></td>
                                                <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" className="h-8 px-2 text-indigo-600">PDF</Button></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-medium">12 Fév 2026</td>
                                                <td className="px-4 py-3">29.00€</td>
                                                <td className="px-4 py-3"><Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Payé</Badge></td>
                                                <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" className="h-8 px-2 text-indigo-600">PDF</Button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.integrations.title')}</CardTitle>
                            <CardDescription>Connectez vos outils favoris à votre établissement</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'Slack', icon: Slack, status: 'Connecté', desc: 'Alertes automatiques dans vos canaux' },
                                { name: 'GitHub', icon: Github, status: 'No connecté', desc: 'Liez vos dépôts de code pédagogiques' },
                                { name: 'Google Drive', icon: Database, status: 'Connecté', desc: 'Stockage Cloud pour vos documents' },
                                { name: 'Microsoft Teams', icon: Network, status: 'No connecté', desc: 'Vidéoconférences pour vos classes' },
                            ].map((integration) => (
                                <div key={integration.name} className="p-4 border rounded-xl hover:border-indigo-200 hover:shadow-md transition-all group">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50">
                                            <integration.icon className={`w-5 h-5 ${integration.status === 'Connecté' ? 'text-indigo-600' : 'text-slate-400'}`} />
                                        </div>
                                        <Badge variant={integration.status === 'Connecté' ? 'default' : 'outline'} className={integration.status === 'Connecté' ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none' : ''}>
                                            {integration.status}
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-slate-900">{integration.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1 mb-4">{integration.desc}</p>
                                    <Button variant="ghost" size="sm" className="w-full text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600">
                                        <ExternalLink className="w-3 h-3 mr-2" /> Paramétrer
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>{t('settings.system')}</CardTitle>
                                <CardDescription>État technique de votre instance</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Version du logiciel</p>
                                        <p className="text-lg font-bold text-indigo-700">v2.4.12-pro (Build 762)</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Statut du serveur</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="text-lg font-bold text-emerald-600">Opérationnel</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Uptime cumulé</p>
                                        <p className="text-lg font-bold text-slate-700">99.98% (30 derniers jours)</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <p className="text-xs font-medium text-slate-500 uppercase mb-2">Temps de réponse API</p>
                                        <p className="text-lg font-bold text-indigo-600">42ms avg</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-500" />
                                        Ressources consommées
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Utilisation CPU</span>
                                                <span>12%</span>
                                            </div>
                                            <Progress value={12} className="h-1.5" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>Mémoire RAM</span>
                                                <span>1.4 GB / 4 GB</span>
                                            </div>
                                            <Progress value={35} className="h-1.5" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Terminal className="w-5 h-5 text-indigo-400" />
                                    Diagnostics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] space-y-1 border border-white/5">
                                    <p className="text-emerald-400">[OK] Database connection established</p>
                                    <p className="text-emerald-400">[OK] Redis cache active</p>
                                    <p className="text-emerald-400">[OK] Firebase auth connected</p>
                                    <p className="text-amber-400">[WARN] High disk IO on logs/debug.log</p>
                                    <p className="text-emerald-400">[OK] Workers (4/4) active</p>
                                </div>
                                <Button variant="outline" className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs py-1 h-8">
                                    Lancer un scan complet
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings Avancés</CardTitle>
                            <CardDescription>Outils d'administration et de maintenance</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-6">
                                <ToggleWithIcon 
                                    icon={Server} 
                                    label="Mode Maintenance" 
                                    description="Désactive l'accès public au portail (les administrateurs conservent l'accès)"
                                    checked={false}
                                    onChange={() => {}}
                                    color="text-red-500"
                                />
                                <ToggleWithIcon 
                                    icon={Code2} 
                                    label="Logs de Débug" 
                                    description="Active l'enregistrement détaillé des erreurs (impacte les performances)"
                                    checked={true}
                                    onChange={() => {}}
                                />
                                <ToggleWithIcon 
                                    icon={Activity} 
                                    label="Analyse en temps réel" 
                                    description="Envoie des données télémétriques anonymes pour l'amélioration"
                                    checked={true}
                                    onChange={() => {}}
                                />
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all rounded-2xl group">
                                    <RotateCcw className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 group-hover:rotate-180 transition-all duration-500" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Vider le cache</p>
                                        <p className="text-xs text-slate-500">Purge Redis & Local Storage</p>
                                    </div>
                                </Button>
                                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:border-red-300 hover:bg-red-50 transition-all rounded-2xl group text-red-600">
                                    <Trash2 className="w-6 h-6 text-slate-400 group-hover:text-red-600" />
                                    <div className="text-center">
                                        <p className="font-bold text-sm">Réinitialisation d'usine</p>
                                        <p className="text-xs text-slate-500 text-red-400">Warning: Action irréversible</p>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
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
        </div>
    );
};

export default Settings;
