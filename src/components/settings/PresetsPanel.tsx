import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Shield,
    Zap,
    LayoutTemplate,
    CheckCircle2,
    MousePointer2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsPreset } from '@/types/settings';
import { useTranslation } from 'react-i18next';

interface PresetsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (preset: SettingsPreset) => void;
    activePresetId: string | null;
}

const PRESETS: Omit<SettingsPreset, 'settings'>[] = [
    {
        id: 'default',
        name: 'Configuration Standard',
        description: 'La configuration recommandée pour la plupart des établissements.',
        icon: LayoutTemplate,
    },
    {
        id: 'security_max',
        name: 'Sécurité Maximale',
        description: '2FA activé, sessions courtes, logs complets et restrictions strictes.',
        icon: Shield,
    },
    {
        id: 'performance',
        name: 'Performance & Vitesse',
        description: 'Cache agressif, animations réduites et synchronisation optimisée.',
        icon: Zap,
    },
    {
        id: 'minimal',
        name: 'Mode Minimaliste',
        description: 'Interface épurée, notifications essentielles uniquement.',
        icon: MousePointer2,
    },
];

export const PresetsPanel = ({
    isOpen,
    onClose,
    onApply,
    activePresetId,
}: PresetsPanelProps) => {
    const { t } = useTranslation();

    const handleApply = (presetId: string) => {
        // In a real implementation, we would fetch the full preset config here
        // For now we pass a mock object
        onApply({ ...PRESETS.find((p) => p.id === presetId)!, settings: {} });
        onClose();
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl font-bold text-gray-900">
                        {t('settings.presets.title')}
                    </SheetTitle>
                    <SheetDescription className="text-gray-500">
                        Choisissez une configuration prédéfinie pour paramétrer rapidement votre
                        établissement.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => handleApply(preset.id)}
                            className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${activePresetId === preset.id
                                    ? 'border-purple-600 bg-purple-50/20'
                                    : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'
                                }`}
                        >
                            <div
                                className={`p-3 rounded-lg shrink-0 ${activePresetId === preset.id
                                        ? 'bg-purple-100 text-purple-600'
                                        : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                <preset.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3
                                    className={`font-bold ${activePresetId === preset.id ? 'text-purple-700' : 'text-gray-900'
                                        }`}
                                >
                                    {preset.name}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {preset.description}
                                </p>
                            </div>
                            {activePresetId === preset.id && (
                                <div className="absolute top-4 right-4">
                                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-700">
                    <strong>Note:</strong> L'application d'un preset modifiera plusieurs
                    paramètres simultanément. Vos données (élèves, notes) ne seront pas
                    affectées.
                </div>
            </SheetContent>
        </Sheet>
    );
};
