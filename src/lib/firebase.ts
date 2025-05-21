
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// For debugging purposes:
const missingKeys: string[] = [];
if (!firebaseConfig.apiKey) missingKeys.push("apiKey (NEXT_PUBLIC_FIREBASE_API_KEY)");
if (!firebaseConfig.authDomain) missingKeys.push("authDomain (NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)");
if (!firebaseConfig.projectId) missingKeys.push("projectId (NEXT_PUBLIC_FIREBASE_PROJECT_ID)");
if (!firebaseConfig.storageBucket) missingKeys.push("storageBucket (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)");
if (!firebaseConfig.messagingSenderId) missingKeys.push("messagingSenderId (NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)");
if (!firebaseConfig.appId) missingKeys.push("appId (NEXT_PUBLIC_FIREBASE_APP_ID)");

if (missingKeys.length > 0) {
  console.error(
    `CRITICAL FIREBASE INIT ERROR: The following Firebase config keys are UNDEFINED: \n` +
    `  ${missingKeys.join(', \n  ')}\n\n` +
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
  // Log a part of the key to confirm it's loaded, but be careful not to log the full key.
  console.log("Firebase config keys appear to be loaded. API Key starts with:", firebaseConfig.apiKey!.substring(0, 5));
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
