import { useMemo, useState } from "react";
import { FiArchive, FiLock, FiStar } from "react-icons/fi";
import { BREED_OPTIONS } from "../features/cat/breeds";
import { CAT_UNLOCKS } from "../features/cat/unlocks";
import { collectionItems } from "../features/retention/retention";
import { getRelationshipLevel } from "../features/relationship/levels";
import { useMochiStore } from "../store/useMochiStore";

const categories = ["Cats", "Furniture", "Toys", "Collars", "Rare Items"] as const;
type CollectionCategory = (typeof categories)[number];

export default function CollectionPage() {
  const [category, setCategory] = useState<CollectionCategory>("Cats");
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const ownedItems = useMochiStore((state) => state.ownedItems ?? []);
  const healthLogs = useMochiStore((state) => state.healthLogs);
  const tasks = useMochiStore((state) => state.tasks);
  const reminders = useMochiStore((state) => state.reminders);
  const retention = useMochiStore((state) => state.retention);
  const tasksCompleted = tasks.filter((task) => task.completed).length;
  const unlockContext = { healthLogs, tasksCompleted, relationshipPoints: points, reminders };
  const items = useMemo(() => collectionItems(), []);
  const normalizedItems = items.map((item) => ({ ...item, category: normalizeCategory(item.category) }));
  const collected = normalizedItems.filter((item) => isCollected(item.id, ownedItems, retention, points, unlockContext)).length;
  const visibleItems = normalizedItems.filter((item) => item.category === category);
  const categoryCollected = visibleItems.filter((item) => isCollected(item.id, ownedItems, retention, points, unlockContext)).length;

  return (
    <section className="grid gap-4">
      <header className="rounded-[30px] bg-gradient-to-br from-[#dff4ff] via-[#ffe2ec] to-[#fff3c9] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Collection Book</p>
        <h2 className="mt-1 text-3xl font-black">Unlock reasons to return</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-[#735c58]">
          Unknown items stay visible as ??? so long-term goals are always on the table.
        </p>
        <div className="mt-4 rounded-2xl bg-white/70 p-3 shadow-inner">
          <div className="flex items-center justify-between text-sm font-black">
            <span>Total Progress</span>
            <span>{collected} / {normalizedItems.length} collected</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-[#efe2e5]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#ff8dad] to-[#ffd45c]" style={{ width: `${Math.round((collected / normalizedItems.length) * 100)}%` }} />
          </div>
        </div>
      </header>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
        {categories.map((item) => (
          <button className={`min-w-max rounded-full px-3 py-2 text-xs font-black shadow ${category === item ? "bg-[#49343a] text-white" : "bg-white/80 text-[#49343a]"}`} key={item} onClick={() => setCategory(item)} type="button">
            {item}
          </button>
        ))}
      </div>

      <section className="rounded-[28px] border border-white/40 bg-white/80 p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-black">{category}</h3>
          <span className="rounded-full bg-[#2a1c2d]/10 px-3 py-1 text-xs font-black">{categoryCollected} / {visibleItems.length}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visibleItems.map((item) => {
            const unlocked = isCollected(item.id, ownedItems, retention, points, unlockContext);
            return (
              <article className={`rounded-[24px] border p-3 shadow-lg ${unlocked ? "border-white/70 bg-white" : "border-[#d8c8ce] bg-[#f3edf0]"}`} key={item.id}>
                <div className={`grid h-20 place-items-center rounded-2xl text-3xl shadow-inner ${unlocked ? "bg-gradient-to-br from-[#fff3c9] to-[#ffe2ec]" : "bg-[#d8c8ce] text-white"}`}>
                  {unlocked ? iconFor(item.category, item.id) : <FiLock />}
                </div>
                <h4 className="mt-3 truncate text-sm font-black">{unlocked ? item.name : "???"}</h4>
                <p className="mt-1 min-h-8 text-[0.68rem] font-bold leading-4 text-[#7c6460]">{item.requirement}</p>
                <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[0.62rem] font-black ${unlocked ? "bg-[#dff4e8] text-[#407455]" : "bg-[#2a1c2d]/10 text-[#806a66]"}`}>
                  {unlocked ? "Collected" : "Locked"}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3">
        <h3 className="text-xl font-black text-white">Future Teases</h3>
        <Tease title="Rare Cats" detail="More personalities unlock from streaks and relationship milestones." />
        <Tease title="Special Rooms" detail="Room themes unlock from 14 and 30 day return streaks." />
        <Tease title="Legendary Toys" detail="Premium-feeling toy goals unlock after Soul Companion." />
      </section>
    </section>
  );
}

function normalizeCategory(category: string): CollectionCategory {
  if (category === "Collar") return "Collars";
  if (category === "Room" || category === "Window") return "Furniture";
  if (category === "Cat Bed" || category === "Rug" || category === "Plants" || category === "Furniture") return "Furniture";
  if (category === "Toys") return "Toys";
  if (category === "Cats") return "Cats";
  return "Rare Items";
}

function isCollected(
  id: string,
  ownedItems: string[],
  retention: ReturnType<typeof useMochiStore.getState>["retention"],
  points: number,
  unlockContext: Parameters<(typeof CAT_UNLOCKS)[keyof typeof CAT_UNLOCKS]["isUnlocked"]>[0]
) {
  if (id.startsWith("cat-")) {
    const breedId = id.replace("cat-", "") as keyof typeof CAT_UNLOCKS;
    return CAT_UNLOCKS[breedId]?.isUnlocked(unlockContext) ?? false;
  }
  if (ownedItems.includes(id)) return true;
  if (id === "rare-golden-yarn") return retention.streaks.dailyVisits >= 7;
  if (id === "rare-legend-room") return retention.streaks.dailyVisits >= 30;
  if (id === "rare-dragon-toy") return getRelationshipLevel(points) === "Soul Companion";
  return false;
}

function iconFor(category: CollectionCategory, id: string) {
  if (category === "Cats") {
    const breed = BREED_OPTIONS.find((item) => id === `cat-${item.id}`);
    return breed?.id === "black" ? "●" : "🐾";
  }
  if (category === "Furniture") return "🛋";
  if (category === "Toys") return "🧶";
  if (category === "Collars") return "🔔";
  return <FiStar />;
}

function Tease({ title, detail }: { title: string; detail: string }) {
  return (
    <article className="flex items-start gap-3 rounded-[24px] border border-white/30 bg-white/80 p-4 shadow-lg">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#2a1c2d] text-white">
        <FiArchive />
      </div>
      <div>
        <h4 className="font-black">{title}</h4>
        <p className="mt-1 text-sm font-bold leading-5 text-[#7c6460]">{detail}</p>
      </div>
    </article>
  );
}
