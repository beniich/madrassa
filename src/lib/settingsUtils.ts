/**
 * Settings Utility Functions
 * Helper functions for settings management, import/export, and search
 */

import yaml from 'js-yaml';
import type { AllSettings, SearchResult, TabType } from '@/types/settings';

// ============================================================================
// LOCALSTORAGE KEYS
// ============================================================================
const STORAGE_KEYS = {
    NOTIFICATIONS: 'schoolgenius_notifications',
    APPEARANCE: 'schoolgenius_appearance',
    SECURITY: 'schoolgenius_security',
    USERS: 'schoolgenius_users',
    DATA: 'schoolgenius_data',
    BILLING: 'schoolgenius_billing',
    INTEGRATIONS: 'schoolgenius_integrations',
    SYSTEM: 'schoolgenius_system',
    PERMISSIONS: 'schoolgenius_permissions',
};

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================
export const getDefaultSettings = (): Partial<AllSettings> => ({
    notifications: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        soundNotifications: true,
        notifyNewStudent: true,
        notifyAbsence: true,
        notifyGrade: true,
        notifyMessage: true,
        notifyEvent: true,
        notifyPayment: true,
        digestFrequency: 'daily',
    },
    appearance: {
        theme: 'light',
        language: 'fr',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        fontSize: 'medium',
        colorScheme: 'purple',
        fontFamily: 'Inter',
        compactMode: false,
        sidebarCollapsed: false,
    },
    security: {
        twoFactorAuth: false,
        loginNotifications: true,
        forcePasswordChange: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        lockAfterAttempts: 5,
    },
    users: {
        autoRegistration: false,
        emailVerification: true,
        defaultRole: 'student',
        userLimit: 1000,
    },
    data: {
        autoBackup: true,
        backupFrequency: 'daily',
        encryption: false,
        compression: true,
        offlineMode: true,
        cacheEnabled: true,
        syncInterval: 15,
        dataRetention: 365,
        exportFormat: 'json',
    },
    billing: {
        billingEmail: '',
        billingCycle: 'monthly',
        autoRenewal: true,
    },
    integrations: {
        emailProvider: 'SMTP',
        smsProvider: 'None',
        storageProvider: 'Local',
        analyticsProvider: 'None',
        webhookUrl: '',
    },
    system: {
        apiEndpoint: 'https://api.schoolgenius.ma',
        maxUploadSize: 50,
        itemsPerPage: 20,
        debugMode: false,
        analyticsEnabled: true,
        errorReporting: true,
        performanceMonitoring: true,
        autoUpdate: false,
    },
});

// ============================================================================
// LOCALSTORAGE OPERATIONS
// ============================================================================

export const saveSettingsToLocalStorage = (settings: Partial<AllSettings>): void => {
    try {
        if (settings.notifications) {
            localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(settings.notifications));
        }
        if (settings.appearance) {
            localStorage.setItem(STORAGE_KEYS.APPEARANCE, JSON.stringify(settings.appearance));
        }
        if (settings.security) {
            localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(settings.security));
        }
        if (settings.users) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(settings.users));
        }
        if (settings.data) {
            localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(settings.data));
        }
        if (settings.billing) {
            localStorage.setItem(STORAGE_KEYS.BILLING, JSON.stringify(settings.billing));
        }
        if (settings.integrations) {
            localStorage.setItem(STORAGE_KEYS.INTEGRATIONS, JSON.stringify(settings.integrations));
        }
        if (settings.system) {
            localStorage.setItem(STORAGE_KEYS.SYSTEM, JSON.stringify(settings.system));
        }
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
};

export const loadSettingsFromLocalStorage = (): Partial<AllSettings> => {
    const defaults = getDefaultSettings();

    try {
        const notifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        const appearance = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
        const security = localStorage.getItem(STORAGE_KEYS.SECURITY);
        const users = localStorage.getItem(STORAGE_KEYS.USERS);
        const data = localStorage.getItem(STORAGE_KEYS.DATA);
        const billing = localStorage.getItem(STORAGE_KEYS.BILLING);
        const integrations = localStorage.getItem(STORAGE_KEYS.INTEGRATIONS);
        const system = localStorage.getItem(STORAGE_KEYS.SYSTEM);

        return {
            notifications: notifications ? JSON.parse(notifications) : defaults.notifications,
            appearance: appearance ? JSON.parse(appearance) : defaults.appearance,
            security: security ? JSON.parse(security) : defaults.security,
            users: users ? JSON.parse(users) : defaults.users,
            data: data ? JSON.parse(data) : defaults.data,
            billing: billing ? JSON.parse(billing) : defaults.billing,
            integrations: integrations ? JSON.parse(integrations) : defaults.integrations,
            system: system ? JSON.parse(system) : defaults.system,
        };
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
        return defaults;
    }
};

export const savePermissionsToLocalStorage = (permissions: any[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(permissions));
    } catch (error) {
        console.error('Error saving permissions to localStorage:', error);
    }
};

export const loadPermissionsFromLocalStorage = (): any[] | null => {
    try {
        const permissions = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
        return permissions ? JSON.parse(permissions) : null;
    } catch (error) {
        console.error('Error loading permissions from localStorage:', error);
        return null;
    }
};

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export const exportToJSON = (settings: AllSettings): string => {
    return JSON.stringify(settings, null, 2);
};

export const exportToYAML = (settings: AllSettings): string => {
    return yaml.dump(settings, { indent: 2 });
};

export const downloadSettings = (content: string, format: 'json' | 'yaml'): void => {
    const blob = new Blob([content], {
        type: format === 'json' ? 'application/json' : 'text/yaml',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schoolgenius-settings-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const copySettingsToClipboard = async (settings: AllSettings): Promise<void> => {
    const json = exportToJSON(settings);
    await navigator.clipboard.writeText(json);
};

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

export const importSettings = async (file: File): Promise<Partial<AllSettings>> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                let parsed: any;

                if (file.name.endsWith('.json')) {
                    parsed = JSON.parse(content);
                } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
                    parsed = yaml.load(content);
                } else {
                    reject(new Error('Format de fichier non supporté. Utilisez JSON ou YAML.'));
                    return;
                }

                // Validate structure (basic validation)
                if (typeof parsed === 'object' && parsed !== null) {
                    resolve(parsed);
                } else {
                    reject(new Error('Structure de fichier invalide.'));
                }
            } catch (error) {
                reject(new Error('Erreur lors de la lecture du fichier.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Erreur lors de la lecture du fichier.'));
        };

        reader.readAsText(file);
    });
};

// ============================================================================
// SEARCH FUNCTION
// ============================================================================

export const searchSettings = (
    query: string,
    settings: Partial<AllSettings>,
    t: (key: string) => string
): SearchResult[] => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Helper to check if value matches query
    const matches = (value: any): boolean => {
        if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerQuery);
        }
        if (typeof value === 'number') {
            return value.toString().includes(lowerQuery);
        }
        if (typeof value === 'boolean') {
            return value.toString().includes(lowerQuery);
        }
        return false;
    };

    // Search in each category
    const categories: Array<{ tab: TabType; data: any; prefix: string }> = [
        { tab: 'notifications', data: settings.notifications, prefix: 'settings.notifications' },
        { tab: 'appearance', data: settings.appearance, prefix: 'settings.appearance' },
        { tab: 'security', data: settings.security, prefix: 'settings.security' },
        { tab: 'users', data: settings.users, prefix: 'settings.users' },
        { tab: 'data', data: settings.data, prefix: 'settings.data' },
        { tab: 'billing', data: settings.billing, prefix: 'settings.billing' },
        { tab: 'integrations', data: settings.integrations, prefix: 'settings.integrations' },
        { tab: 'system', data: settings.system, prefix: 'settings.system' },
    ];

    categories.forEach(({ tab, data, prefix }) => {
        if (!data) return;

        Object.entries(data).forEach(([key, value]) => {
            const label = t(`${prefix}.${key}`);

            // Check if label or value matches
            if (label.toLowerCase().includes(lowerQuery) || matches(value)) {
                results.push({
                    tab,
                    tabLabel: t(`settings.tabs.${tab}`),
                    settingKey: key,
                    settingLabel: label,
                    settingValue: value,
                    matchedText: label,
                });
            }
        });
    });

    return results;
};
