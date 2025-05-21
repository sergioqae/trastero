
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
    `Firebase Initialization Error: The following Firebase config keys are UNDEFINED: ${missingKeys.join(', ')}. ` +
    `Please ensure all NEXT_PUBLIC_FIREBASE_... variables are correctly set in your .env.local file (in the project root) ` +
    `and that you have completely RESTARTED your Next.js development server after any changes to .env.local.`
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
