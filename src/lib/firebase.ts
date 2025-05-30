// Firebase is not configured in this version.
// This file is kept to prevent import errors if other files still reference it,
// but it will not provide any Firebase functionality.

export const app = undefined;
export const auth = undefined;
export const db = undefined;
export const googleProvider = undefined;

export const signInWithGoogle = async () => {
  console.error("Firebase not configured. Cannot sign in with Google.");
  throw new Error("Firebase not configured.");
};

export const signOutUser = async () => {
  console.error("Firebase not configured. Cannot sign out.");
  // No actual sign out to perform
};

console.warn(
  "Firebase functionality has been removed in this version. App is using localStorage."
);
