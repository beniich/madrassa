import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBkMT2WWsuGTpEF3G4NLnHyXyTeesVuU84",
  authDomain: "schoolgenius-cc.firebaseapp.com",
  projectId: "schoolgenius-cc",
  storageBucket: "schoolgenius-cc.firebasestorage.app",
  messagingSenderId: "259172227601",
  appId: "1:259172227601:web:096ac755867cb20d73efb0",
  measurementId: "G-0Q3QNS46S6",
};

// Initialize Firebase (only once, with fallback if env vars missing)
let app;
try {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
} catch (err) {
  console.error("Firebase initialization error:", err);
  // Create a minimal app config to prevent total crash
  app = initializeApp({ apiKey: "missing", projectId: "missing", appId: "missing" }, "fallback");
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics if supported
export const analytics = isSupported().then(supported => supported ? getAnalytics(app!) : null);

export default app;
