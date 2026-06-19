import { useEffect } from "react";
import type { Reminder } from "../types/game";
import { getCatDisplayName } from "../utils/catName";

export function useReminderNotifications(reminders: Reminder[], enabled: boolean, catNameValue?: string) {
  useEffect(() => {
    if (!enabled || !("Notification" in window) || Notification.permission !== "granted") return;

    const catName = getCatDisplayName(catNameValue);
    const timers = reminders
      .filter((reminder) => !reminder.completed)
      .map((reminder) => {
        const dueAt = new Date(`${reminder.date}T${reminder.time}`).getTime();
        const delay = dueAt - Date.now();
        if (delay < 0 || delay > 24 * 60 * 60 * 1000) return null;

        return window.setTimeout(() => {
          new Notification(`${catName} reminder`, {
            body: reminder.title,
            icon: "./icons/icon-192.png"
          });
        }, delay);
      })
      .filter((timer): timer is number => typeof timer === "number");

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [catNameValue, enabled, reminders]);
}
