/**
 * SchoolGenius - Contexte d'authentification Firebase
 * Mode: PRODUCTION — authentification gérée par Firebase
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    User as FirebaseUser,
    getIdToken
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { db, AppConfig, getCurrentTimestamp } from '../lib/db';
import { API_BASE_URL } from '../lib/apiClient';
import { syncEngine } from '../lib/syncEngine';

// ============================================
// TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    token: string;
    schoolId: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    permissions: Permission[];
}

export type Permission =
    | 'view_all_students' | 'edit_students'
    | 'view_all_teachers' | 'edit_teachers'
    | 'view_all_classes' | 'edit_classes'
    | 'mark_attendance' | 'view_attendance'
    | 'add_grades' | 'view_all_grades'
    | 'send_messages' | 'view_ai_alerts'
    | 'access_admin'
    | 'view_own_students' | 'view_own_classes' | 'view_own_children' | 'view_own_grades';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    direction: [
        'view_all_students', 'edit_students',
        'view_all_teachers', 'edit_teachers',
        'view_all_classes', 'edit_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages', 'view_ai_alerts', 'access_admin',
    ],
    admin: [
        'view_all_students', 'edit_students',
        'view_all_teachers',
        'view_all_classes', 'edit_classes',
        'view_attendance', 'view_all_grades',
        'send_messages', 'access_admin',
    ],
    teacher: [
        'view_own_students', 'view_all_teachers', 'view_own_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages', 'view_ai_alerts',
    ],
    parent: [
        'view_own_children', 'view_own_grades', 'view_attendance',
    ],
};

const STORAGE_KEY = 'sg_user';

// ============================================
// CONTEXT
// ============================================

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await handleFirebaseUser(firebaseUser);
            } else {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleFirebaseUser = async (firebaseUser: FirebaseUser) => {
        try {
            const token = await getIdToken(firebaseUser);
            
            // Sync with backend to get school-specific profile
            const response = await fetch(`${API_BASE_URL}/auth/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                const role = (data.user.role ?? 'teacher') as UserRole;
                
                const userData: User = {
                    ...data.user,
                    token,
                    permissions: ROLE_PERMISSIONS[role] ?? [],
                };

                setUser(userData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                
                // Trigger full sync pull on login/sync
                syncEngine.pullAll(userData.schoolId);
            } else {
                console.error('[Auth] Failed to sync user with backend');
                setUser(null);
            }
        } catch (error) {
            console.error('[Auth] Error handling Firebase user:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error('[Auth] Login failed:', error);
            return false;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('[Auth] Logout failed:', error);
        }
    };

    const hasPermission = (permission: Permission): boolean =>
        user?.permissions.includes(permission) ?? false;

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
