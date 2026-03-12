// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBkMT2WWsuGTpEF3G4NLnHyXyTeesVuU84",
    authDomain: "schoolgenius-cc.firebaseapp.com",
    projectId: "schoolgenius-cc",
    storageBucket: "schoolgenius-cc.firebasestorage.app",
    messagingSenderId: "259172227601",
    appId: "1:259172227601:web:096ac755867cb20d73efb0",
    measurementId: "G-0Q3QNS46S6",
};

// Initialize Firebase (only once, with fallback if env vars are missing)
let app;
try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
} catch (err) {
    console.error('Firebase initialization error:', err);
    // Fallback to an empty app to prevent the whole app from crashing
    app = getApps()[0] ?? initializeApp({ apiKey: 'missing', projectId: 'missing', appId: 'missing' }, 'fallback');
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
    prompt: 'select_account' // Force account selection
});

export default app;
