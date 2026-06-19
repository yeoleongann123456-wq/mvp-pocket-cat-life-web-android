import { useEffect, useState } from "react";
import { FiBell, FiBriefcase, FiCoffee, FiHeart, FiMoon, FiSmile, FiSun, FiTrendingUp } from "react-icons/fi";
import type { ReactNode } from "react";
import { TbDropletHeart } from "react-icons/tb";
import CatRoom from "../components/CatRoom";
import type { CatExpression } from "../components/CatRoom";
import { CAT_BREEDS } from "../features/cat/breeds";
import { autonomousBehaviorLine, breedCareDialogue, chooseAutonomousAction, memoryLine, relationshipReaction, relationshipStory, worldPhaseFor } from "../features/retention/retention";
import type { AutonomousCatAction } from "../features/retention/retention";
import { getRelationshipLevel, getRelationshipProgress } from "../features/relationship/levels";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";
import { getCatDisplayName, getCatDisplayNameUpper } from "../utils/catName";
import { formatReminderDate, getTimeGreeting } from "../utils/date";

export default function HomePage() {
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const getTodayLog = useMochiStore((state) => state.getTodayLog);
  const addWater = useMochiStore((state) => state.addWater);
  const setSleep = useMochiStore((state) => state.setSleep);
  const addRelationship = useMochiStore((state) => state.addRelationship);
  const addStars = useMochiStore((state) => state.addStars);
  const recordRetentionAction = useMochiStore((state) => state.recordRetentionAction);
  const reminders = useMochiStore((state) => state.reminders);
  const ownedItems = useMochiStore((state) => state.ownedItems ?? []);
  const retention = useMochiStore((state) => state.retention);
  const ambientTrack = useMochiStore((state) => state.audioSettings.ambientTrack);
  const [action, setAction] = useState("idle");
  const [autonomousAction, setAutonomousAction] = useState<AutonomousCatAction>("idle");
  const [autonomousLine, setAutonomousLine] = useState("");
  const [floatingText, setFloatingText] = useState("");
  const breed = CAT_BREEDS[profile.breedId];
  const catName = getCatDisplayName(profile.catName);
  const log = getTodayLog();
  const upcoming = reminders
    .filter((reminder) => !reminder.completed)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))[0];
  const level = getRelationshipLevel(points);
  const progress = getRelationshipProgress(points);
  const dailyDone = retention.dailyGoals.filter((goal) => goal.claimed).length;
  const worldPhase = worldPhaseFor(new Date(), ambientTrack);
  const roomAction = action === "idle" ? autonomousAction : action;

  const dialogue = `${getTimeGreeting()}. ${breed.greeting} ${catName} says: ${
    log.waterGlasses < 4
      ? breedCareDialogue(profile.breedId, catName, log, retention.streaks.dailyVisits)
      : log.mood
        ? `${breedCareDialogue(profile.breedId, catName, log, retention.streaks.dailyVisits)} I saw your mood check-in. That matters.`
        : `${breedCareDialogue(profile.breedId, catName, log, retention.streaks.dailyVisits)} Tell me how your heart is doing when you are ready.`
  }`;

  useEffect(() => {
    let clearActionTimer: number | undefined;
    function runAutonomousLife() {
      if (action !== "idle") return;
      const next = chooseAutonomousAction();
      setAutonomousAction(next);
      setAutonomousLine(autonomousBehaviorLine(next, catName, profile.breedId));
      clearActionTimer = window.setTimeout(() => {
        setAutonomousAction("idle");
        setAutonomousLine("");
      }, 9000);
    }
    const firstTimer = window.setTimeout(runAutonomousLife, 4500);
    const interval = window.setInterval(runAutonomousLife, 130000 + Math.floor(Math.random() * 50000));
    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(interval);
      if (clearActionTimer) window.clearTimeout(clearActionTimer);
    };
  }, [action, catName, profile.breedId]);

  function triggerAction(nextAction: string, text: string, effect: () => void) {
    effect();
    playMochiSound(soundForAction(nextAction));
    setAction(nextAction);
    setFloatingText(text);
    window.setTimeout(() => {
      setAction("idle");
      setFloatingText("");
    }, 900);
  }

  function handleCatInteract(interaction: "tap" | "doubleTap" | "longPress" | "drag") {
    if (interaction === "doubleTap") {
      addRelationship(2);
      addStars(2);
      recordRetentionAction("pet");
      playMochiSound("happy");
      setFloatingText("+Bond +Stars");
    } else if (interaction === "longPress") {
      addRelationship(2);
      recordRetentionAction("pet");
      playMochiSound("purr");
      setFloatingText("+Purr +Bond");
    } else if (interaction === "drag") {
      playMochiSound("happy");
      setFloatingText("+Play");
    } else {
      addRelationship(1);
      recordRetentionAction("pet");
      playMochiSound("meow");
      setFloatingText("+Love");
    }
    window.setTimeout(() => setFloatingText(""), 900);
  }

  return (
    <section className="grid gap-4">
      <div className="sticky top-2 z-20 grid gap-2">
        <CatRoom action={roomAction} breed={breed} catName={catName} compact expression={actionToExpression(roomAction, log.waterGlasses, log.mood)} onCatInteract={handleCatInteract} ownedItems={ownedItems} worldPhase={worldPhase} />
        {floatingText && <div className="pointer-events-none -mt-16 justify-self-center rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#49343a] shadow-xl">{floatingText}</div>}
        <section className="action-scroll -mx-1 flex gap-2 overflow-x-auto rounded-[24px] bg-[#2a1c2d]/90 p-2 shadow-xl backdrop-blur">
          <ActionButton icon={<FiCoffee />} label="Water" onClick={() => triggerAction("feed", "+Water +Bond +Stars", addWater)} />
          <ActionButton icon={<FiHeart />} label="Pet" onClick={() => triggerAction("pet", "+Mood +Bond", () => { addRelationship(2); recordRetentionAction("pet"); })} />
          <ActionButton icon={<FiSun />} label="Play" onClick={() => triggerAction("play", "+Mood +Stars", () => { addRelationship(2); addStars(4); })} />
          <ActionButton icon={<FiMoon />} label="Sleep" onClick={() => triggerAction("sleep", "+Rest +Bond", () => setSleep(8))} />
          <ActionButton icon={<FiSmile />} label="Clean" onClick={() => triggerAction("clean", "+Care +Stars", () => { addRelationship(1); addStars(3); })} />
          <ActionButton icon={<FiBriefcase />} label="Focus" onClick={() => triggerAction("work", "+Focus +Stars", () => { addRelationship(3); addStars(5); })} />
        </section>
      </div>

      <section className="rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl backdrop-blur">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">{getCatDisplayNameUpper(catName)} dialogue</p>
        <h2 className="mt-1 text-xl font-black leading-snug">{dialogue}</h2>
        <p className="mt-3 rounded-2xl bg-[#fff1f5] px-3 py-2 text-sm font-bold leading-6 text-[#735c58]">{autonomousLine || memoryLine(retention.memory, retention.streaks.dailyVisits)}</p>
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
        <p className="mt-3 text-sm font-bold leading-6 text-white/75">{relationshipStory(level)}</p>
        <p className="mt-2 text-xs font-black uppercase tracking-wide text-[#ffd45c]">{relationshipReaction(level)}</p>
      </section>

      <section className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[24px] border border-white/30 bg-white/75 p-4 shadow-lg">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Today Goal</p>
          <h3 className="font-black">{dailyDone === 3 ? "All tasks completed today!" : `${dailyDone}/3 daily rewards claimed`}</h3>
          <p className="mt-1 text-sm font-bold text-[#7c6460]">Visit streak: {retention.streaks.dailyVisits} days · Coins: {retention.coins}</p>
        </div>
        <a className="rounded-2xl bg-[#49343a] px-4 py-3 text-sm font-black text-white shadow-lg" href="#/goals">
          Goals
        </a>
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
              {upcoming ? formatReminderDate(upcoming.date, upcoming.time) : `${catName} can help you remember gently.`}
            </p>
          </div>
        </div>
      </section>
    </section>
  );
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button className="action-button grid min-w-[70px] place-items-center gap-1 rounded-2xl bg-white/10 px-3 py-2 text-xs font-black text-white shadow-lg" onClick={onClick} type="button">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ff8dad] to-[#ffd45c] text-xl text-white shadow-inner">{icon}</span>
      {label}
    </button>
  );
}

function actionToExpression(action: string, waterGlasses: number, mood: string): CatExpression {
  if (action === "sleep") return "sleepy";
  if (action === "nap") return "sleepy";
  if (action === "work") return "proud";
  if (action === "walk" || action === "look" || action === "window") return "happy";
  if (action === "groom" || action === "sit") return "proud";
  if (action === "stretch" || action === "toy") return "excited";
  if (action === "play" || action === "pet") return "excited";
  if (action === "feed") return "happy";
  if (mood === "sad" || mood === "stressed") return "sad";
  if (mood === "tired") return "sleepy";
  if (waterGlasses < 2) return "hungry";
  return "happy";
}

function soundForAction(action: string) {
  if (action === "feed") return "eat";
  if (action === "pet") return "purr";
  if (action === "play") return "happy";
  if (action === "sleep") return "sleepy";
  if (action === "clean") return "reward";
  if (action === "work") return "taskComplete";
  return "button";
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
