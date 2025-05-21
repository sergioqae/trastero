import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// For debugging purposes, check if all keys are present
const expectedKeys = [
  { key: 'apiKey', envVar: 'NEXT_PUBLIC_FIREBASE_API_KEY' },
  { key: 'authDomain', envVar: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' },
  { key: 'projectId', envVar: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' },
  { key: 'storageBucket', envVar: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' },
  { key: 'messagingSenderId', envVar: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID' },
  { key: 'appId', envVar: 'NEXT_PUBLIC_FIREBASE_APP_ID' },
];

const missingKeys = expectedKeys.filter(item => !firebaseConfig[item.key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error(
    `CRITICAL FIREBASE INIT ERROR: The following Firebase config keys are UNDEFINED: \n` +
    `  ${missingKeys.map(k => `${k.key} (${k.envVar})`).join(', \n  ')}\n\n` +
    `This means your Next.js application is not receiving these essential Firebase credentials.\n\n` +
    `TROUBLESHOOTING STEPS (YOU MUST DO THIS):\n` +
    `1. VERIFY YOUR '.env.local' FILE:\n` +
    `   - Ensure a file named '.env.local' exists in the ROOT of your project (same level as package.json).\n` +
    `   - Ensure it contains ALL the following variables, prefixed with 'NEXT_PUBLIC_':\n` +
    `     NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY\n` +
    `     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN\n` +
    `     NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID\n` +
    `     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET\n` +
    `     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID\n` +
    `     NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID\n` +
    `   - Double-check for typos and ensure values are copied EXACTLY from your Firebase project console.\n` +
    `2. FULLY RESTART YOUR NEXT.JS SERVER:\n` +
    `   - After creating or modifying '.env.local', you MUST completely stop (Ctrl+C) and restart your Next.js development server (e.g., 'npm run dev').\n` +
    `3. IF USING A CLOUD IDE (like Firebase Studio or Cloud Workstations):\n` +
    `   - These environments might have their own specific UI or configuration files for setting environment variables. These settings may override '.env.local'.\n` +
    `   - Please consult the documentation for your specific cloud development environment on how to correctly set these NEXT_PUBLIC_... environment variables.\n\n` +
    `The application cannot function without these Firebase credentials.`
  );
} else {
  if (typeof window !== 'undefined' && !getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      console.log("Firebase initialized successfully on the client.");
      if (firebaseConfig.apiKey) {
        console.log("Firebase config keys appear to be loaded. API Key starts with:", firebaseConfig.apiKey.substring(0, 5));
      }
    } catch (error) {
      console.error("Firebase client initialization error:", error);
    }
  } else if (getApps().length > 0) {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }
}


const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    throw new Error("Firebase Auth is not initialized.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

const signOutUser = async () => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export { app, auth, db, googleProvider, signInWithGoogle, signOutUser };
