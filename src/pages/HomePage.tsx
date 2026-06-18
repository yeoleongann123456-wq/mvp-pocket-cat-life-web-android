import { FiBell, FiMoon, FiSmile, FiTrendingUp } from "react-icons/fi";
import type { ReactNode } from "react";
import { TbDropletHeart } from "react-icons/tb";
import CatRoom from "../components/CatRoom";
import { CAT_BREEDS } from "../features/cat/breeds";
import { getRelationshipLevel, getRelationshipProgress } from "../features/relationship/levels";
import { useMochiStore } from "../store/useMochiStore";
import { formatReminderDate, getTimeGreeting } from "../utils/date";

export default function HomePage() {
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const getTodayLog = useMochiStore((state) => state.getTodayLog);
  const reminders = useMochiStore((state) => state.reminders);
  const breed = CAT_BREEDS[profile.breedId];
  const log = getTodayLog();
  const upcoming = reminders
    .filter((reminder) => !reminder.completed)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const level = getRelationshipLevel(points);
  const progress = getRelationshipProgress(points);

  const dialogue = `${getTimeGreeting()}. ${breed.greeting} ${profile.catName} says: ${
    log.waterGlasses < 4
      ? "A few sips now would make future-you proud."
      : log.mood
        ? "I saw you check in with yourself. That matters."
        : "Tell me how your heart is doing when you are ready."
  }`;

  return (
    <section className="grid gap-4">
      <CatRoom breed={breed} catName={profile.catName} />

      <section className="rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">{breed.name} dialogue</p>
        <h2 className="mt-1 text-xl font-black leading-snug">{dialogue}</h2>
      </section>

      <section className="rounded-[28px] bg-[#2a1c2d] p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#ffabc3]">Relationship</p>
            <h2 className="text-2xl font-black">{level}</h2>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-2 text-sm font-black">{points} care</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#ff8dad] to-[#ffd45c]" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard icon={<TbDropletHeart />} label="Water" value={`${log.waterGlasses} glasses`} />
        <SummaryCard icon={<FiMoon />} label="Sleep" value={log.sleepHours ? `${log.sleepHours}h` : "Not logged"} />
        <SummaryCard icon={<FiTrendingUp />} label="Steps" value={log.steps ? log.steps.toLocaleString() : "Not logged"} />
        <SummaryCard icon={<FiSmile />} label="Mood" value={log.mood || "Check in"} />
      </section>

      <section className="rounded-[24px] border border-white/30 bg-white/75 p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <FiBell className="mt-1 text-xl text-[#b26d83]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Next Reminder</p>
            <h3 className="font-black">{upcoming ? upcoming.title : "No reminders yet"}</h3>
            <p className="text-sm font-bold text-[#7c6460]">
              {upcoming ? formatReminderDate(upcoming.date, upcoming.time) : "Mochi can help you remember gently."}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

function SummaryCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-[24px] border border-white/30 bg-white/75 p-4 shadow-lg">
      <div className="text-2xl text-[#b26d83]">{icon}</div>
      <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#b26d83]">{label}</p>
      <h3 className="text-lg font-black">{value}</h3>
    </article>
  );
}
