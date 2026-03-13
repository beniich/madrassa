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

import { 
    User, 
    UserRole, 
    Permission, 
    ROLE_PERMISSIONS, 
    STORAGE_KEY 
} from '../types/auth';

// ============================================
// CONTEXT
// ============================================

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signInWithGoogle: () => Promise<void>;
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

    const handleFirebaseUser = React.useCallback(async (fbUser: FirebaseUser) => {
        try {
            const token = await getIdToken(fbUser);
            
            // Background sync - don't block if we already have a user
            const syncPromise = fetch(`${API_BASE_URL}/auth/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            // If we don't have a user yet, we MUST try to sync
            if (!user) {
                try {
                    const response = await syncPromise;
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
                        syncEngine.pullAll(userData.schoolId);
                    } else {
                        throw new Error('Sync response not ok');
                    }
                } catch (syncErr) {
                    console.warn('[Auth] Initial sync failed, using fallback user profile:', syncErr);
                    // Fallback to a basic user object from Firebase info
                    const fallbackUser: User = {
                        id: fbUser.uid,
                        email: fbUser.email || '',
                        name: fbUser.displayName || 'User',
                        role: 'teacher',
                        schoolId: 'school_001',
                        token,
                        permissions: ROLE_PERMISSIONS['teacher']
                    };
                    setUser(fallbackUser);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackUser));
                }
            } else {
                // Already have a user from cache, just update in background
                syncPromise.then(async (res) => {
                    if (res.ok) {
                        const data = await res.json();
                        const role = (data.user.role ?? 'teacher') as UserRole;
                        const userData: User = {
                            ...data.user,
                            token,
                            permissions: ROLE_PERMISSIONS[role] ?? [],
                        };
                        setUser(userData);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
                    }
                }).catch(err => console.warn('[Auth] Background sync failed:', err));
            }
        } catch (error) {
            console.error('[Auth] Error handling Firebase user:', error);
            if (!user) {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Try to load from cache immediately for instant UI
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
            try {
                setUser(JSON.parse(cached));
                setIsLoading(false); // We have a user, show the app
            } catch (e) {
                console.warn('[Auth] Failed to parse cached user');
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                await handleFirebaseUser(fbUser);
            } else {
                setUser(null);
                localStorage.removeItem(STORAGE_KEY);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [handleFirebaseUser]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return true;
        } catch (error) {
            console.error('[Auth] Login failed:', error);
            return false;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const { signInWithPopup } = await import('firebase/auth');
            const { googleProvider } = await import('../lib/firebase');
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('[Auth] Google sign in failed:', error);
            throw error;
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
                signInWithGoogle,
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
