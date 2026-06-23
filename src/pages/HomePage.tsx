import { useEffect, useRef, useState } from "react";
import { FiCoffee, FiGift, FiHeart, FiMoon, FiSmile, FiSun } from "react-icons/fi";
import type { ReactNode } from "react";
import AudioControls from "../components/AudioControls";
import CatRoom from "../components/CatRoom";
import type { CatExpression } from "../components/CatRoom";
import { CAT_BREEDS } from "../features/cat/breeds";
import { autonomousBehaviorLine, breedCareDialogue, chooseAutonomousAction, memoryLine, worldPhaseFor } from "../features/retention/retention";
import type { AutonomousCatAction } from "../features/retention/retention";
import { getRelationshipLevel } from "../features/relationship/levels";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";
import { getCatDisplayName } from "../utils/catName";

export default function HomePage() {
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const getTodayLog = useMochiStore((state) => state.getTodayLog);
  const addWater = useMochiStore((state) => state.addWater);
  const setSleep = useMochiStore((state) => state.setSleep);
  const addRelationship = useMochiStore((state) => state.addRelationship);
  const addStars = useMochiStore((state) => state.addStars);
  const setMood = useMochiStore((state) => state.setMood);
  const recordRetentionAction = useMochiStore((state) => state.recordRetentionAction);
  const ownedItems = useMochiStore((state) => state.ownedItems ?? []);
  const retention = useMochiStore((state) => state.retention);
  const ambientTrack = useMochiStore((state) => state.audioSettings.ambientTrack);
  const [action, setAction] = useState("idle");
  const [autonomousAction, setAutonomousAction] = useState<AutonomousCatAction>("idle");
  const [autonomousLine, setAutonomousLine] = useState("");
  const [floatingText, setFloatingText] = useState("");
  const previousRelationshipLevel = useRef("");
  const breed = CAT_BREEDS[profile.breedId];
  const catName = getCatDisplayName(profile.catName);
  const log = getTodayLog();
  const level = getRelationshipLevel(points);
  const dailyDone = retention.dailyGoals.filter((goal) => goal.claimed).length;
  const worldPhase = worldPhaseFor(new Date(), ambientTrack);
  const roomAction = action === "idle" ? autonomousAction : action;

  useEffect(() => {
    if (!previousRelationshipLevel.current) {
      previousRelationshipLevel.current = level;
      return;
    }
    if (previousRelationshipLevel.current !== level) {
      previousRelationshipLevel.current = level;
      playMochiSound("mochiLevelUp");
    }
  }, [level]);

  const dialogue = `${
    log.waterGlasses < 4
      ? breedCareDialogue(profile.breedId, catName, log, retention.streaks.dailyVisits)
      : log.mood
        ? "I saw your mood check-in. That matters."
        : autonomousLine || memoryLine(retention.memory, retention.streaks.dailyVisits)
  }`;

  useEffect(() => {
    let clearActionTimer: number | undefined;
    function runAutonomousLife() {
      if (action !== "idle") return;
      const next = chooseAutonomousAction();
      setAutonomousAction(next);
      setAutonomousLine(autonomousBehaviorLine(next, catName, profile.breedId));
      if (next === "look") playMochiSound("mochiGreeting");
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
      playMochiSound("excited");
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
      playMochiSound("mochiGreeting");
      setFloatingText("+Love");
    }
    window.setTimeout(() => setFloatingText(""), 900);
  }

  return (
    <section className={`home-immersive home-breed-${profile.breedId}`}>
      <div className="home-status-row">
        <StatusChip label="Bond" value={level} />
        <StatusChip label="Streak" value={`${retention.streaks.dailyVisits}d`} />
        <StatusChip label="Goal" value={`${dailyDone}/3`} />
        <StatusChip label="Coins" value={retention.coins} />
      </div>
      <div className="home-audio-button">
        <AudioControls compact />
      </div>

      <CatRoom action={roomAction} breed={breed} catName={catName} compact expression={actionToExpression(roomAction, log.waterGlasses, log.mood)} immersive onCatInteract={handleCatInteract} ownedItems={ownedItems} speech={dialogue} worldPhase={worldPhase} />
      {floatingText && <div className="home-floating-text pointer-events-none rounded-full bg-white/95 px-4 py-2 text-sm font-black text-[#49343a] shadow-xl">{floatingText}</div>}

      <section className="home-action-dock action-scroll">
        <ActionButton icon={<FiCoffee />} label="Water" onClick={() => triggerAction("feed", "+Water +Bond", addWater)} />
        <ActionButton icon={<FiHeart />} label="Pet" onClick={() => triggerAction("pet", "+Bond", () => { addRelationship(2); recordRetentionAction("pet"); })} />
        <ActionButton icon={<FiSun />} label="Play" onClick={() => triggerAction("play", "+Mood", () => { addRelationship(2); addStars(4); })} />
        <ActionButton icon={<FiGift />} label="Feed" onClick={() => triggerAction("feed", "+Snack", () => { addRelationship(1); addStars(2); })} />
        <ActionButton icon={<FiMoon />} label="Sleep" onClick={() => triggerAction("sleep", "+Rest", () => setSleep(8))} />
        <ActionButton icon={<FiSmile />} label="Mood" onClick={() => triggerAction("pet", "+Mood", () => setMood("great"))} />
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

function StatusChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="home-status-chip">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
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
  if (action === "play") return "excited";
  if (action === "sleep") return "sleepy";
  if (action === "clean") return "reward";
  if (action === "work") return "taskComplete";
  return "button";
}
