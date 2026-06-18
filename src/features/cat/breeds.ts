import type { BreedId, CatBreed } from "../../types/game";

export const CAT_BREEDS: Record<BreedId, CatBreed> = {
  orange: {
    id: "orange",
    name: "Orange Cat",
    colors: {
      primary: "#f59e42",
      secondary: "#ffd7a1",
      accent: "#ff7f50"
    },
    personality: "sunny, silly, emotionally direct",
    reminderTone: "warm and playful",
    dialogueStyle: "short pep talks with soft jokes",
    greeting: "I brought sunlight. You bring the water bottle."
  },
  ragdoll: {
    id: "ragdoll",
    name: "Ragdoll",
    colors: {
      primary: "#efe5d5",
      secondary: "#9fb8d8",
      accent: "#7f6c9f"
    },
    personality: "gentle, calm, quietly protective",
    reminderTone: "soft and reassuring",
    dialogueStyle: "slow, cozy, emotionally safe",
    greeting: "Let us move gently today. I am right here."
  },
  british: {
    id: "british",
    name: "British Shorthair",
    colors: {
      primary: "#9aa6b2",
      secondary: "#e8eef3",
      accent: "#6f7f8f"
    },
    personality: "steady, loyal, slightly formal",
    reminderTone: "polite and dependable",
    dialogueStyle: "precise, caring, composed",
    greeting: "A small routine, done well, is a fine victory."
  },
  black: {
    id: "black",
    name: "Black Cat",
    colors: {
      primary: "#25212d",
      secondary: "#5d4b73",
      accent: "#f0c96b"
    },
    personality: "mysterious, witty, deeply observant",
    reminderTone: "clever and tender",
    dialogueStyle: "moonlit encouragement",
    greeting: "I noticed you arrived. That counts. Now, water?"
  },
  munchkin: {
    id: "munchkin",
    name: "Munchkin",
    colors: {
      primary: "#f5c6d6",
      secondary: "#fff1c7",
      accent: "#8ecae6"
    },
    personality: "tiny, enthusiastic, cheerfully persistent",
    reminderTone: "bright and encouraging",
    dialogueStyle: "energetic little nudges",
    greeting: "Tiny paws, big plan. We take care of you today."
  },
  dragon: {
    id: "dragon",
    name: "Lucky Dragon Cat",
    colors: {
      primary: "#7dd3fc",
      secondary: "#fff1a8",
      accent: "#f472b6"
    },
    personality: "mythic, protective, celebratory",
    reminderTone: "sparkly and reassuring",
    dialogueStyle: "lucky blessings and proud encouragement",
    greeting: "Your tiny luck dragon is awake. Let us protect your day."
  }
};

export const BREED_OPTIONS = Object.values(CAT_BREEDS);
