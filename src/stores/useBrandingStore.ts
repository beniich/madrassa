import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types pour les options de personnalisation
export interface BrandingConfig {
    appName: string;
    headerTitle: string;
    logoUrl: string | null;
    faviconUrl: string | null;
    iconUrl: string | null;
    footerText: string;
}

interface BrandingState extends BrandingConfig {
    // Actions
    updateBranding: (config: Partial<BrandingConfig>) => void;
    resetToDefaults: () => void;
}

// Valeurs par défaut
const DEFAULT_BRANDING: BrandingConfig = {
    appName: 'CRM Pro',
    headerTitle: 'Cloud Industrie',
    logoUrl: null,
    faviconUrl: null,
    iconUrl: null,
    footerText: 'Cloudindustry LTD',
};

export const useBrandingStore = create<BrandingState>()(
    persist(
        (set) => ({
            ...DEFAULT_BRANDING,

            updateBranding: (config) => {
                set((state) => ({ ...state, ...config }));
            },

            resetToDefaults: () => {
                set(DEFAULT_BRANDING);
            },
        }),
        {
            name: 'branding-store', // Clé dans localStorage
            // Tous les champs sont persistés automatiquement
        }
    )
);

// Export des valeurs par défaut pour référence
export const DEFAULT_BRANDING_CONFIG = DEFAULT_BRANDING;
