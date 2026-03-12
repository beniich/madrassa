/**
 * Advanced Settings Type Definitions
 * Comprehensive TypeScript interfaces for SchoolGenius settings system
 */

import { LucideIcon } from 'lucide-react';

// ============================================================================
// TAB TYPES
// ============================================================================
export type TabType =
    | 'general'
    | 'appearance'
    | 'notifications'
    | 'security'
    | 'users'
    | 'data'
    | 'billing'
    | 'integrations'
    | 'system'
    | 'advanced';

// ============================================================================
// SETTINGS INTERFACES
// ============================================================================

export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    soundNotifications: boolean;
    notifyNewStudent: boolean;
    notifyAbsence: boolean;
    notifyGrade: boolean;
    notifyMessage: boolean;
    notifyEvent: boolean;
    notifyPayment: boolean;
    digestFrequency: 'never' | 'daily' | 'weekly';
}

export interface AppearanceSettings {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    fontSize: 'small' | 'medium' | 'large';
    colorScheme: 'purple' | 'blue' | 'green' | 'red';
    fontFamily: 'Inter' | 'Roboto' | 'Open Sans' | 'Poppins';
    compactMode: boolean;
    sidebarCollapsed: boolean;
}

export interface SecuritySettings {
    twoFactorAuth: boolean;
    loginNotifications: boolean;
    forcePasswordChange: boolean;
    sessionTimeout: number; // minutes
    passwordExpiry: number; // days
    lockAfterAttempts: number;
}

export interface UserSettings {
    autoRegistration: boolean;
    emailVerification: boolean;
    defaultRole: 'student' | 'teacher' | 'admin' | 'parent';
    userLimit: number;
}

export interface DataSettings {
    autoBackup: boolean;
    backupFrequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    encryption: boolean;
    compression: boolean;
    offlineMode: boolean;
    cacheEnabled: boolean;
    syncInterval: number; // minutes
    dataRetention: number; // days
    exportFormat: 'json' | 'csv' | 'xlsx';
}

export interface BillingSettings {
    billingEmail: string;
    billingCycle: 'monthly' | 'yearly';
    autoRenewal: boolean;
}

export interface IntegrationSettings {
    emailProvider: 'SendGrid' | 'Mailgun' | 'AWS SES' | 'SMTP';
    smsProvider: 'Twilio' | 'Vonage' | 'AWS SNS' | 'None';
    storageProvider: 'AWS S3' | 'Google Cloud Storage' | 'Azure Blob' | 'Local';
    analyticsProvider: 'Google Analytics' | 'Mixpanel' | 'Plausible' | 'None';
    webhookUrl: string;
}

export interface SystemSettings {
    apiEndpoint: string;
    maxUploadSize: number; // MB
    itemsPerPage: number;
    debugMode: boolean;
    analyticsEnabled: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
    autoUpdate: boolean;
}

export interface SchoolInfo {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    academicYear: string;
    timezone: string;
    currency: string;
    principalName: string;
    principalEmail: string;
    logo?: string;
}

// ============================================================================
// COMPLETE SETTINGS
// ============================================================================
export interface AllSettings {
    schoolInfo: SchoolInfo;
    notifications: NotificationSettings;
    appearance: AppearanceSettings;
    security: SecuritySettings;
    users: UserSettings;
    data: DataSettings;
    billing: BillingSettings;
    integrations: IntegrationSettings;
    system: SystemSettings;
}

// ============================================================================
// PERMISSIONS
// ============================================================================
export interface Permission {
    id: string;
    name: string;
    description: string;
    category: 'students' | 'grades' | 'administration' | 'finance';
    enabled: boolean;
}

// ============================================================================
// PRESETS
// ============================================================================
export interface SettingsPreset {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    settings: Partial<AllSettings>;
}

// ============================================================================
// SEARCH
// ============================================================================
export interface SearchResult {
    tab: TabType;
    tabLabel: string;
    settingKey: string;
    settingLabel: string;
    settingValue: any;
    matchedText: string;
}

// ============================================================================
// CONNECTION HISTORY (for Security tab)
// ============================================================================
export interface ConnectionHistory {
    id: string;
    timestamp: string;
    device: string;
    location: string;
    ip: string;
    success: boolean;
}
