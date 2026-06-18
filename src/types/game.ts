export type CatMood = "Very Happy" | "Normal" | "Hungry" | "Tired" | "Dirty" | "Sad";

export type CatStatKey = "hunger" | "happiness" | "cleanliness" | "energy";

export type LegacySave = {
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
  bond: number;
  level: number;
  coins: number;
  catName?: string;
  tutorialComplete?: boolean;
  soundMuted?: boolean;
};
