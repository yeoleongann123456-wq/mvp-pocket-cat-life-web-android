import { useState } from "react";
import CatRoom from "../components/CatRoom";
import { BREED_OPTIONS, CAT_BREEDS } from "../features/cat/breeds";
import { SHOP_ITEMS } from "../features/cat/shopItems";
import { CAT_UNLOCKS } from "../features/cat/unlocks";
import { getRelationshipLevel } from "../features/relationship/levels";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";
import type { BreedId, ShopCategory } from "../types/game";

const categories: Array<ShopCategory | "All"> = ["All", "Room", "Furniture", "Cat Bed", "Rug", "Window", "Plants", "Collar", "Toys"];

export default function CatPage() {
  const [category, setCategory] = useState<ShopCategory | "All">("All");
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const healthLogs = useMochiStore((state) => state.healthLogs);
  const tasks = useMochiStore((state) => state.tasks);
  const reminders = useMochiStore((state) => state.reminders);
  const stars = useMochiStore((state) => state.stars ?? 0);
  const ownedItems = useMochiStore((state) => state.ownedItems ?? []);
  const updateCatName = useMochiStore((state) => state.updateCatName);
  const updateBreed = useMochiStore((state) => state.updateBreed);
  const buyItem = useMochiStore((state) => state.buyItem);
  const resetMochi = useMochiStore((state) => state.resetMochi);
  const breed = CAT_BREEDS[profile.breedId];
  const tasksCompleted = tasks.filter((task) => task.completed).length;
  const unlockContext = { healthLogs, tasksCompleted, relationshipPoints: points, reminders };
  const visibleItems = SHOP_ITEMS.filter((item) => category === "All" || item.category === category);

  function purchaseItem(itemId: string, price: number) {
    const purchased = buyItem(itemId, price);
    playMochiSound(purchased ? "purchase" : "button");
  }

  return (
    <section className="grid gap-4">
      <header className="rounded-[28px] bg-gradient-to-br from-[#ffe3ec] to-[#fff1cf] p-5 shadow-xl">
        <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Cat Closet</p>
        <h2 className="mt-1 text-3xl font-black">{profile.catName}</h2>
        <p className="mt-2 text-sm font-bold text-[#7c6460]">{getRelationshipLevel(points)} · {breed.name} · {stars} stars</p>
      </header>

      <section className="grid gap-3 rounded-[28px] border border-white/30 bg-white/80 p-4 shadow-xl">
        <label className="grid gap-2 text-sm font-black">
          Cat name
          <input className="h-12 rounded-2xl border border-[#f1c9d5] px-4 text-base outline-none" maxLength={18} onChange={(event) => updateCatName(event.target.value)} value={profile.catName} />
        </label>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">Cat Collection</h3>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white">Unlock better cats</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {BREED_OPTIONS.map((option) => {
            const unlock = CAT_UNLOCKS[option.id];
            const unlocked = unlock.isUnlocked(unlockContext);
            return (
              <button
                className={`relative overflow-hidden rounded-[24px] border p-3 text-left shadow-lg ${option.id === profile.breedId ? "border-[#ffd45c] bg-[#fff7db]" : "border-white/40 bg-white/75"} ${unlocked ? "" : "opacity-60"}`}
                disabled={!unlocked}
                key={option.id}
                onClick={() => updateBreed(option.id as BreedId)}
                type="button"
              >
                <div className="mx-auto h-24">
                  <CatRoom breed={option} catName="" compact expression={unlocked ? "happy" : "sleepy"} ownedItems={[]} />
                </div>
                <strong className="mt-2 block text-sm">{option.name}</strong>
                <span className="mt-1 block text-[0.68rem] font-bold leading-4 text-[#7b6461]">{option.personality}</span>
                <span className="mt-2 block rounded-full bg-[#2a1c2d]/10 px-2 py-1 text-[0.62rem] font-black text-[#49343a]">{unlocked ? "Unlocked" : unlock.condition}</span>
                <span className="mt-1 block text-[0.62rem] font-bold text-[#b26d83]">{unlock.trait}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-white">Shop Preview</h3>
          <span className="rounded-full bg-[#ffd45c] px-3 py-1 text-xs font-black text-[#49343a]">{stars} stars</span>
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1">
          {categories.map((item) => (
            <button className={`min-w-max rounded-full px-3 py-2 text-xs font-black ${category === item ? "bg-[#ff8dad] text-white" : "bg-white/75 text-[#49343a]"}`} key={item} onClick={() => setCategory(item)} type="button">
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-3">
          {visibleItems.map((item) => {
            const owned = ownedItems.includes(item.id);
            const affordable = stars >= item.price;
            return (
              <article className="grid gap-3 rounded-[26px] border border-white/30 bg-white/85 p-3 shadow-xl" key={item.id}>
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <div className="overflow-hidden rounded-[22px] border border-[#f1c9d5] bg-gradient-to-br from-[#fff1cf] to-[#ffe3ec]">
                    <CatRoom breed={breed} catName="" compact expression="happy" ownedItems={[...ownedItems, item.id]} />
                  </div>
                  <div>
                    <p className="text-[0.66rem] font-black uppercase tracking-wide text-[#b26d83]">{item.category}</p>
                    <h4 className="text-lg font-black">{item.name}</h4>
                    <p className="mt-1 text-xs font-bold leading-5 text-[#7c6460]">{item.description}</p>
                    <div className="mt-2 rounded-2xl bg-[#fff1f5] p-2 text-[0.68rem] font-bold text-[#6d5551]">
                      <strong>Before:</strong> {item.preview}<br />
                      <strong>After:</strong> {item.afterPreview}
                    </div>
                  </div>
                </div>
                <button
                  className={`h-11 rounded-2xl text-sm font-black shadow ${owned ? "bg-[#8bc7a5] text-white" : affordable ? "bg-[#49343a] text-white" : "bg-[#ddd2d5] text-[#7c6460]"}`}
                  disabled={owned || !affordable}
                onClick={() => purchaseItem(item.id, item.price)}
                  type="button"
                >
                  {owned ? "Owned" : affordable ? `Buy · ${item.price} stars` : `Need ${item.price - stars} stars`}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <button className="rounded-2xl bg-[#c95b7f] px-4 py-3 font-black text-white shadow-xl" onClick={() => { if (confirm("Reset Mochi and clear local app data?")) resetMochi(); }} type="button">
        Reset Mochi
      </button>
    </section>
  );
}
