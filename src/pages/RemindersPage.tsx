import { useState } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import type { RepeatOption } from "../types/game";
import { useMochiStore } from "../store/useMochiStore";
import { formatReminderDate, todayKey } from "../utils/date";

export default function RemindersPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayKey());
  const [time, setTime] = useState("09:00");
  const [repeat, setRepeat] = useState<RepeatOption>("none");
  const reminders = useMochiStore((state) => state.reminders);
  const addReminder = useMochiStore((state) => state.addReminder);
  const toggleReminder = useMochiStore((state) => state.toggleReminder);
  const preference = useMochiStore((state) => state.profile.notificationPreference);
  const setPreference = useMochiStore((state) => state.setNotificationPreference);
  const catName = useMochiStore((state) => state.profile.catName);

  async function askNotifications() {
    if (!("Notification" in window)) {
      setPreference("in-app");
      return;
    }

    const result = await Notification.requestPermission();
    setPreference(result === "granted" ? "allowed" : "denied");
  }

  function submitReminder() {
    addReminder({ title, date, time, repeat });
    setTitle("");
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-[28px] bg-gradient-to-br from-[#fff1cf] to-[#d8cbff] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#8b6bc0]">Reminders</p>
        <h2 className="mt-1 text-3xl font-black">No pressure. Just a nudge.</h2>
      </header>

      {preference === "unknown" && (
        <section className="rounded-[28px] border border-white/30 bg-[#2a1c2d] p-4 text-white shadow-xl">
          <p className="text-sm font-bold leading-6">
            {catName} asks gently: “Can I remind you when it’s time to care for yourself?”
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-[#ff8dad] px-3 py-3 font-black" onClick={askNotifications}>
              Allow Notifications
            </button>
            <button className="rounded-2xl bg-white/10 px-3 py-3 font-black" onClick={() => setPreference("in-app")}>
              In-app Only
            </button>
          </div>
        </section>
      )}

      <section className="grid gap-3 rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <input
          className="h-12 rounded-2xl border border-[#f1c9d5] px-4 font-bold outline-none"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Reminder title"
          value={title}
        />
        <div className="grid grid-cols-2 gap-2">
          <input className="h-12 rounded-2xl border border-[#f1c9d5] px-3 font-bold outline-none" onChange={(event) => setDate(event.target.value)} type="date" value={date} />
          <input className="h-12 rounded-2xl border border-[#f1c9d5] px-3 font-bold outline-none" onChange={(event) => setTime(event.target.value)} type="time" value={time} />
        </div>
        <select className="h-12 rounded-2xl border border-[#f1c9d5] px-3 font-bold outline-none" onChange={(event) => setRepeat(event.target.value as RepeatOption)} value={repeat}>
          <option value="none">No repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button className="h-12 rounded-2xl bg-[#49343a] font-black text-white" onClick={submitReminder}>
          Add Reminder
        </button>
      </section>

      <section className="grid gap-3">
        {reminders.length === 0 ? (
          <p className="rounded-[24px] bg-white/70 p-4 text-center text-sm font-bold text-[#7c6460] shadow-lg">
            No reminders yet. Mochi will wait politely.
          </p>
        ) : (
          reminders.map((reminder) => (
            <button
              className="grid grid-cols-[44px_1fr] items-center gap-3 rounded-[24px] border border-white/30 bg-white/80 p-3 text-left shadow-lg"
              key={reminder.id}
              onClick={() => toggleReminder(reminder.id)}
              type="button"
            >
              <span className={`grid h-11 w-11 place-items-center rounded-2xl ${reminder.completed ? "bg-[#8bc7a5] text-white" : "bg-[#fff1cf] text-[#b26d83]"}`}>
                {reminder.completed ? <FiCheck /> : <FiBell />}
              </span>
              <span>
                <strong className={reminder.completed ? "block line-through" : "block"}>{reminder.title}</strong>
                <span className="text-xs font-bold text-[#7c6460]">
                  {formatReminderDate(reminder.date, reminder.time)} · {reminder.repeat}
                </span>
              </span>
            </button>
          ))
        )}
      </section>
    </section>
  );
}
