export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "You are up late";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatReminderDate(date: string, time: string) {
  if (!date || !time) return "No time set";
  return `${date} at ${time}`;
}
