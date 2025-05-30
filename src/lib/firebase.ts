// Firebase is not configured in this version.
// This file is kept to prevent import errors if other files still reference it,
// but it will not provide any Firebase functionality.

export const app = undefined;
export const auth = undefined;
export const db = undefined;
export const googleProvider = undefined;

export const signInWithGoogle = async () => {
  console.warn(
    "Firebase not configured. signInWithGoogle was called but will do nothing."
  );
  // Simulate a user object for local development if needed, or throw error
  // For now, just a warning
  return Promise.resolve(null); 
};

export const signOutUser = async () => {
  console.warn(
    "Firebase not configured. signOutUser was called but will do nothing."
  );
  // No actual sign out to perform
  return Promise.resolve();
};

// console.warn(
//   "Firebase functionality has been removed in this version. App is using localStorage."
// );
