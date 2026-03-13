import { useEffect } from 'react';
import { useBrandingStore } from '@/stores/useBrandingStore';

/**
 * Hook pour appliquer dynamiquement les paramètres de branding
 * - Met à jour le titre de la page
 * - Met à jour le favicon dynamiquement
 */
export const useDynamicBranding = () => {
    const { appName, headerTitle, faviconUrl } = useBrandingStore();

    // Mettre à jour le titre de la page
    useEffect(() => {
        const baseTitle = headerTitle || 'Cloud Industrie';
        const suffix = appName ? ` - ${appName}` : '';
        document.title = `${baseTitle}${suffix}`;
    }, [appName, headerTitle]);

    // Mettre à jour le favicon dynamiquement
    useEffect(() => {
        if (faviconUrl) {
            const existingFavicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;
            if (existingFavicon) {
                existingFavicon.href = faviconUrl;
            } else {
                const newFavicon = document.createElement('link');
                newFavicon.rel = 'icon';
                newFavicon.href = faviconUrl;
                document.head.appendChild(newFavicon);
            }
        }
    }, [faviconUrl]);

    return {
        appName,
        headerTitle,
    };
};

export default useDynamicBranding;
