import type { AmbientTrack, AudioSettings, MusicTrack } from "../../types/game";

export type SfxName =
  | "button"
  | "reward"
  | "taskComplete"
  | "levelUp"
  | "meow"
  | "purr"
  | "sleepy"
  | "happy"
  | "eat"
  | "purchase";

const defaultSettings: AudioSettings = {
  enabled: true,
  musicVolume: 0.28,
  sfxVolume: 0.7,
  musicTrack: "cozyPiano",
  ambientTrack: "day"
};

class MochiAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private ambientTimer: number | null = null;
  private unlocked = false;
  private settings = defaultSettings;

  updateSettings(settings: AudioSettings) {
    this.settings = { ...defaultSettings, ...settings };
    if (!this.context) return;
    this.applyVolumes();
    if (!this.settings.enabled) {
      this.stopLoops();
      return;
    }
    if (this.unlocked) this.startLoops();
  }

  async unlock() {
    if (!this.context) this.createContext();
    if (!this.context) return;
    if (this.context.state === "suspended") await this.context.resume();
    this.unlocked = true;
    this.applyVolumes();
    if (this.settings.enabled) this.startLoops();
  }

  async play(name: SfxName) {
    await this.unlock();
    if (!this.context || !this.sfxGain || !this.settings.enabled) return;
    const now = this.context.currentTime;
    if (name === "button") this.tone(520, 0.04, now, "triangle", 0.18);
    if (name === "reward") this.chime([660, 880, 1175], now, 0.12);
    if (name === "taskComplete") this.chime([523, 784, 1046], now, 0.13);
    if (name === "levelUp") this.chime([523, 659, 784, 1046], now, 0.18);
    if (name === "purchase") this.chime([392, 659, 988], now, 0.12);
    if (name === "meow") this.meow(now);
    if (name === "purr") this.purr(now);
    if (name === "sleepy") this.sleepy(now);
    if (name === "happy") this.chime([784, 988], now, 0.1);
    if (name === "eat") this.eat(now);
  }

  private createContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioCtor();
    this.master = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.sfxGain = this.context.createGain();
    this.ambientGain = this.context.createGain();
    this.musicGain.connect(this.master);
    this.sfxGain.connect(this.master);
    this.ambientGain.connect(this.master);
    this.master.connect(this.context.destination);
    this.applyVolumes();
  }

  private applyVolumes() {
    if (!this.master || !this.musicGain || !this.sfxGain || !this.ambientGain) return;
    const on = this.settings.enabled ? 1 : 0;
    this.master.gain.value = on;
    this.musicGain.gain.value = clamp(this.settings.musicVolume) * 0.34;
    this.sfxGain.gain.value = clamp(this.settings.sfxVolume) * 0.42;
    this.ambientGain.gain.value = clamp(this.settings.musicVolume) * 0.18;
  }

  private startLoops() {
    this.stopLoops();
    this.scheduleMusic(this.settings.musicTrack);
    this.scheduleAmbient(this.settings.ambientTrack);
  }

  private stopLoops() {
    if (this.musicTimer) window.clearInterval(this.musicTimer);
    if (this.ambientTimer) window.clearInterval(this.ambientTimer);
    this.musicTimer = null;
    this.ambientTimer = null;
  }

  private scheduleMusic(track: MusicTrack) {
    if (!this.context || !this.musicGain) return;
    const pattern = musicPattern(track);
    const playPattern = () => {
      if (!this.context || !this.musicGain || !this.settings.enabled) return;
      const start = this.context.currentTime + 0.02;
      pattern.notes.forEach((note, index) => {
        this.tone(note, pattern.noteLength, start + index * pattern.spacing, pattern.wave, pattern.gain, this.musicGain);
      });
    };
    playPattern();
    this.musicTimer = window.setInterval(playPattern, pattern.loopMs);
  }

  private scheduleAmbient(track: AmbientTrack) {
    if (!this.context || !this.ambientGain || track === "off") return;
    const playAmbient = () => {
      if (!this.context || !this.ambientGain || !this.settings.enabled) return;
      const now = this.context.currentTime;
      if (track === "rain") {
        for (let i = 0; i < 10; i += 1) this.noiseBurst(now + i * 0.17, 0.05, 900 + i * 40, this.ambientGain);
      } else {
        const base = track === "night" ? 220 : 330;
        this.tone(base, 0.5, now, "sine", 0.035, this.ambientGain);
        this.tone(base * 1.5, 0.42, now + 0.22, "sine", 0.025, this.ambientGain);
      }
    };
    playAmbient();
    this.ambientTimer = window.setInterval(playAmbient, track === "rain" ? 1900 : 3200);
  }

  private chime(notes: number[], start: number, length: number) {
    notes.forEach((note, index) => this.tone(note, length, start + index * 0.075, "sine", 0.22));
  }

  private meow(start: number) {
    this.sweep(520, 740, 0.16, start, "triangle", 0.24);
    this.sweep(740, 430, 0.2, start + 0.13, "triangle", 0.2);
  }

  private purr(start: number) {
    for (let i = 0; i < 6; i += 1) {
      this.tone(92 + (i % 2) * 10, 0.11, start + i * 0.09, "sawtooth", 0.07);
    }
  }

  private sleepy(start: number) {
    this.sweep(320, 180, 0.52, start, "sine", 0.16);
  }

  private eat(start: number) {
    for (let i = 0; i < 5; i += 1) {
      this.noiseBurst(start + i * 0.075, 0.035, 1500, this.sfxGain);
    }
  }

  private tone(
    frequency: number,
    duration: number,
    start: number,
    type: OscillatorType,
    volume: number,
    target = this.sfxGain
  ) {
    if (!this.context || !target) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(target);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  private sweep(from: number, to: number, duration: number, start: number, type: OscillatorType, volume: number) {
    if (!this.context || !this.sfxGain) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, start);
    oscillator.frequency.exponentialRampToValueAtTime(to, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(this.sfxGain);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  private noiseBurst(start: number, duration: number, filterFrequency: number, target: GainNode | null) {
    if (!this.context || !target) return;
    const sampleRate = this.context.sampleRate;
    const buffer = this.context.createBuffer(1, Math.max(1, sampleRate * duration), sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = filterFrequency;
    gain.gain.value = 0.16;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(target);
    source.start(start);
  }
}

function musicPattern(track: MusicTrack) {
  if (track === "softLofi") {
    return { notes: [220, 277, 330, 277, 196, 247, 294, 247], noteLength: 0.24, spacing: 0.34, loopMs: 3200, wave: "triangle" as OscillatorType, gain: 0.07 };
  }
  if (track === "relaxing") {
    return { notes: [262, 330, 392, 523, 392, 330], noteLength: 0.42, spacing: 0.52, loopMs: 3900, wave: "sine" as OscillatorType, gain: 0.06 };
  }
  return { notes: [523, 659, 784, 659, 587, 698, 880, 698], noteLength: 0.18, spacing: 0.32, loopMs: 3300, wave: "sine" as OscillatorType, gain: 0.07 };
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

export const mochiAudio = new MochiAudioEngine();
