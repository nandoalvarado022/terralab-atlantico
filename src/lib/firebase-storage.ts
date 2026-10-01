import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let storage: FirebaseStorage | null = null;

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();

  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;

  if (!apiKey || !projectId || !storageBucket || !appId) {
    throw new Error(
      "Falta la configuración de Firebase (VITE_FIREBASE_API_KEY / VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_STORAGE_BUCKET / VITE_FIREBASE_APP_ID).",
    );
  }

  return initializeApp({
    apiKey,
    projectId,
    storageBucket,
    appId,
    ...(authDomain ? { authDomain } : {}),
    ...(messagingSenderId ? { messagingSenderId } : {}),
  });
}

/** Instancia única de Firebase Storage (SDK web; los permisos dependen de las Storage Rules). */
export function getFirebaseStorage(): FirebaseStorage {
  if (storage) return storage;
  storage = getStorage(getFirebaseApp());
  return storage;
}
