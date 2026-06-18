import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { BreedId, CareTask, HealthLog, MochiState, MoodValue, Reminder, RepeatOption } from "../types/game";
import { todayKey } from "../utils/date";

const DEFAULT_HEALTH_LOG = (date: string): HealthLog => ({
  date,
  waterGlasses: 0,
  sleepHours: 0,
  steps: 0,
  mood: ""
});

const initialState: MochiState = {
  profile: {
    onboardingComplete: false,
    catName: "Mochi",
    breedId: "orange",
    notificationPreference: "unknown",
    lastVisitDate: ""
  },
  relationshipPoints: 0,
  healthLogs: {},
  tasks: [],
  reminders: []
};

type MochiActions = {
  completeOnboarding: (catName: string, breedId: BreedId) => void;
  updateCatName: (catName: string) => void;
  updateBreed: (breedId: BreedId) => void;
  recordDailyReturn: () => void;
  addRelationship: (points: number) => void;
  getTodayLog: () => HealthLog;
  addWater: () => void;
  setSleep: (hours: number) => void;
  setSteps: (steps: number) => void;
  setMood: (mood: MoodValue) => void;
  addTask: (title: string) => void;
  toggleTask: (taskId: string) => void;
  addReminder: (input: { title: string; date: string; time: string; repeat: RepeatOption }) => void;
  toggleReminder: (reminderId: string) => void;
  setNotificationPreference: (value: MochiState["profile"]["notificationPreference"]) => void;
  resetMochi: () => void;
};

export type MochiStore = MochiState & MochiActions;

function cleanName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  return name ? name.slice(0, 18) : "Mochi";
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
        if (get().profile.lastVisitDate === today) return;
        set((state) => ({
          profile: {
            ...state.profile,
            lastVisitDate: today
          },
          relationshipPoints: state.relationshipPoints + 4
        }));
      },
      addRelationship: (points) => {
        set((state) => ({
          relationshipPoints: Math.max(0, state.relationshipPoints + points)
        }));
      },
      getTodayLog: () => {
        const today = todayKey();
        return get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
      },
      addWater: () => {
        const today = todayKey();
        const current = get().healthLogs[today] ?? DEFAULT_HEALTH_LOG(today);
        set((state) => ({
          healthLogs: {
            ...state.healthLogs,
            [today]: {
              ...current,
              waterGlasses: Math.min(12, current.waterGlasses + 1)
            }
          },
          relationshipPoints: state.relationshipPoints + 2
        }));
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
          relationshipPoints: state.relationshipPoints + 2
        }));
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
          relationshipPoints: state.relationshipPoints + 3
        }));
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
            relationshipPoints: state.relationshipPoints + (completing ? 3 : 0)
          };
        });
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
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === reminderId ? { ...reminder, completed: !reminder.completed } : reminder
          )
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
      version: 1
    }
  )
);
