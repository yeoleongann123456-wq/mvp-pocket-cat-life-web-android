import type { MoodValue } from "../types/game";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";

const moods: Array<{ value: MoodValue; label: string }> = [
  { value: "great", label: "Great" },
  { value: "okay", label: "Okay" },
  { value: "tired", label: "Tired" },
  { value: "stressed", label: "Stressed" },
  { value: "sad", label: "Sad" }
];

export default function HealthPage() {
  const log = useMochiStore((state) => state.getTodayLog());
  const addWater = useMochiStore((state) => state.addWater);
  const setSleep = useMochiStore((state) => state.setSleep);
  const setSteps = useMochiStore((state) => state.setSteps);
  const setMood = useMochiStore((state) => state.setMood);

  function drinkWater() {
    addWater();
    playMochiSound("reward");
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-[28px] bg-gradient-to-br from-[#fff1cf] to-[#ffdce8] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Health Companion</p>
        <h2 className="mt-1 text-3xl font-black">Small care counts.</h2>
      </header>

      <section className="rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Water</p>
            <h3 className="text-2xl font-black">{log.waterGlasses} / 8 glasses</h3>
          </div>
          <button className="rounded-2xl bg-[#8ecae6] px-4 py-3 font-black text-white shadow-lg" onClick={drinkWater}>
            + Water
          </button>
        </div>
        <div className="mt-4 grid grid-cols-8 gap-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <span
              className={`h-5 rounded-full ${index < log.waterGlasses ? "bg-[#5eb9ff]" : "bg-[#d8edf7]"}`}
              key={index}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <label className="grid gap-2 text-sm font-black">
          Sleep hours
          <input
            className="h-12 rounded-2xl border border-[#f1c9d5] px-4 text-base outline-none"
            inputMode="decimal"
            onChange={(event) => setSleep(Number(event.target.value))}
            onBlur={() => playMochiSound("sleepy")}
            placeholder="7.5"
            type="number"
            value={log.sleepHours || ""}
          />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Steps
          <input
            className="h-12 rounded-2xl border border-[#f1c9d5] px-4 text-base outline-none"
            inputMode="numeric"
            onChange={(event) => setSteps(Number(event.target.value))}
            onBlur={() => playMochiSound("reward")}
            placeholder="4200"
            type="number"
            value={log.steps || ""}
          />
        </label>
      </section>

      <section className="rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Mood Check-in</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {moods.map((mood) => (
            <button
              className={`rounded-2xl px-3 py-3 text-sm font-black shadow ${
                log.mood === mood.value ? "bg-[#ff8dad] text-white" : "bg-[#fff1f5] text-[#49343a]"
              }`}
              key={mood.value}
              onClick={() => {
                setMood(mood.value);
                playMochiSound(mood.value === "great" ? "happy" : "meow");
              }}
              type="button"
            >
              {mood.label}
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
