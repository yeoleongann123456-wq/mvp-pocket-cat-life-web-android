import { useState } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { BREED_OPTIONS } from "../features/cat/breeds";
import { playMochiSound } from "../hooks/useMochiAudio";
import type { BreedId, CatBreed } from "../types/game";

type OnboardingProps = {
  onComplete: (catName: string, breedId: BreedId) => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [catName, setCatName] = useState("");
  const [breedId, setBreedId] = useState<BreedId | null>(null);
  const displayName = catName.trim();
  const selectedBreed = BREED_OPTIONS.find((breed) => breed.id === breedId);
  const buttonLabel = displayName ? `Meet ${displayName}` : "Meet your cat";
  const valueLine = selectedBreed
    ? `Your ${selectedBreed.name} will ${carePromiseFor(selectedBreed.id)}`
    : "Your cat will remind you to drink water, finish tasks, and take care of yourself.";

  function chooseBreed(nextBreedId: BreedId) {
    setBreedId(nextBreedId);
    playMochiSound("meow");
  }

  function complete() {
    if (!breedId) return;
    onComplete(catName, breedId);
  }

  return (
    <main className="min-h-screen bg-mochi-bg px-4 py-6 text-[#49343a]">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid max-w-[430px] gap-5 rounded-[32px] bg-white/80 p-5 shadow-2xl backdrop-blur"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="rounded-[28px] bg-gradient-to-br from-[#fff1cf] via-[#ffe3ec] to-[#d8cbff] p-5">
          <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Mochi - The Cat That Cares</p>
          <h1 className="mt-2 text-4xl font-black leading-tight">Not a pet. A cat that cares.</h1>
          <p className="mt-3 text-sm font-bold leading-6 text-[#765b58]">
            Your cat helps you remember water, rest, steps, moods, tasks, and tiny acts of self-care.
          </p>
        </div>

        <label className="grid gap-2 text-sm font-black">
          Name your cat
          <input
            className="h-12 rounded-2xl border border-[#f1c9d5] bg-white px-4 text-base outline-none focus:ring-4 focus:ring-[#ffabc3]/30"
            maxLength={18}
            onChange={(event) => setCatName(event.target.value)}
            placeholder="Mochi"
            value={catName}
          />
        </label>

        <section className="grid gap-3">
          <h2 className="text-lg font-black">Choose your caring cat</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {BREED_OPTIONS.map((breed) => (
              <button
                className={`group relative grid grid-cols-[74px_1fr] gap-3 overflow-hidden rounded-3xl border p-3 text-left shadow-lg transition active:scale-[0.98] ${
                  breed.id === breedId ? "border-[#ff8dad] bg-[#fff7fb]" : "border-white/80 bg-white/70"
                }`}
                key={breed.id}
                onClick={() => chooseBreed(breed.id)}
                type="button"
              >
                {breed.id === breedId && (
                  <>
                    <span className="select-heart select-heart-one" />
                    <span className="select-heart select-heart-two" />
                  </>
                )}
                <OnboardingCatPreview breed={breed} selected={breed.id === breedId} size="small" />
                <span>
                  <strong className="block text-base">{breed.name}</strong>
                  <span className="mt-1 block text-xs font-bold leading-5 text-[#7b6461]">
                    {shortPersonalityFor(breed.id)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/60 bg-gradient-to-br from-[#fff8e8] to-[#ffe3ec] p-4 shadow-xl">
          {selectedBreed ? (
            <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
              <div className="rounded-[26px] bg-white/55 p-3 shadow-inner">
                <OnboardingCatPreview breed={selectedBreed} selected size="large" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Selected Preview</p>
                <h3 className="mt-1 text-2xl font-black">{selectedBreed.name}</h3>
                <p className="mt-2 text-sm font-bold leading-6 text-[#6f5754]">
                  <strong>Personality:</strong> {personalityFor(selectedBreed.id)}
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-[#6f5754]">
                  <strong>How it cares:</strong> {howItCaresFor(selectedBreed.id)}
                </p>
                <p className="mt-1 text-sm font-bold leading-6 text-[#6f5754]">
                  <strong>Tone:</strong> {toneFor(selectedBreed.id)}
                </p>
                <span className="mt-3 inline-flex rounded-full bg-[#49343a] px-3 py-1 text-xs font-black text-white">
                  Initial companion
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] bg-white/60 p-4 text-center">
              <p className="text-sm font-black text-[#b26d83]">Choose your companion first</p>
              <p className="mt-1 text-sm font-bold leading-6 text-[#6f5754]">
                Pick the cat whose care style feels right for you.
              </p>
            </div>
          )}
        </section>

        <p className="rounded-[22px] bg-white/70 px-4 py-3 text-center text-sm font-black leading-6 text-[#6f5754] shadow-inner">
          {valueLine}
        </p>
        {!breedId && (
          <p className="-mb-2 text-center text-xs font-black uppercase tracking-wide text-[#b26d83]">
            Choose your companion first
          </p>
        )}
        <button
          className={`min-h-14 rounded-2xl text-base font-black shadow-xl transition ${
            breedId
              ? "bg-gradient-to-r from-[#ff8dad] to-[#ffc36f] text-white active:scale-[0.98]"
              : "bg-[#ddd2d5] text-[#8a7472]"
          }`}
          disabled={!breedId}
          onClick={complete}
          type="button"
        >
          {buttonLabel}
        </button>
      </motion.section>
    </main>
  );
}

function OnboardingCatPreview({ breed, selected, size }: { breed: CatBreed; selected: boolean; size: "small" | "large" }) {
  const visual = visualFor(breed.id);
  return (
    <span
      className={`onboarding-cat onboarding-cat-${breed.id} ${selected ? "is-selected" : ""} ${size === "large" ? "is-large" : ""}`}
      style={{
        "--preview-primary": breed.colors.primary,
        "--preview-secondary": breed.colors.secondary,
        "--preview-accent": breed.colors.accent,
        "--preview-body": visual.body,
        "--preview-tail": visual.tail,
        "--preview-eye": visual.eye
      } as CSSProperties}
      aria-hidden="true"
    >
      <span className="preview-tail" />
      <span className="preview-body">
        <span className="preview-belly" />
        <span className="preview-paw preview-paw-left" />
        <span className="preview-paw preview-paw-right" />
      </span>
      <span className="preview-head">
        <span className="preview-ear preview-ear-left" />
        <span className="preview-ear preview-ear-right" />
        <span className="preview-mark preview-mark-one" />
        <span className="preview-mark preview-mark-two" />
        <span className="preview-eye preview-eye-left" />
        <span className="preview-eye preview-eye-right" />
        <span className="preview-cheek preview-cheek-left" />
        <span className="preview-cheek preview-cheek-right" />
        <span className="preview-nose" />
        <span className="preview-mouth" />
      </span>
      {breed.id === "dragon" && (
        <>
          <span className="preview-horn preview-horn-left" />
          <span className="preview-horn preview-horn-right" />
        </>
      )}
    </span>
  );
}

function visualFor(breedId: BreedId) {
  const map: Record<BreedId, { body: string; tail: string; eye: string }> = {
    orange: { body: "1", tail: "1", eye: "1.04" },
    ragdoll: { body: "0.96", tail: "1.06", eye: "1.02" },
    british: { body: "1.12", tail: "0.78", eye: "0.94" },
    black: { body: "0.95", tail: "1.08", eye: "1.08" },
    munchkin: { body: "0.78", tail: "1.02", eye: "1.08" },
    dragon: { body: "1", tail: "1.12", eye: "1.06" }
  };
  return map[breedId];
}

function shortPersonalityFor(breedId: BreedId) {
  const map: Record<BreedId, string> = {
    orange: "Playful, food-loving, energetic.",
    ragdoll: "Gentle, affectionate, clingy in a good way.",
    british: "Round, calm, mature, supportive.",
    black: "Cool, mysterious, disciplined.",
    munchkin: "Short-legged, funny, chaotic.",
    dragon: "Rare, lucky, protective, special."
  };
  return map[breedId];
}

function personalityFor(breedId: BreedId) {
  const map: Record<BreedId, string> = {
    orange: "Playful & food-loving",
    ragdoll: "Gentle & affectionate",
    british: "Round, calm & supportive",
    black: "Cool, mysterious & disciplined",
    munchkin: "Funny, hyper & mischievous",
    dragon: "Rare, lucky & protective"
  };
  return map[breedId];
}

function howItCaresFor(breedId: BreedId) {
  const map: Record<BreedId, string> = {
    orange: "Reminds you to eat, drink water, take breaks, and celebrate small wins.",
    ragdoll: "Checks in gently, comforts your mood, and nudges you to rest.",
    british: "Keeps your routine steady with calm reminders and practical support.",
    black: "Helps you stay disciplined with quiet, clever, moonlit nudges.",
    munchkin: "Turns care tasks into tiny chaos, jokes, and energetic encouragement.",
    dragon: "Protects your day with lucky reminders, rare praise, and big celebration energy."
  };
  return map[breedId];
}

function toneFor(breedId: BreedId) {
  const map: Record<BreedId, string> = {
    orange: "Warm, silly, energetic.",
    ragdoll: "Soft, reassuring, emotionally safe.",
    british: "Polite, composed, dependable.",
    black: "Clever, cool, tender.",
    munchkin: "Bright, funny, persistent.",
    dragon: "Sparkly, proud, protective."
  };
  return map[breedId];
}

function carePromiseFor(breedId: BreedId) {
  const map: Record<BreedId, string> = {
    orange: "cheer you up, remind you to drink water, and celebrate your small wins.",
    ragdoll: "comfort you, remind you to rest, and check in on your mood gently.",
    british: "keep your routine steady, remind you about tasks, and support small progress.",
    black: "quietly keep you focused, remind you to hydrate, and praise your discipline.",
    munchkin: "make care feel playful, nudge you often, and turn small wins into fun.",
    dragon: "protect your day, bring lucky reminders, and celebrate your care streaks."
  };
  return map[breedId];
}
