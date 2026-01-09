/**
 * SchoolGenius - Authentication Context with Firebase
 * Google OAuth Authentication
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    User as FirebaseUser,
    signInWithPopup,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.config';

// ============================================
// TYPES
// ============================================

export interface User {
    id: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
}

// ============================================
// CONTEXT
// ============================================

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
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
        // Listen to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in
                const userData: User = {
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                    emailVerified: firebaseUser.emailVerified,
                };
                setUser(userData);
                setFirebaseUser(firebaseUser);
            } else {
                // User is signed out
                setUser(null);
                setFirebaseUser(null);
            }
            setIsLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const result = await signInWithPopup(auth, googleProvider);

            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            console.log('Successfully signed in with Google', result.user);

            // The user info is automatically updated via onAuthStateChanged
        } catch (error: any) {
            console.error('Error signing in with Google:', error);
            const errorCode = error.code;
            const errorMessage = error.message;

            // Handle specific error cases
            if (errorCode === 'auth/popup-closed-by-user') {
                console.log('Sign-in popup was closed by user');
            } else if (errorCode === 'auth/cancelled-popup-request') {
                console.log('Sign-in popup was cancelled');
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            console.log('Successfully signed out');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                isLoading,
                isAuthenticated: !!user,
                signInWithGoogle,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
