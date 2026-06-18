import { BREED_OPTIONS, CAT_BREEDS } from "../features/cat/breeds";
import { getRelationshipLevel } from "../features/relationship/levels";
import { useMochiStore } from "../store/useMochiStore";
import type { BreedId } from "../types/game";

export default function CatPage() {
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const updateCatName = useMochiStore((state) => state.updateCatName);
  const updateBreed = useMochiStore((state) => state.updateBreed);
  const resetMochi = useMochiStore((state) => state.resetMochi);
  const breed = CAT_BREEDS[profile.breedId];

  return (
    <section className="grid gap-4">
      <header className="rounded-[28px] bg-gradient-to-br from-[#ffe3ec] to-[#fff1cf] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Your Cat</p>
        <h2 className="mt-1 text-3xl font-black">{profile.catName}</h2>
        <p className="mt-2 text-sm font-bold text-[#7c6460]">{getRelationshipLevel(points)} · {breed.name}</p>
      </header>

      <section className="grid gap-3 rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <label className="grid gap-2 text-sm font-black">
          Cat name
          <input
            className="h-12 rounded-2xl border border-[#f1c9d5] px-4 text-base outline-none"
            maxLength={18}
            onChange={(event) => updateCatName(event.target.value)}
            value={profile.catName}
          />
        </label>
      </section>

      <section className="grid gap-3">
        {BREED_OPTIONS.map((option) => (
          <button
            className={`grid grid-cols-[54px_1fr] gap-3 rounded-3xl border p-3 text-left shadow-lg ${
              option.id === profile.breedId ? "border-[#ff8dad] bg-[#fff7fb]" : "border-white/80 bg-white/70"
            }`}
            key={option.id}
            onClick={() => updateBreed(option.id as BreedId)}
            type="button"
          >
            <span
              className="h-14 w-14 rounded-2xl border-4 border-white shadow-inner"
              style={{ background: `linear-gradient(135deg, ${option.colors.secondary}, ${option.colors.primary})` }}
            />
            <span>
              <strong className="block">{option.name}</strong>
              <span className="mt-1 block text-xs font-bold leading-5 text-[#7b6461]">
                {option.dialogueStyle}. Reminders are {option.reminderTone}.
              </span>
            </span>
          </button>
        ))}
      </section>

      <button
        className="rounded-2xl bg-[#c95b7f] px-4 py-3 font-black text-white shadow-xl"
        onClick={() => {
          if (confirm("Reset Mochi and clear local app data?")) resetMochi();
        }}
        type="button"
      >
        Reset Mochi
      </button>
    </section>
  );
}
