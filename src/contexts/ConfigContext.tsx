/**
 * Configuration Context - Partage de la configuration dans toute l'app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSchoolProfile } from '@/services/configService';
import type { SchoolProfile } from '@/lib/db';

interface ConfigContextType {
    schoolProfile: SchoolProfile | null;
    refreshConfig: () => Promise<void>;
    isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
    children: ReactNode;
}

export const ConfigProvider = ({ children }: ConfigProviderProps) => {
    const [schoolProfile, setSchoolProfile] = useState<SchoolProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadConfig = async () => {
        try {
            setIsLoading(true);
            const profile = await getSchoolProfile();
            setSchoolProfile(profile);
        } catch (error) {
            console.error('Failed to load school profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadConfig();
    }, []);

    const refreshConfig = async () => {
        await loadConfig();
    };

    return (
        <ConfigContext.Provider value={{ schoolProfile, refreshConfig, isLoading }}>
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
