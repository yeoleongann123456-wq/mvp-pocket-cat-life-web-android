import { useEffect, useRef } from "react";
import { mochiAudio, type SfxName } from "../services/audio/audioEngine";
import { useMochiStore } from "../store/useMochiStore";

export function useMochiAudio() {
  const audioSettings = useMochiStore((state) => state.audioSettings);

  useEffect(() => {
    mochiAudio.updateSettings(audioSettings);
  }, [audioSettings]);
}

export function useButtonClickAudio() {
  const enabled = useMochiStore((state) => state.audioSettings.enabled);
  const launchPlayed = useRef(false);

  useEffect(() => {
    function handlePointerUp(event: PointerEvent) {
      if (!enabled) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, a")) {
        if (!launchPlayed.current) {
          launchPlayed.current = true;
          void mochiAudio.play("mochiSignature");
          return;
        }
        void mochiAudio.play("button");
      }
    }

    document.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => document.removeEventListener("pointerup", handlePointerUp);
  }, [enabled]);
}

export function playMochiSound(name: SfxName) {
  void mochiAudio.play(name);
}
