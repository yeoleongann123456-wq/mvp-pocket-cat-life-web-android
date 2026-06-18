import ArchitectureNotice from "../components/ArchitectureNotice";

export default function HomePage() {
  return (
    <section className="grid gap-3">
      <p className="text-xs font-bold uppercase tracking-wide text-mochi-rose">Modern Shell</p>
      <h1 className="text-2xl font-black">Mochi architecture is ready</h1>
      <ArchitectureNotice />
      <a
        className="rounded-lg bg-mochi-cream px-4 py-3 text-center text-sm font-black text-mochi-ink"
        href="./index.html"
      >
        Open current playable game
      </a>
    </section>
  );
}
