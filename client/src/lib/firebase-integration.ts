import { User } from "firebase/auth";

export interface FirebaseUserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  userType: "student" | "mentor";
}

/**
 * Converts Firebase User to your app's user format
 */
export const convertFirebaseUser = (
  firebaseUser: User,
  userType: "student" | "mentor"
): FirebaseUserData => {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    userType,
  };
};

/**
 * Stores Firebase user data in localStorage for compatibility with existing auth system
 */
export const storeFirebaseUser = (userData: FirebaseUserData) => {
  const { userType, ...userInfo } = userData;

  // Store in the same format as your existing system
  localStorage.setItem(`${userType}FirebaseUser`, JSON.stringify(userData));
  localStorage.setItem(`${userType}Email`, userData.email || "");
  localStorage.setItem(`${userType}Token`, userData.uid); // Using UID as token for now

  // You might want to create a JWT token on your backend using the Firebase UID
  // and store that instead of the UID directly
};

/**
 * Clears Firebase user data from localStorage
 */
export const clearFirebaseUser = (userType: "student" | "mentor") => {
  localStorage.removeItem(`${userType}FirebaseUser`);
  localStorage.removeItem(`${userType}Email`);
  localStorage.removeItem(`${userType}Token`);
};

/**
 * Gets stored Firebase user data
 */
export const getStoredFirebaseUser = (
  userType: "student" | "mentor"
): FirebaseUserData | null => {
  try {
    const stored = localStorage.getItem(`${userType}FirebaseUser`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Checks if user is authenticated via Firebase
 */
export const isFirebaseAuthenticated = (
  userType: "student" | "mentor"
): boolean => {
  return getStoredFirebaseUser(userType) !== null;
};

/**
 * Creates a mock JWT token for Firebase users to work with your existing API
 * In production, you should verify Firebase tokens on your backend
 */
export const createFirebaseJWT = (
  firebaseUser: User,
  userType: "student" | "mentor"
): string => {
  // This is a simple implementation - in production, you should:
  // 1. Send the Firebase ID token to your backend
  // 2. Verify it on your backend using Firebase Admin SDK
  // 3. Create your own JWT token with the verified user data

  const payload = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    userType,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  // This is just for demo - use a proper JWT library in production
  return btoa(JSON.stringify(payload));
};
