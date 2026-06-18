import { getToken, isSupported, type Messaging } from "firebase/messaging";
import { getMessaging } from "firebase/messaging";
import { getFirebaseApp } from "./config";

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  const supported = await isSupported();
  const app = getFirebaseApp();
  if (!supported || !app) return null;
  return getMessaging(app);
}

export async function requestFcmToken(): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging || !import.meta.env.VITE_FIREBASE_VAPID_KEY) return null;
  return getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
}
