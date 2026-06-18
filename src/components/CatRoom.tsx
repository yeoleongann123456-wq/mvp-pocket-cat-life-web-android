import { motion } from "framer-motion";
import type { CatBreed } from "../types/game";

type CatExpression = "happy" | "sleepy" | "worried" | "proud" | "hungry" | "excited";

type CatRoomProps = {
  breed: CatBreed;
  catName: string;
  ownedItems?: string[];
  expression?: CatExpression;
  action?: string;
  compact?: boolean;
};

export default function CatRoom({ breed, catName, ownedItems = [], expression = "happy", action = "idle", compact = false }: CatRoomProps) {
  const has = (itemId: string) => ownedItems.includes(itemId);

  return (
    <section className={`room-scene relative overflow-hidden rounded-[28px] border border-white/30 shadow-2xl ${compact ? "room-compact" : ""}`}>
      <div className={`absolute left-9 top-6 h-24 w-32 rounded-2xl border-[7px] border-[#fff0dd] shadow-xl ${has("moon-window") ? "bg-gradient-to-b from-[#3d3b73] to-[#8b7bc8]" : "bg-gradient-to-b from-[#9ed7ff] to-[#b9e8c1]"}`}>
        {has("moon-window") && <span className="absolute right-5 top-4 h-7 w-7 rounded-full bg-[#fff1a8] shadow-[0_0_18px_rgba(255,241,168,.8)]" />}
        <div className="absolute inset-y-0 left-1/2 w-1 bg-white/70" />
        <div className="absolute inset-x-0 top-1/2 h-1 bg-white/70" />
      </div>
      <div className="absolute left-4 top-0 h-36 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      <div className="absolute left-40 top-0 h-32 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      {(has("wood-shelf") || !compact) && (
        <div className="absolute right-7 top-28 h-16 w-24 rounded-xl bg-gradient-to-b from-[#d78a55] to-[#a75f35] shadow-xl">
          <div className="mx-auto mt-3 grid w-16 grid-cols-2 gap-2">
            <span className="h-5 rounded bg-white/20" />
            <span className="h-5 rounded bg-white/20" />
          </div>
        </div>
      )}
      {has("leaf-plant") && (
        <div className="absolute right-28 top-24 h-11 w-8 rounded-b-lg bg-[#c58150]">
          <span className="absolute -left-4 -top-8 h-10 w-7 rotate-[-30deg] rounded-full bg-[#6fb780]" />
          <span className="absolute left-1 -top-10 h-12 w-7 rounded-full bg-[#7bc58c]" />
          <span className="absolute -right-4 -top-8 h-10 w-7 rotate-[30deg] rounded-full bg-[#6fb780]" />
        </div>
      )}
      {has("cat-bed") && <div className="absolute bottom-10 left-6 h-14 w-24 rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#ffabc3] to-[#e9799b] shadow-xl"><span className="absolute inset-x-4 bottom-3 h-5 rounded-full bg-white/45" /></div>}
      {has("yarn-toy") && <div className="absolute bottom-16 right-11 h-10 w-10 rounded-full bg-[#8ecae6] shadow-lg before:absolute before:inset-y-0 before:left-1/2 before:w-1 before:bg-white/70 after:absolute after:inset-x-0 after:top-1/2 after:h-1 after:bg-white/70" />}
      <div className={`absolute bottom-8 left-1/2 h-24 w-64 -translate-x-1/2 rounded-[50%] opacity-95 blur-[0.2px] ${has("sunny-rug") ? "bg-gradient-to-br from-[#ffd45c] to-[#ffabc3]" : "bg-gradient-to-br from-[#d8cbff] to-[#f2c4df]"}`} />
      <motion.div
        animate={action === "pet" || action === "play" ? { y: [0, -18, 0], rotate: [0, -3, 3, 0] } : { y: [0, -6, 0] }}
        className="cat-toy-body absolute bottom-14 left-1/2 h-56 w-52 -translate-x-1/2"
        transition={{ duration: action === "idle" ? 3.1 : 0.7, repeat: action === "idle" ? Infinity : 0, ease: "easeInOut" }}
      >
        <div className="cat-tail absolute bottom-14 right-3 h-16 w-24 rounded-r-full border-[13px] border-l-0" style={{ borderColor: breed.colors.primary }} />
        <div className="absolute bottom-0 left-[68px] h-20 w-20 rounded-[48%] border-[4px] border-[#5e443d]" style={{ background: `linear-gradient(135deg, ${breed.colors.secondary}, ${breed.colors.primary})` }}>
          <span className="absolute -bottom-2 left-2 h-8 w-8 rounded-full border-[4px] border-[#5e443d] bg-[#fff1cf]" />
          <span className="absolute -bottom-2 right-2 h-8 w-8 rounded-full border-[4px] border-[#5e443d] bg-[#fff1cf]" />
        </div>
        <div className="absolute left-11 top-7 h-40 w-40 rounded-[48%] border-[5px] border-[#5e443d] shadow-[inset_-18px_-18px_28px_rgba(80,45,40,.18),inset_14px_12px_18px_rgba(255,255,255,.55)]" style={{ background: `radial-gradient(circle at 30% 22%, #fff 0 12%, transparent 13%), linear-gradient(135deg, #fff8ed, ${breed.colors.secondary}, ${breed.colors.primary})` }}>
          <span className="absolute -left-2 top-20 h-8 w-8 rounded-full bg-[#ff8dad]/60 blur-[1px]" />
          <span className="absolute -right-2 top-20 h-8 w-8 rounded-full bg-[#ff8dad]/60 blur-[1px]" />
          <Eye expression={expression} side="left" />
          <Eye expression={expression} side="right" />
          <span className="absolute left-1/2 top-[88px] h-4 w-5 -translate-x-1/2 rounded-full bg-[#ef889c]" />
          <Mouth expression={expression} />
          {has("rose-collar") && <span className="absolute bottom-3 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-[#ff8dad] shadow-md after:absolute after:left-1/2 after:top-3 after:h-4 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-[#ffd45c]" />}
        </div>
        <div className="absolute left-12 top-1 h-16 w-16 rotate-45 rounded-xl border-[5px] border-[#5e443d]" style={{ background: breed.colors.primary }} />
        <div className="absolute right-9 top-1 h-16 w-16 rotate-45 rounded-xl border-[5px] border-[#5e443d]" style={{ background: breed.colors.primary }} />
        {breed.id === "dragon" && <span className="absolute right-5 top-16 h-10 w-10 rounded-full bg-[#fff1a8] shadow-[0_0_25px_rgba(255,241,168,.9)]" />}
      </motion.div>
      {action !== "idle" && <div className="floating-reward absolute left-1/2 top-24 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#49343a] shadow-xl">+Bond</div>}
      <div className="absolute bottom-4 left-4 rounded-full bg-black/25 px-4 py-2 text-sm font-black text-white backdrop-blur">
        {catName}
      </div>
    </section>
  );
}

function Eye({ expression, side }: { expression: CatExpression; side: "left" | "right" }) {
  const x = side === "left" ? "left-10" : "right-10";
  if (expression === "sleepy") return <span className={`absolute ${x} top-[66px] h-2 w-8 rounded-full bg-[#211a1a]`} />;
  if (expression === "worried" || expression === "hungry") return <span className={`absolute ${x} top-[58px] h-8 w-7 rounded-full bg-[#211a1a] shadow-[inset_6px_5px_0_rgba(255,255,255,.85)]`} />;
  if (expression === "proud") return <span className={`absolute ${x} top-[62px] h-4 w-8 rounded-full border-b-[5px] border-[#211a1a]`} />;
  return <span className={`absolute ${x} top-[54px] h-10 w-8 rounded-full bg-[#211a1a] shadow-[inset_7px_6px_0_rgba(255,255,255,.9)]`} />;
}

function Mouth({ expression }: { expression: CatExpression }) {
  if (expression === "worried" || expression === "hungry") return <span className="absolute left-1/2 top-[110px] h-4 w-5 -translate-x-1/2 rounded-full border-4 border-[#6c5b51]" />;
  if (expression === "proud") return <span className="absolute left-1/2 top-[106px] h-4 w-9 -translate-x-1/2 rounded-b-full border-b-4 border-[#6c5b51]" />;
  return <span className="absolute left-1/2 top-[104px] h-6 w-12 -translate-x-1/2 rounded-b-full border-b-[5px] border-[#6c5b51]" />;
}
