/**
 * Configuration Context - Partage de la configuration dans toute l'app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSchoolProfile } from '@/services/configService';
import { loadSettingsFromLocalStorage } from '@/lib/settingsUtils';
import type { SchoolProfile } from '@/lib/db';
import type { AppearanceSettings } from '@/types/settings';

interface ConfigContextType {
    schoolProfile: SchoolProfile | null;
    appearance: AppearanceSettings | null;
    refreshConfig: () => Promise<void>;
    updateAppearance: (settings: AppearanceSettings) => void;
    isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
    const [appearance, setAppearance] = useState<AppearanceSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadConfig = async () => {
        try {
            setIsLoading(true);
            const profile = await getSchoolProfile();
            setSchoolProfile(profile);
            
            const settings = loadSettingsFromLocalStorage();
            if (settings.appearance) {
                setAppearance(settings.appearance as AppearanceSettings);
            }
        } catch (error) {
            console.error('Failed to load school profile or settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    // Effect to apply theme and font globally
    useEffect(() => {
        if (!appearance) return;

        const root = document.documentElement;
        
        // Apply Mode (Light/Dark)
        if (appearance.theme === 'dark' || (appearance.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Apply Color Scheme Class
        const schemes = ['caterpillar', 'purple', 'blue', 'green', 'red'];
        schemes.forEach(s => root.classList.remove(s));
        if (appearance.colorScheme) {
            root.classList.add(appearance.colorScheme);
        }

        // Apply Font Family
        if (appearance.fontFamily) {
            const fontMap: Record<string, string> = {
                'Inter': "'Inter', sans-serif",
                'Roboto': "'Roboto', sans-serif",
                'Poppins': "'Poppins', sans-serif",
                'Archivo Black': "'Archivo Black', sans-serif"
            };
            document.body.style.fontFamily = fontMap[appearance.fontFamily] || appearance.fontFamily;
        }
    }, [appearance]);

    const refreshConfig = async () => {
        await loadConfig();
    };

    const updateAppearance = (newAppearance: AppearanceSettings) => {
        setAppearance(newAppearance);
    };

    return (
        <ConfigContext.Provider value={{ 
            schoolProfile, 
            appearance, 
            refreshConfig, 
            updateAppearance,
            isLoading 
        }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = (): ConfigContextType => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig must be used within ConfigProvider');
    }
    return context;
};
