import { motion } from "framer-motion";
import type { CatBreed } from "../types/game";

type CatRoomProps = {
  breed: CatBreed;
  catName: string;
};

export default function CatRoom({ breed, catName }: CatRoomProps) {
  return (
    <section className="room-scene relative overflow-hidden rounded-[28px] border border-white/30 shadow-2xl">
      <div className="absolute left-10 top-6 h-24 w-32 rounded-2xl border-[7px] border-[#fff0dd] bg-gradient-to-b from-[#9ed7ff] to-[#b9e8c1] shadow-xl">
        <div className="absolute inset-y-0 left-1/2 w-1 bg-white/70" />
        <div className="absolute inset-x-0 top-1/2 h-1 bg-white/70" />
      </div>
      <div className="absolute left-5 top-0 h-36 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      <div className="absolute left-40 top-0 h-32 w-10 rounded-b-full bg-gradient-to-b from-[#ffd2b9] to-[#e99679]" />
      <div className="absolute right-7 top-28 h-16 w-24 rounded-xl bg-gradient-to-b from-[#d78a55] to-[#a75f35] shadow-xl">
        <div className="mx-auto mt-3 grid w-16 grid-cols-2 gap-2">
          <span className="h-5 rounded bg-white/20" />
          <span className="h-5 rounded bg-white/20" />
        </div>
      </div>
      <div className="absolute right-28 top-24 h-11 w-8 rounded-b-lg bg-[#c58150]">
        <span className="absolute -left-4 -top-8 h-10 w-7 rotate-[-30deg] rounded-full bg-[#6fb780]" />
        <span className="absolute left-1 -top-10 h-12 w-7 rounded-full bg-[#7bc58c]" />
        <span className="absolute -right-4 -top-8 h-10 w-7 rotate-[30deg] rounded-full bg-[#6fb780]" />
      </div>
      <div className="absolute bottom-8 left-1/2 h-24 w-64 -translate-x-1/2 rounded-[50%] bg-gradient-to-br from-[#d8cbff] to-[#f2c4df] opacity-90 blur-[0.2px]" />
      <motion.div
        animate={{ y: [0, -7, 0] }}
        className="absolute bottom-16 left-1/2 h-48 w-44 -translate-x-1/2"
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="cat-tail absolute bottom-11 right-0 h-16 w-20 rounded-r-full border-[12px] border-l-0" style={{ borderColor: breed.colors.primary }} />
        <div className="absolute left-10 top-8 h-28 w-28 rounded-[46%] border-[4px] border-[#5e443d] shadow-inner" style={{ background: `linear-gradient(135deg, #fff8ed, ${breed.colors.secondary}, ${breed.colors.primary})` }}>
          <span className="absolute -left-2 top-9 h-8 w-6 rounded-full bg-[#ff8dad]/60 blur-[1px]" />
          <span className="absolute -right-2 top-9 h-8 w-6 rounded-full bg-[#ff8dad]/60 blur-[1px]" />
          <span className="absolute left-8 top-10 h-7 w-5 rounded-full bg-[#211a1a] shadow-[inset_5px_4px_0_rgba(255,255,255,.85)]" />
          <span className="absolute right-8 top-10 h-7 w-5 rounded-full bg-[#211a1a] shadow-[inset_5px_4px_0_rgba(255,255,255,.85)]" />
          <span className="absolute left-1/2 top-[68px] h-3 w-4 -translate-x-1/2 rounded-full bg-[#ef889c]" />
          <span className="absolute left-1/2 top-[82px] h-3 w-8 -translate-x-1/2 rounded-b-full border-b-4 border-[#6c5b51]" />
        </div>
        <div className="absolute left-10 top-2 h-14 w-14 rotate-45 rounded-md border-[4px] border-[#5e443d]" style={{ background: breed.colors.primary }} />
        <div className="absolute right-6 top-2 h-14 w-14 rotate-45 rounded-md border-[4px] border-[#5e443d]" style={{ background: breed.colors.primary }} />
        <div className="absolute bottom-0 left-12 h-24 w-24 rounded-[48%] border-[4px] border-[#5e443d]" style={{ background: `linear-gradient(135deg, ${breed.colors.secondary}, ${breed.colors.primary})` }}>
          <span className="absolute -bottom-2 left-4 h-8 w-8 rounded-full border-[4px] border-[#5e443d] bg-[#fff1cf]" />
          <span className="absolute -bottom-2 right-4 h-8 w-8 rounded-full border-[4px] border-[#5e443d] bg-[#fff1cf]" />
        </div>
      </motion.div>
      <div className="absolute bottom-4 left-4 rounded-full bg-black/25 px-4 py-2 text-sm font-black text-white backdrop-blur">
        {catName}
      </div>
    </section>
  );
}
