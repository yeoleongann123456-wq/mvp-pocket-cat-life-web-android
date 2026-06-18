import { useGameStore } from "../store/useGameStore";

export default function SettingsPage() {
  const catName = useGameStore((state) => state.catName);
  const setCatName = useGameStore((state) => state.setCatName);

  return (
    <section className="grid gap-3">
      <p className="text-xs font-bold uppercase tracking-wide text-mochi-rose">Future React Settings</p>
      <label className="grid gap-2 text-sm font-bold">
        Cat name
        <input
          className="rounded-lg border border-white/10 bg-white/90 px-3 py-2 text-mochi-ink"
          maxLength={18}
          onChange={(event) => setCatName(event.target.value)}
          value={catName}
        />
      </label>
      <p className="text-sm font-semibold text-mochi-peach">
        This shell is prepared for future migration. The current production settings remain in the legacy game.
      </p>
    </section>
  );
}
