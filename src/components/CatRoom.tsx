import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import type { CSSProperties } from "react";
import type { CatBreed } from "../types/game";
import type { WorldPhase } from "../features/retention/retention";

export type CatExpression = "happy" | "sleepy" | "worried" | "proud" | "hungry" | "excited" | "sad";
type CatInteraction = "tap" | "doubleTap" | "longPress" | "drag";

type CatRoomProps = {
  breed: CatBreed;
  catName: string;
  ownedItems?: string[];
  expression?: CatExpression;
  action?: string;
  worldPhase?: WorldPhase;
  compact?: boolean;
  onCatInteract?: (interaction: CatInteraction) => void;
};

type BreedVisual = {
  className: string;
  headScale: number;
  bodyScale: number;
  eyeScale: number;
  tail: "plume" | "curl" | "stubby" | "dragon";
  pose: "perky" | "gentle" | "loaf" | "sneaky" | "bouncy" | "royal";
  markings: "stripes" | "mask" | "round" | "moon" | "socks" | "spark";
};

const BREED_VISUALS: Record<string, BreedVisual> = {
  orange: { className: "breed-orange", headScale: 1.08, bodyScale: 0.92, eyeScale: 1.12, tail: "plume", pose: "perky", markings: "stripes" },
  ragdoll: { className: "breed-ragdoll", headScale: 1.1, bodyScale: 0.9, eyeScale: 1.08, tail: "plume", pose: "gentle", markings: "mask" },
  british: { className: "breed-british", headScale: 1.13, bodyScale: 1.04, eyeScale: 1, tail: "stubby", pose: "loaf", markings: "round" },
  black: { className: "breed-black", headScale: 1.04, bodyScale: 0.88, eyeScale: 1.16, tail: "curl", pose: "sneaky", markings: "moon" },
  munchkin: { className: "breed-munchkin", headScale: 1.12, bodyScale: 0.78, eyeScale: 1.15, tail: "plume", pose: "bouncy", markings: "socks" },
  dragon: { className: "breed-dragon", headScale: 1.08, bodyScale: 0.96, eyeScale: 1.13, tail: "dragon", pose: "royal", markings: "spark" }
};

export default function CatRoom({
  breed,
  catName,
  ownedItems = [],
  expression = "happy",
  action = "idle",
  worldPhase = "morning",
  compact = false,
  onCatInteract
}: CatRoomProps) {
  const [touchMood, setTouchMood] = useState<CatExpression | null>(null);
  const [touchAction, setTouchAction] = useState<string | null>(null);
  const longPressTimer = useRef<number | null>(null);
  const visual = BREED_VISUALS[breed.id] ?? BREED_VISUALS.orange;
  const has = (itemId: string) => ownedItems.includes(itemId);
  const activeExpression = touchMood ?? expression;
  const activeAction = touchAction ?? action;
  const catStyle = {
    "--cat-primary": breed.colors.primary,
    "--cat-secondary": breed.colors.secondary,
    "--cat-accent": breed.colors.accent,
    "--head-scale": visual.headScale,
    "--body-scale": visual.bodyScale,
    "--eye-scale": visual.eyeScale
  } as CSSProperties;

  function pulse(interaction: CatInteraction, mood: CatExpression, nextAction: string, duration = 900) {
    setTouchMood(mood);
    setTouchAction(nextAction);
    onCatInteract?.(interaction);
    window.setTimeout(() => {
      setTouchMood(null);
      setTouchAction(null);
    }, duration);
  }

  function startLongPress() {
    if (longPressTimer.current) window.clearTimeout(longPressTimer.current);
    longPressTimer.current = window.setTimeout(() => pulse("longPress", "happy", "purr", 1200), 460);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  return (
    <section className={`room-scene world-${worldPhase} relative overflow-hidden rounded-[28px] border border-white/30 shadow-2xl ${compact ? "room-compact" : ""}`}>
      <RoomLayers has={has} compact={compact} worldPhase={worldPhase} />
      <motion.div
        animate={animationFor(activeAction)}
        className={`cat-mascot ${visual.className} pose-${visual.pose} expression-${activeExpression} action-${activeAction} tail-${visual.tail} markings-${visual.markings} absolute left-1/2 select-none`}
        drag
        dragConstraints={{ left: -18, right: 18, top: -12, bottom: 12 }}
        dragElastic={0.42}
        onDoubleClick={() => pulse("doubleTap", "excited", "jump", 1000)}
        onDragEnd={() => pulse("drag", "excited", "swish", 700)}
        onPointerCancel={cancelLongPress}
        onPointerDown={startLongPress}
        onPointerLeave={cancelLongPress}
        onPointerUp={cancelLongPress}
        onTap={() => pulse("tap", "happy", "tap-heart", 850)}
        style={catStyle}
        transition={transitionFor(activeAction)}
      >
        <span className="cat-shadow" />
        <span className="cat-tail" />
        <span className="cat-body">
          <span className="cat-belly" />
          <span className="cat-paw cat-paw-left" />
          <span className="cat-paw cat-paw-right" />
        </span>
        <span className="cat-head">
          <span className="cat-ear cat-ear-left"><span /></span>
          <span className="cat-ear cat-ear-right"><span /></span>
          <span className="cat-plush-fluff fluff-left" />
          <span className="cat-plush-fluff fluff-right" />
          <span className="cat-fur-mark cat-fur-mark-one" />
          <span className="cat-fur-mark cat-fur-mark-two" />
          <span className="cat-cheek cat-cheek-left" />
          <span className="cat-cheek cat-cheek-right" />
          <Eye expression={activeExpression} side="left" />
          <Eye expression={activeExpression} side="right" />
          <span className="cat-nose" />
          <Mouth expression={activeExpression} />
          <span className="cat-yawn" />
          <span className="cat-whisker cat-whisker-left" />
          <span className="cat-whisker cat-whisker-right" />
          {(has("rose-collar") || breed.id === "dragon") && <span className="cat-collar" />}
        </span>
        {breed.id === "dragon" && (
          <>
            <span className="dragon-horn dragon-horn-left" />
            <span className="dragon-horn dragon-horn-right" />
            <span className="dragon-orb" />
          </>
        )}
        {activeAction === "feed" && <span className="action-prop food-bowl"><span /></span>}
        {(activeAction === "play" || activeAction === "toy") && <span className="action-prop yarn-ball" />}
        {(activeAction === "pet" || activeAction === "tap-heart" || activeAction === "purr") && <Hearts />}
        {(activeAction === "sleep" || activeAction === "nap") && <Zzz />}
      </motion.div>
      {activeAction !== "idle" && <div className="floating-reward absolute left-1/2 top-24 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#49343a] shadow-xl">+care</div>}
      {catName && (
        <div className="absolute bottom-4 left-4 rounded-full bg-black/25 px-4 py-2 text-sm font-black text-white backdrop-blur">
          {catName}
        </div>
      )}
    </section>
  );
}

function RoomLayers({ has, compact, worldPhase }: { has: (itemId: string) => boolean; compact: boolean; worldPhase: WorldPhase }) {
  return (
    <>
      <span className="room-sunbeam" />
      <div className={`room-window absolute left-7 top-6 h-24 w-32 rounded-2xl border-[7px] border-[#fff0dd] shadow-xl ${has("moon-window") ? "night-window" : ""}`}>
        {(has("moon-window") || worldPhase === "night") && <span className="absolute right-5 top-4 h-7 w-7 rounded-full bg-[#fff1a8] shadow-[0_0_18px_rgba(255,241,168,.8)]" />}
        {worldPhase === "rain" && <span className="room-rain" />}
        <div className="absolute inset-y-0 left-1/2 w-1 bg-white/70" />
        <div className="absolute inset-x-0 top-1/2 h-1 bg-white/70" />
      </div>
      <div className="absolute left-3 top-0 h-36 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      <div className="absolute left-40 top-0 h-32 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      {(has("wood-shelf") || !compact) && (
        <div className="room-cabinet absolute right-6 top-28 h-16 w-28 rounded-xl bg-gradient-to-b from-[#d78a55] to-[#a75f35] shadow-xl">
          <span className="absolute left-3 top-3 h-5 w-5 rounded bg-white/25" />
          <span className="absolute right-3 top-3 h-5 w-5 rounded bg-white/25" />
          <span className="absolute bottom-2 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-black/15" />
        </div>
      )}
      {has("leaf-plant") && (
        <div className="room-plant absolute right-28 top-24 h-11 w-8 rounded-b-lg bg-[#c58150] shadow-lg">
          <span className="absolute -left-4 -top-8 h-10 w-7 rotate-[-30deg] rounded-full bg-[#6fb780]" />
          <span className="absolute left-1 -top-10 h-12 w-7 rounded-full bg-[#7bc58c]" />
          <span className="absolute -right-4 -top-8 h-10 w-7 rotate-[30deg] rounded-full bg-[#6fb780]" />
        </div>
      )}
      {has("cat-bed") && <div className="room-cat-bed absolute bottom-10 left-6 h-14 w-24 rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#ffabc3] to-[#e9799b] shadow-xl"><span className="absolute inset-x-4 bottom-3 h-5 rounded-full bg-white/45" /></div>}
      {has("yarn-toy") && <div className="room-yarn absolute bottom-16 right-11 h-10 w-10 rounded-full bg-[#8ecae6] shadow-lg before:absolute before:inset-y-0 before:left-1/2 before:w-1 before:bg-white/70 after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:bg-white/70" />}
      <div className={`room-rug absolute bottom-8 left-1/2 h-24 w-64 -translate-x-1/2 rounded-[50%] opacity-95 blur-[0.2px] ${has("sunny-rug") ? "bg-gradient-to-br from-[#ffd45c] to-[#ffabc3]" : "bg-gradient-to-br from-[#d8cbff] to-[#f2c4df]"}`} />
    </>
  );
}

function Eye({ expression, side }: { expression: CatExpression; side: "left" | "right" }) {
  return (
    <span className={`cat-eye cat-eye-${side}`}>
      <span className="cat-eye-gloss" />
      <span className="cat-eye-spark" />
      {expression === "worried" && <span className="cat-brow worried-brow" />}
      {expression === "proud" && <span className="cat-brow proud-brow" />}
    </span>
  );
}

function Mouth({ expression }: { expression: CatExpression }) {
  return <span className={`cat-mouth mouth-${expression}`} />;
}

function Hearts() {
  return (
    <>
      <span className="heart-particle heart-one" />
      <span className="heart-particle heart-two" />
      <span className="heart-particle heart-three" />
    </>
  );
}

function Zzz() {
  return (
    <>
      <span className="zzz zzz-one">Z</span>
      <span className="zzz zzz-two">z</span>
      <span className="zzz zzz-three">z</span>
    </>
  );
}

function animationFor(action: string) {
  if (action === "walk") return { x: [-18, 18, -8, 0], y: [0, -2, 0, -1, 0], rotate: [0, -2, 2, 0] };
  if (action === "sit") return { y: [0, 5, 4], scale: [1, 0.985, 0.99] };
  if (action === "nap") return { y: [0, 7], rotate: [-1, -7], scale: [1, 0.97] };
  if (action === "stretch") return { scaleX: [1, 1.08, 1.02], scaleY: [1, 0.94, 1], y: [0, 5, 0] };
  if (action === "window") return { x: [0, -14, -14, 0], rotate: [0, -4, -4, 0] };
  if (action === "toy") return { x: [0, -14, 16, -8, 0], y: [0, -8, -4, -10, 0], rotate: [0, -8, 10, -5, 0] };
  if (action === "groom") return { rotate: [0, -3, 3, -2, 0], y: [0, 2, 0] };
  if (action === "look") return { y: [0, -4, 0], scale: [1, 1.015, 1] };
  if (action === "play" || action === "jump") return { y: [0, -24, 0], rotate: [0, -8, 8, 0], scale: [1, 1.04, 1] };
  if (action === "sleep") return { y: [0, 8], rotate: [-1, -9], scale: [1, 0.96] };
  if (action === "feed") return { y: [0, 7, 0, 5, 0], rotate: [0, 1, 0, -1, 0] };
  if (action === "clean") return { x: [0, -7, 8, -5, 4, 0], rotate: [0, -3, 3, -2, 2, 0] };
  if (action === "work") return { y: [0, -10, 0], rotate: [0, 4, 0] };
  if (action === "purr") return { y: [0, -2, 0], scale: [1, 1.025, 1] };
  if (action === "swish") return { x: [0, 10, -10, 0], rotate: [0, 3, -3, 0] };
  return { y: [0, -5, 0] };
}

function transitionFor(action: string): Transition {
  if (action === "idle") return { duration: 3.2, repeat: Infinity, ease: "easeInOut" };
  if (["walk", "sit", "nap", "stretch", "window", "toy", "groom", "look"].includes(action)) return { duration: 3.8, ease: "easeInOut" };
  if (action === "sleep") return { duration: 0.8, ease: "easeInOut" };
  return { duration: 0.72, ease: "easeOut" };
}
