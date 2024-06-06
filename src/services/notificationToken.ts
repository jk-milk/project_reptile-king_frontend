import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function getNotificationToken() {
  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
  });
  if (token) {
    console.log(token);
    return token;
  }
}