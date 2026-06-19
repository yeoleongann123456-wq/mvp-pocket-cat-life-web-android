import { useState } from "react";
import { motion } from "framer-motion";
import { BREED_OPTIONS } from "../features/cat/breeds";
import type { BreedId } from "../types/game";

type OnboardingProps = {
  onComplete: (catName: string, breedId: BreedId) => void;
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [catName, setCatName] = useState("");
  const [breedId, setBreedId] = useState<BreedId>("orange");
  const displayName = catName.trim();

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
          <div className="grid gap-3">
            {BREED_OPTIONS.map((breed) => (
              <button
                className={`grid grid-cols-[54px_1fr] gap-3 rounded-3xl border p-3 text-left shadow-lg transition ${
                  breed.id === breedId ? "border-[#ff8dad] bg-[#fff7fb]" : "border-white/80 bg-white/70"
                }`}
                key={breed.id}
                onClick={() => setBreedId(breed.id)}
                type="button"
              >
                <span
                  className="h-14 w-14 rounded-2xl border-4 border-white shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${breed.colors.secondary}, ${breed.colors.primary})` }}
                />
                <span>
                  <strong className="block text-base">{breed.name}</strong>
                  <span className="mt-1 block text-xs font-bold leading-5 text-[#7b6461]">
                    {breed.personality}. Tone: {breed.reminderTone}.
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <button
          className="min-h-14 rounded-2xl bg-gradient-to-r from-[#ff8dad] to-[#ffc36f] text-base font-black text-white shadow-xl"
          onClick={() => onComplete(catName, breedId)}
          type="button"
        >
          {displayName ? `Meet ${displayName}` : "Meet your cat"}
        </button>
      </motion.section>
    </main>
  );
}
