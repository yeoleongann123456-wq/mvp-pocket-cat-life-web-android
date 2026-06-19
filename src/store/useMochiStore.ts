import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ACHIEVEMENT_DEFINITIONS, createDailyCheckInEvent, createRandomEvent, generateDailyGoals, returningMessage } from "../features/retention/retention";
import { getRelationshipLevel } from "../features/relationship/levels";
import type { Achievement, AchievementId, AudioSettings, BreedId, CareTask, DailyGoalKind, HealthLog, MochiState, MoodValue, Reminder, RepeatOption } from "../types/game";
import { DEFAULT_CAT_NAME } from "../utils/catName";
import { todayKey } from "../utils/date";

const DEFAULT_HEALTH_LOG = (date: string): HealthLog => ({
  date,
  waterGlasses: 0,
  sleepHours: 0,
  steps: 0,
  mood: ""
});

const initialRetention = () => ({
  coins: 0,
  dailyGoalsDate: todayKey(),
  dailyGoals: generateDailyGoals(todayKey()),
  lastDailyCheckIn: "",
  lastRandomEventAt: "",
  achievements: [],
  streaks: {
    dailyVisits: 0,
    waterGoals: 0,
    taskCompletion: 0,
    lastVisitDate: "",
    lastWaterGoalDate: "",
    lastTaskGoalDate: ""
  },
  memory: {}
});

const initialState: MochiState = {
  profile: {
    onboardingComplete: false,
    catName: DEFAULT_CAT_NAME,
    breedId: "orange",
    notificationPreference: "unknown",
    lastVisitDate: ""
  },
  relationshipPoints: 0,
  healthLogs: {},
  tasks: [],
  reminders: [],
  stars: 120,
  ownedItems: ["starter-rug"],
  audioSettings: {
    enabled: true,
    musicVolume: 0.28,
    sfxVolume: 0.7,
    musicTrack: "cozyPiano",
    ambientTrack: "day"
  },
  retention: initialRetention()
};

type MochiActions = {
  completeOnboarding: (catName: string, breedId: BreedId) => void;
  updateCatName: (catName: string) => void;
  updateBreed: (breedId: BreedId) => void;
  recordDailyReturn: () => void;
  addRelationship: (points: number) => void;
  addStars: (stars: number) => void;
  getTodayLog: () => HealthLog;
  addWater: () => void;
  setSleep: (hours: number) => void;
  setSteps: (steps: number) => void;
  setMood: (mood: MoodValue) => void;
  addTask: (title: string) => void;
  toggleTask: (taskId: string) => void;
  addReminder: (input: { title: string; date: string; time: string; repeat: RepeatOption }) => void;
  toggleReminder: (reminderId: string) => void;
  buyItem: (itemId: string, price: number) => boolean;
  ensureDailyRetention: () => void;
  recordRetentionAction: (kind: DailyGoalKind, amount?: number, detail?: string) => void;
  claimDailyGoal: (goalId: string) => boolean;
  dismissRandomEvent: () => void;
  dismissAchievement: () => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  setNotificationPreference: (value: MochiState["profile"]["notificationPreference"]) => void;
  resetMochi: () => void;
};

export type MochiStore = MochiState & MochiActions;

function cleanName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  return name ? name.slice(0, 18) : DEFAULT_CAT_NAME;
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function dateDiffDays(from: string, to: string) {
  if (!from || !to) return 0;
  const start = new Date(`${from}T00:00:00`).getTime();
  const end = new Date(`${to}T00:00:00`).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.round((end - start) / 86400000);
}

function previousDay(date: string) {
  const value = new Date(`${date}T00:00:00`);
  value.setDate(value.getDate() - 1);
  return todayKey(value);
}

function visitMilestoneReward(streak: number) {
  if (streak === 30) return { stars: 120, coins: 120, xp: 40 };
  if (streak === 14) return { stars: 60, coins: 60, xp: 24 };
  if (streak === 7) return { stars: 30, coins: 30, xp: 16 };
  if (streak === 3) return { stars: 15, coins: 15, xp: 8 };
  return { stars: 0, coins: 0, xp: 0 };
}

function checkAchievements(state: MochiStore): Partial<MochiStore> {
  const unlocked = new Set(state.retention.achievements.map((achievement) => achievement.id));
  const nextIds: AchievementId[] = [];
  const totalWater = Object.values(state.healthLogs).reduce((sum, log) => sum + log.waterGlasses, 0);
  const level = getRelationshipLevel(state.relationshipPoints);

  if (!unlocked.has("first_pet") && state.retention.memory.lastPetAt) nextIds.push("first_pet");
  if (!unlocked.has("first_reminder") && state.retention.memory.lastReminderCompleted) nextIds.push("first_reminder");
  if (!unlocked.has("seven_day_streak") && state.retention.streaks.dailyVisits >= 7) nextIds.push("seven_day_streak");
  if (!unlocked.has("hundred_water_logs") && totalWater >= 100) nextIds.push("hundred_water_logs");
  if (!unlocked.has("best_friend") && (level === "Best Friend" || level === "Family" || level === "Soul Companion")) nextIds.push("best_friend");
  if (!unlocked.has("soul_companion") && level === "Soul Companion") nextIds.push("soul_companion");

  if (nextIds.length === 0) return {};
  const now = new Date().toISOString();
  const newAchievements: Achievement[] = nextIds.map((id) => ({
    id,
    ...ACHIEVEMENT_DEFINITIONS[id],
    unlockedAt: now
  }));
  return {
    retention: {
      ...state.retention,
      achievements: [...state.retention.achievements, ...newAchievements],
      activeAchievement: newAchievements[0]
    }
  };
}

export const useMochiStore = create<MochiStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      completeOnboarding: (catName, breedId) => {
        set((state) => ({
          profile: {
            ...state.profile,
            catName: cleanName(catName),
            breedId,
            onboardingComplete: true,
            lastVisitDate: todayKey()
          },
          relationshipPoints: Math.max(state.relationshipPoints, 8)
        }));
      },
      updateCatName: (catName) => {
        set((state) => ({
          profile: {
            ...state.profile,
            catName: cleanName(catName)
          }
        }));
      },
      updateBreed: (breedId) => {
        set((state) => ({
          profile: {
            ...state.profile,
            breedId
          }
        }));
      },
      recordDailyReturn: () => {
        const today = todayKey();
        get().ensureDailyRetention();
        const current = get();
        if (current.profile.lastVisitDate === today && current.retention.lastDailyCheckIn === today) return;
        const absentDays = dateDiffDays(current.profile.lastVisitDate, today);
        const visitStreak = absentDays === 1 ? current.retention.streaks.dailyVisits + 1 : 1;
        const milestoneReward = visitMilestoneReward(visitStreak);
        const message = returningMessage(absentDays);
        const event = createDailyCheckInEvent(
          milestoneReward.stars > 0 ? `${message} Day ${visitStreak} streak reward unlocked.` : message
        );
        event.reward = {
          stars: 5 + milestoneReward.stars,
          coins: 5 + milestoneReward.coins,
          xp: 4 + milestoneReward.xp
        };
        set((state) => ({
          profile: {
            ...state.profile,
            lastVisitDate: today
          },
          relationshipPoints: state.relationshipPoints + 4 + milestoneReward.xp,
          stars: state.stars + 5 + milestoneReward.stars,
          retention: {
            ...state.retention,
            coins: state.retention.coins + 5 + milestoneReward.coins,
            lastDailyCheckIn: today,
            activeEvent: event,
            memory: {
              ...state.retention.memory,
              lastVisitMessage: message
            },
            streaks: {
              ...state.retention.streaks,
              dailyVisits: visitStreak,
              lastVisitDate: today
            }
          }
        }));
        const achievementPatch = checkAchievements(get());
        if (achievementPatch.retention) set(achievementPatch);
      },
      addRelationship: (points) => {
        set((state) => ({
          relationshipPoints: Math.max(0, state.relationshipPoints + points)
        }));
      },
      addStars: (stars) => {
        set((state) => ({
          stars: Math.max(0, state.stars + stars)
        }));
      },
      getTodayLog: () => {
        const today = todayKey();
        return get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
      },
      addWater: () => {
        const today = todayKey();
        const current = get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
        const nextWater = Math.min(12, current.waterGlasses + 1);
        set((state) => ({
          healthLogs: {
            ...state.healthLogs,
            [today]: {
              ...current,
              waterGlasses: nextWater
            }
          },
          relationshipPoints: state.relationshipPoints + 2,
          stars: state.stars + 3
        }));
        get().recordRetentionAction("water");
        if (nextWater >= 8 && get().retention.streaks.lastWaterGoalDate !== today) {
          set((state) => ({
            retention: {
              ...state.retention,
              streaks: {
                ...state.retention.streaks,
                waterGoals: state.retention.streaks.lastWaterGoalDate === previousDay(today) ? state.retention.streaks.waterGoals + 1 : 1,
                lastWaterGoalDate: today
              }
            }
          }));
        }
      },
      setSleep: (hours) => {
        const today = todayKey();
        const current = get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
        set((state) => ({
          healthLogs: {
            ...state.healthLogs,
            [today]: {
              ...current,
              sleepHours: Math.max(0, Math.min(16, Number(hours) || 0))
            }
          },
          relationshipPoints: state.relationshipPoints + 2,
          stars: state.stars + 2
        }));
        if ((Number(hours) || 0) > 0) get().recordRetentionAction("sleep");
      },
      setSteps: (steps) => {
        const today = todayKey();
        const current = get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
        set({
          healthLogs: {
            ...get().healthLogs,
            [today]: {
              ...current,
              steps: Math.max(0, Math.min(99999, Number(steps) || 0))
            }
          }
        });
      },
      setMood: (mood) => {
        const today = todayKey();
        const current = get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
        set((state) => ({
          healthLogs: {
            ...state.healthLogs,
            [today]: {
              ...current,
              mood
            }
          },
          relationshipPoints: state.relationshipPoints + 3,
          stars: state.stars + 3
        }));
        get().recordRetentionAction("mood", 1, mood);
      },
      addTask: (title) => {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;
        const task: CareTask = {
          id: makeId("task"),
          title: cleanTitle.slice(0, 80),
          completed: false,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          tasks: [task, ...state.tasks]
        }));
      },
      toggleTask: (taskId) => {
        set((state) => {
          const target = state.tasks.find((task) => task.id === taskId);
          const completing = Boolean(target && !target.completed);
          return {
            tasks: state.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            ),
            relationshipPoints: state.relationshipPoints + (completing ? 3 : 0),
            stars: state.stars + (completing ? 5 : 0)
          };
        });
        const target = get().tasks.find((task) => task.id === taskId);
        if (target?.completed) {
          get().recordRetentionAction("task", 1, target.title);
          const today = todayKey();
          const completedToday = get().tasks.filter((task) => task.completed && task.createdAt.startsWith(today)).length;
          if (completedToday >= 2 && get().retention.streaks.lastTaskGoalDate !== today) {
            set((state) => ({
              retention: {
                ...state.retention,
                streaks: {
                  ...state.retention.streaks,
                  taskCompletion: state.retention.streaks.lastTaskGoalDate === previousDay(today) ? state.retention.streaks.taskCompletion + 1 : 1,
                  lastTaskGoalDate: today
                }
              }
            }));
          }
        }
      },
      addReminder: (input) => {
        if (!input.title.trim() || !input.date || !input.time) return;
        const reminder: Reminder = {
          id: makeId("reminder"),
          title: input.title.trim().slice(0, 80),
          date: input.date,
          time: input.time,
          repeat: input.repeat,
          completed: false,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          reminders: [reminder, ...state.reminders]
        }));
      },
      toggleReminder: (reminderId) => {
        set((state) => {
          const target = state.reminders.find((reminder) => reminder.id === reminderId);
          const completing = Boolean(target && !target.completed);
          return {
            reminders: state.reminders.map((reminder) =>
              reminder.id === reminderId ? { ...reminder, completed: !reminder.completed } : reminder
            ),
            retention: completing && target
              ? {
                  ...state.retention,
                  memory: {
                    ...state.retention.memory,
                    lastReminderCompleted: target.title
                  }
                }
              : state.retention
          };
        });
        const target = get().reminders.find((reminder) => reminder.id === reminderId);
        if (target?.completed) get().recordRetentionAction("reminder", 1, target.title);
      },
      buyItem: (itemId, price) => {
        const state = get();
        const ownedItems = state.ownedItems ?? [];
        if (ownedItems.includes(itemId) || state.stars < price) return false;
        set({
          stars: state.stars - price,
          ownedItems: [...ownedItems, itemId]
        });
        return true;
      },
      ensureDailyRetention: () => {
        const today = todayKey();
        if (get().retention.dailyGoalsDate === today && get().retention.dailyGoals.length === 3) return;
        set((state) => ({
          retention: {
            ...state.retention,
            dailyGoalsDate: today,
            dailyGoals: generateDailyGoals(today)
          }
        }));
      },
      recordRetentionAction: (kind, amount = 1, detail) => {
        get().ensureDailyRetention();
        const now = new Date();
        set((state) => {
          const updatedGoals = state.retention.dailyGoals.map((goal) =>
            goal.kind === kind ? { ...goal, progress: Math.min(goal.target, goal.progress + amount) } : goal
          );
          const lastEventAt = state.retention.lastRandomEventAt ? new Date(state.retention.lastRandomEventAt).getTime() : 0;
          const canEvent = now.getTime() - lastEventAt > 2 * 60 * 60 * 1000;
          const event = canEvent && Math.random() < 0.35 ? createRandomEvent(now) : undefined;
          const reward = event?.reward ?? {};
          return {
            stars: state.stars + (reward.stars ?? 0),
            relationshipPoints: state.relationshipPoints + (reward.xp ?? 0),
            retention: {
              ...state.retention,
              dailyGoals: updatedGoals,
              coins: state.retention.coins + (reward.coins ?? 0),
              lastRandomEventAt: event ? now.toISOString() : state.retention.lastRandomEventAt,
              activeEvent: event ?? state.retention.activeEvent,
              memory: {
                ...state.retention.memory,
                ...(kind === "mood" && detail ? { lastMood: detail as MoodValue } : {}),
                ...(kind === "task" && detail ? { lastCompletedTask: detail } : {}),
                ...(kind === "reminder" && detail ? { lastReminderCompleted: detail } : {}),
                ...(kind === "pet" ? { lastPetAt: now.toISOString() } : {})
              }
            }
          };
        });
        const achievementPatch = checkAchievements(get());
        if (achievementPatch.retention) set(achievementPatch);
      },
      claimDailyGoal: (goalId) => {
        get().ensureDailyRetention();
        const goal = get().retention.dailyGoals.find((item) => item.id === goalId);
        if (!goal || goal.claimed || goal.progress < goal.target) return false;
        set((state) => ({
          stars: state.stars + goal.reward.stars,
          relationshipPoints: state.relationshipPoints + goal.reward.xp,
          retention: {
            ...state.retention,
            coins: state.retention.coins + goal.reward.coins,
            dailyGoals: state.retention.dailyGoals.map((item) =>
              item.id === goalId ? { ...item, claimed: true } : item
            )
          }
        }));
        const achievementPatch = checkAchievements(get());
        if (achievementPatch.retention) set(achievementPatch);
        return true;
      },
      dismissRandomEvent: () => {
        set((state) => ({
          retention: {
            ...state.retention,
            activeEvent: undefined
          }
        }));
      },
      dismissAchievement: () => {
        set((state) => ({
          retention: {
            ...state.retention,
            activeAchievement: undefined
          }
        }));
      },
      updateAudioSettings: (settings) => {
        set((state) => ({
          audioSettings: {
            ...initialState.audioSettings,
            ...(state.audioSettings ?? initialState.audioSettings),
            ...settings
          }
        }));
      },
      setNotificationPreference: (value) => {
        set((state) => ({
          profile: {
            ...state.profile,
            notificationPreference: value
          }
        }));
      },
      resetMochi: () => set(initialState)
    }),
    {
      name: "mochiCareSave",
      storage: createJSONStorage(() => localStorage),
      version: 4,
      migrate: (persistedState) => {
        const saved = persistedState as Partial<MochiState>;
        const retention = {
          ...initialState.retention,
          ...(saved.retention ?? {}),
          dailyGoals: saved.retention?.dailyGoals?.length ? saved.retention.dailyGoals : initialState.retention.dailyGoals,
          achievements: saved.retention?.achievements ?? [],
          streaks: {
            ...initialState.retention.streaks,
            ...(saved.retention?.streaks ?? {})
          },
          memory: {
            ...initialState.retention.memory,
            ...(saved.retention?.memory ?? {})
          }
        };
        return {
          ...initialState,
          ...saved,
          profile: {
            ...initialState.profile,
            ...(saved.profile ?? {})
          },
          healthLogs: saved.healthLogs ?? {},
          tasks: saved.tasks ?? [],
          reminders: saved.reminders ?? [],
          stars: typeof saved.stars === "number" ? saved.stars : initialState.stars,
          ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : initialState.ownedItems,
          audioSettings: {
            ...initialState.audioSettings,
            ...(saved.audioSettings ?? {})
          },
          retention
        } as MochiStore;
      }
    }
  )
);
