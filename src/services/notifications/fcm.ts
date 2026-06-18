import { requestFcmToken } from "../firebase/messaging";

export async function preparePushNotifications() {
  if (!("Notification" in window)) {
    return { status: "unsupported" as const, token: null };
  }

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission !== "granted") {
    return { status: "denied" as const, token: null };
  }

  return {
    status: "ready" as const,
    token: await requestFcmToken()
  };
}
