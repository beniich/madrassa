/**
 * Configuration Service - Gestion du profil de l'école
 */

import { db, type SchoolProfile, generateLocalId, getCurrentTimestamp } from '@/lib/db';

const DEFAULT_SCHOOL_ID = 'school_default';

/**
 * Récupère le profil de l'école
 */
export const getSchoolProfile = async (): Promise<SchoolProfile> => {
    const profiles = await db.schoolProfile.toArray();

    if (profiles.length === 0) {
        // Créer un profil par défaut
        const defaultProfile: SchoolProfile = {
            localId: DEFAULT_SCHOOL_ID,
            name: 'SchoolGenius',
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
            logo: '',
            updatedAt: getCurrentTimestamp(),
        };

        await db.schoolProfile.add(defaultProfile);
        return defaultProfile;
    }

    return profiles[0];
};

/**
 * Met à jour le profil de l'école
 */
export const updateSchoolProfile = async (
    updates: Partial<Omit<SchoolProfile, 'id' | 'localId'>>
): Promise<void> => {
    const profile = await getSchoolProfile();

    if (profile.id) {
        await db.schoolProfile.update(profile.id, {
            ...updates,
            updatedAt: getCurrentTimestamp(),
        });
    }
};

/**
 * Convertit un fichier image en base64
 */
export const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert image to base64'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };

        reader.readAsDataURL(file);
    });
};

/**
 * Upload et sauvegarde le logo
 */
export const uploadLogo = async (file: File): Promise<void> => {
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
    }

    // Vérifier la taille (max 2MB)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        throw new Error('L\'image ne doit pas dépasser 2MB');
    }

    const base64 = await convertImageToBase64(file);
    await updateSchoolProfile({ logo: base64 });
};

/**
 * Supprime le logo
 */
export const removeLogo = async (): Promise<void> => {
    await updateSchoolProfile({ logo: '' });
};
