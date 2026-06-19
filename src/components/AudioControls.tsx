import { useState } from "react";
import { FiMusic, FiVolume2, FiVolumeX } from "react-icons/fi";
import { playMochiSound } from "../hooks/useMochiAudio";
import { useMochiStore } from "../store/useMochiStore";
import type { AmbientTrack, MusicTrack } from "../types/game";

const musicOptions: Array<{ value: MusicTrack; label: string }> = [
  { value: "cozyPiano", label: "Cozy Piano" },
  { value: "softLofi", label: "Soft Lofi" },
  { value: "relaxing", label: "Relaxing" }
];

const ambientOptions: Array<{ value: AmbientTrack; label: string }> = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "rain", label: "Rain" },
  { value: "off", label: "Off" }
];

export default function AudioControls() {
  const [open, setOpen] = useState(false);
  const audioSettings = useMochiStore((state) => state.audioSettings);
  const updateAudioSettings = useMochiStore((state) => state.updateAudioSettings);

  function update(settings: Partial<typeof audioSettings>) {
    updateAudioSettings(settings);
    playMochiSound("button");
  }

  return (
    <section className="rounded-[24px] border border-white/20 bg-[#2a1c2d]/80 p-3 text-white shadow-xl backdrop-blur">
      <button
        className="flex w-full items-center justify-between rounded-2xl px-2 py-1 text-left"
        onClick={() => {
          setOpen((value) => !value);
          playMochiSound("button");
        }}
        type="button"
      >
        <span className="flex items-center gap-2 text-sm font-black">
          {audioSettings.enabled ? <FiVolume2 /> : <FiVolumeX />}
          Sound
        </span>
        <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-black">
          <FiMusic />
          {audioSettings.enabled ? musicOptions.find((item) => item.value === audioSettings.musicTrack)?.label : "Off"}
        </span>
      </button>

      {open && (
        <div className="mt-3 grid gap-3">
          <button
            className={`h-11 rounded-2xl text-sm font-black shadow ${audioSettings.enabled ? "bg-[#8bc7a5]" : "bg-white/10"}`}
            onClick={() => update({ enabled: !audioSettings.enabled })}
            type="button"
          >
            {audioSettings.enabled ? "Sound On" : "Sound Off"}
          </button>

          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#ffdce8]">
            Music Volume
            <input
              aria-label="Music volume"
              className="accent-[#ff8dad]"
              max="1"
              min="0"
              onChange={(event) => updateAudioSettings({ musicVolume: Number(event.target.value) })}
              onPointerUp={() => playMochiSound("button")}
              step="0.05"
              type="range"
              value={audioSettings.musicVolume}
            />
          </label>

          <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#ffdce8]">
            SFX Volume
            <input
              aria-label="SFX volume"
              className="accent-[#ffd45c]"
              max="1"
              min="0"
              onChange={(event) => updateAudioSettings({ sfxVolume: Number(event.target.value) })}
              onPointerUp={() => playMochiSound("button")}
              step="0.05"
              type="range"
              value={audioSettings.sfxVolume}
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#ffdce8]">
              Music
              <select
                className="h-10 rounded-2xl border-0 bg-white/15 px-3 text-sm font-black text-white outline-none"
                onChange={(event) => update({ musicTrack: event.target.value as MusicTrack })}
                value={audioSettings.musicTrack}
              >
                {musicOptions.map((item) => (
                  <option className="text-[#49343a]" key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-xs font-black uppercase tracking-wide text-[#ffdce8]">
              Ambience
              <select
                className="h-10 rounded-2xl border-0 bg-white/15 px-3 text-sm font-black text-white outline-none"
                onChange={(event) => update({ ambientTrack: event.target.value as AmbientTrack })}
                value={audioSettings.ambientTrack}
              >
                {ambientOptions.map((item) => (
                  <option className="text-[#49343a]" key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </section>
  );
}
