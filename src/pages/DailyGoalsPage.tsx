import { useEffect } from "react";
import { FiAward, FiCheck, FiClock, FiDroplet, FiGift, FiHeart, FiMoon, FiSmile, FiTarget } from "react-icons/fi";
import { relationshipStory } from "../features/retention/retention";
import { getRelationshipLevel } from "../features/relationship/levels";
import { useMochiStore } from "../store/useMochiStore";
import type { DailyGoalKind } from "../types/game";
import { getCatDisplayName } from "../utils/catName";

const goalIcons: Record<DailyGoalKind, typeof FiTarget> = {
  water: FiDroplet,
  pet: FiHeart,
  task: FiCheck,
  mood: FiSmile,
  sleep: FiMoon,
  reminder: FiClock
};

const milestoneDays = [3, 7, 14, 30, 100];

export default function DailyGoalsPage() {
  const profile = useMochiStore((state) => state.profile);
  const points = useMochiStore((state) => state.relationshipPoints);
  const stars = useMochiStore((state) => state.stars);
  const retention = useMochiStore((state) => state.retention);
  const ensureDailyRetention = useMochiStore((state) => state.ensureDailyRetention);
  const claimDailyGoal = useMochiStore((state) => state.claimDailyGoal);
  const catName = getCatDisplayName(profile.catName);
  const level = getRelationshipLevel(points);
  const completeCount = retention.dailyGoals.filter((goal) => goal.progress >= goal.target).length;
  const claimedCount = retention.dailyGoals.filter((goal) => goal.claimed).length;

  useEffect(() => {
    ensureDailyRetention();
  }, [ensureDailyRetention]);

  return (
    <section className="grid gap-4">
      <header className="overflow-hidden rounded-[30px] bg-gradient-to-br from-[#fff3c9] via-[#ffe2ec] to-[#dff4ff] p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#b26d83]">Daily Goals</p>
            <h2 className="mt-1 text-3xl font-black">Come back care loop</h2>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/70 text-3xl shadow-inner">
            <FiGift />
          </div>
        </div>
        <p className="mt-3 text-sm font-bold leading-6 text-[#735c58]">
          {catName} resets three gentle goals every day. Finish them for stars, coins, and relationship XP.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Pill label="Stars" value={stars} />
          <Pill label="Coins" value={retention.coins} />
          <Pill label="Done" value={`${completeCount}/3`} />
        </div>
      </header>

      {claimedCount === 3 && (
        <section className="rounded-[26px] border border-[#bdebcf] bg-[#edfff3] p-4 shadow-lg">
          <p className="text-sm font-black text-[#407455]">All tasks completed today!</p>
          <p className="mt-1 text-sm font-bold text-[#60766a]">{catName} looks proud of you.</p>
        </section>
      )}

      <section className="grid gap-3">
        {retention.dailyGoals.map((goal) => {
          const Icon = goalIcons[goal.kind];
          const percent = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          const complete = goal.progress >= goal.target;
          return (
            <article className="rounded-[28px] border border-white/40 bg-white/85 p-4 shadow-xl" key={goal.id}>
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ff8dad] to-[#ffd45c] text-xl text-white shadow-lg">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-black">{goal.title}</h3>
                      <p className="text-xs font-bold text-[#7c6460]">
                        Reward: {goal.reward.stars} stars · {goal.reward.coins} coins · {goal.reward.xp} XP
                      </p>
                    </div>
                    <span className="rounded-full bg-[#2a1c2d]/10 px-2 py-1 text-xs font-black">{goal.progress}/{goal.target}</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#efe2e5]">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#7dd6b3] to-[#ffd45c] transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
              <button
                className={`mt-4 h-12 w-full rounded-2xl text-sm font-black shadow-lg transition active:scale-95 ${
                  goal.claimed
                    ? "bg-[#8bc7a5] text-white"
                    : complete
                      ? "bg-[#49343a] text-white"
                      : "bg-[#e7dce0] text-[#806a66]"
                }`}
                disabled={!complete || goal.claimed}
                onClick={() => claimDailyGoal(goal.id)}
                type="button"
              >
                {goal.claimed ? "Claimed" : complete ? "Claim Reward" : "Keep Going"}
              </button>
            </article>
          );
        })}
      </section>

      <section className="rounded-[28px] bg-[#2a1c2d] p-4 text-white shadow-xl">
        <div className="flex items-center gap-3">
          <FiAward className="text-2xl text-[#ffd45c]" />
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#ffabc3]">Streak Badge</p>
            <h3 className="text-xl font-black">{retention.streaks.dailyVisits} day visit streak</h3>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {milestoneDays.map((day) => (
            <div className={`rounded-2xl p-2 text-center text-xs font-black ${retention.streaks.dailyVisits >= day ? "bg-[#ffd45c] text-[#49343a]" : "bg-white/10 text-white/65"}`} key={day}>
              Day {day}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-bold leading-6 text-white/75">{relationshipStory(level)}</p>
      </section>
    </section>
  );
}

function Pill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-3 py-2 text-center shadow-inner">
      <p className="text-[0.65rem] font-black uppercase tracking-wide text-[#b26d83]">{label}</p>
      <p className="text-lg font-black">{value}</p>
    </div>
  );
}
