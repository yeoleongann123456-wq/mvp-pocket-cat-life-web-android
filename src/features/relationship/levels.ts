import type { RelationshipLevel } from "../../types/game";

const LEVELS: Array<{ min: number; name: RelationshipLevel }> = [
  { min: 0, name: "Stranger" },
  { min: 25, name: "Friend" },
  { min: 70, name: "Best Friend" },
  { min: 140, name: "Family" },
  { min: 240, name: "Soul Companion" }
];

export function getRelationshipLevel(points: number): RelationshipLevel {
  return [...LEVELS].reverse().find((level) => points >= level.min)?.name ?? "Stranger";
}

export function getRelationshipProgress(points: number) {
  const currentIndex = LEVELS.findIndex((level) => level.name === getRelationshipLevel(points));
  const current = LEVELS[currentIndex];
  const next = LEVELS[currentIndex + 1];
  if (!next) return 100;
  return Math.round(((points - current.min) / (next.min - current.min)) * 100);
}
