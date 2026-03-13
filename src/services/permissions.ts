// Role-Based Access Control (RBAC) for Hospital Module

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'secretary';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    departmentId?: string;
}

// Permission actions
export type PermissionAction =
    | 'view:patients'
    | 'edit:patients'
    | 'delete:patients'
    | 'view:staff'
    | 'edit:staff'
    | 'manage:appointments'
    | 'create:prescriptions'
    | 'edit:vitals'
    | 'view:billing'
    | 'edit:billing'
    | 'manage:beds'
    | 'view:reports'
    | 'admin:settings'
    | '*'; // Full access

// Permission matrix by role
const PERMISSIONS: Record<UserRole, PermissionAction[]> = {
    admin: ['*'],
    doctor: [
        'view:patients',
        'edit:patients',
        'view:staff',
        'manage:appointments',
        'create:prescriptions',
        'view:billing',
        'manage:beds',
        'view:reports'
    ],
    nurse: [
        'view:patients',
        'edit:vitals',
        'view:staff',
        'manage:appointments',
        'manage:beds',
        'view:reports'
    ],
    secretary: [
        'view:patients',
        'view:staff',
        'manage:appointments',
        'view:billing',
        'edit:billing'
    ]
};

// Check if user can perform action
export function canPerform(user: User | null, action: PermissionAction): boolean {
    if (!user) return false;

    const userPermissions = PERMISSIONS[user.role];

    // Admin has full access
    if (userPermissions.includes('*')) return true;

    return userPermissions.includes(action);
}

// Check if user can edit a specific patient
export function canEditPatient(user: User | null, patientId: string): boolean {
    if (!user) return false;

    // Admins and doctors can edit any patient
    if (user.role === 'admin' || user.role === 'doctor') {
        return true;
    }

    // Nurses can only edit vitals (handled separately)
    // Secretaries cannot edit patient medical data
    return false;
}

// Check if user can view confidential data
export function canViewConfidential(user: User | null): boolean {
    if (!user) return false;
    return ['admin', 'doctor'].includes(user.role);
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
        admin: 'Administrateur',
        doctor: 'Médecin',
        nurse: 'Infirmier(ère)',
        secretary: 'Secrétaire'
    };
    return names[role] || role;
}

// Get role color for badges
export function getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
        admin: 'bg-purple-500 text-white',
        doctor: 'bg-blue-500 text-white',
        nurse: 'bg-green-500 text-white',
        secretary: 'bg-orange-500 text-white'
    };
    return colors[role] || 'bg-gray-500 text-white';
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): PermissionAction[] {
    return PERMISSIONS[role] || [];
}

// Mock current user (can be replaced with real auth)
export function getCurrentUser(): User {
    // This would typically come from an auth context/store
    return {
        id: 'user-001',
        name: 'Dr. Gregory House',
        email: 'g.house@cloud-hopital.fr',
        role: 'admin' // Default to admin for demo
    };
}
