import type { BreedId, HealthLog, Reminder } from "../../types/game";

type UnlockContext = {
  healthLogs: Record<string, HealthLog>;
  tasksCompleted: number;
  relationshipPoints: number;
  reminders: Reminder[];
};

export const CAT_UNLOCKS: Record<BreedId, { condition: string; trait: string; isUnlocked: (context: UnlockContext) => boolean }> = {
  orange: {
    condition: "Unlocked by default",
    trait: "Earns +3 stars from water actions.",
    isUnlocked: () => true
  },
  ragdoll: {
    condition: "Complete 3 days of health check-ins",
    trait: "Gentler reminder copy.",
    isUnlocked: ({ healthLogs }) => Object.values(healthLogs).filter((log) => log.mood || log.sleepHours || log.waterGlasses).length >= 3
  },
  british: {
    condition: "Complete 10 tasks",
    trait: "Focus task rewards feel extra polished.",
    isUnlocked: ({ tasksCompleted }) => tasksCompleted >= 10
  },
  black: {
    condition: "Log care on 7 different days",
    trait: "Night reminders are softer.",
    isUnlocked: ({ healthLogs }) => Object.values(healthLogs).filter((log) => log.mood || log.waterGlasses || log.sleepHours || log.steps).length >= 7
  },
  munchkin: {
    condition: "Reach water goal 5 times",
    trait: "Tiny cheerful action feedback.",
    isUnlocked: ({ healthLogs }) => Object.values(healthLogs).filter((log) => log.waterGlasses >= 8).length >= 5
  },
  dragon: {
    condition: "Reach Soul Companion and 30 logged care days",
    trait: "Legendary companion aura.",
    isUnlocked: ({ healthLogs, relationshipPoints }) =>
      relationshipPoints >= 240 && Object.values(healthLogs).filter((log) => log.mood || log.waterGlasses || log.sleepHours || log.steps).length >= 30
  }
};
