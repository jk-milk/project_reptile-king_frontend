import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export function initializeNotificationListener() {
  console.log("initializeNotificationListener");
  
  onMessage(messaging, (payload) => {
    console.log("알림 도착 ", payload);
    // const notificationTitle = payload.notification.title;
    // const notificationOptions = {
    //   body: payload.notification.body
    // };

    // if (Notification.permission === "granted") {
    //   new Notification(notificationTitle, notificationOptions);
    // }
  });
}
