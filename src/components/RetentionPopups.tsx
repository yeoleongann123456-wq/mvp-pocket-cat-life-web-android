import { useEffect } from "react";
import { FiAward, FiGift, FiX } from "react-icons/fi";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";
import { getCatDisplayName } from "../utils/catName";

export default function RetentionPopups() {
  const profileCatName = useMochiStore((state) => state.profile.catName);
  const activeEvent = useMochiStore((state) => state.retention.activeEvent);
  const activeAchievement = useMochiStore((state) => state.retention.activeAchievement);
  const dismissRandomEvent = useMochiStore((state) => state.dismissRandomEvent);
  const dismissAchievement = useMochiStore((state) => state.dismissAchievement);
  const catName = getCatDisplayName(profileCatName);

  useEffect(() => {
    if (activeAchievement) playMochiSound("mochiAchievement");
  }, [activeAchievement?.id]);

  return (
    <>
      {activeEvent && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#120f19]/55 px-4 backdrop-blur-sm">
          <section className="w-full max-w-[360px] rounded-[30px] border border-white/30 bg-gradient-to-br from-[#fff8e8] to-[#ffe3ec] p-5 text-[#49343a] shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff8dad] text-xl text-white shadow-lg">
                  <FiGift />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">{catName} says</p>
                  <h2 className="text-xl font-black">{activeEvent.title}</h2>
                </div>
              </div>
              <button className="rounded-full bg-white/70 p-2 text-[#7c6460]" onClick={dismissRandomEvent} type="button">
                <FiX />
              </button>
            </div>
            <p className="mt-4 text-sm font-bold leading-6 text-[#6d5551]">{activeEvent.message}</p>
            {activeEvent.reward && (
              <p className="mt-3 rounded-2xl bg-white/75 px-3 py-2 text-sm font-black">
                Reward: {activeEvent.reward.stars ?? 0} stars · {activeEvent.reward.coins ?? 0} coins · {activeEvent.reward.xp ?? 0} XP
              </p>
            )}
          </section>
        </div>
      )}

      {activeAchievement && (
        <button
          className="fixed left-1/2 top-[calc(1rem+env(safe-area-inset-top))] z-50 grid w-[min(360px,calc(100vw-2rem))] -translate-x-1/2 grid-cols-[44px_1fr] items-center gap-3 rounded-[24px] border border-white/30 bg-[#2a1c2d] p-3 text-left text-white shadow-2xl"
          onClick={dismissAchievement}
          type="button"
        >
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ffd45c] to-[#ff8dad] text-xl">
            <FiAward />
          </span>
          <span>
            <strong className="block text-sm">Achievement Unlocked</strong>
            <span className="block text-xs font-bold text-[#ffdce8]">{activeAchievement.title} · {activeAchievement.description}</span>
          </span>
        </button>
      )}
    </>
  );
}
