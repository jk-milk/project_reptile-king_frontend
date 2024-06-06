export async function handleAllowNotification() {

  console.log("handleAllowNotification");
  
  const permission = await Notification.requestPermission();

  if (permission === "denied") {
    alert(
      "푸시 알림 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요."
    );
  }
}