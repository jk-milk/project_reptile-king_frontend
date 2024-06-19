import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

// 네비게이션 바에서 사용하는 fcm 알림 포그라운드 리스너의 원형 저장용
export function initializeNotificationListener() {
  console.log("initializeNotificationListener");
  
  onMessage(messaging, (payload) => {
    console.log("알림 도착 ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body
    };

    if (Notification.permission === "granted") {
      new Notification(notificationTitle, notificationOptions);
    }
    // 알림 데이터 업데이트
    try {
      const response = await apiWithAuth.get('alarms');
      setNotifications(response.data.alarms);
    } catch (error) {
      console.error('알림 데이터 가져오기 실패:', error);
    }
  });
}
