import { BREED_OPTIONS } from "../cat/breeds";
import { SHOP_ITEMS } from "../cat/shopItems";
import type { AchievementId, DailyGoal, DailyGoalKind, RandomEvent, RelationshipLevel, RetentionReward } from "../../types/game";

type GoalTemplate = {
  kind: DailyGoalKind;
  title: string;
  target: number;
  reward: RetentionReward;
};

const GOAL_POOL: GoalTemplate[] = [
  { kind: "water", title: "Drink water 5 times", target: 5, reward: { stars: 12, coins: 10, xp: 6 } },
  { kind: "pet", title: "Pet your cat 3 times", target: 3, reward: { stars: 10, coins: 8, xp: 6 } },
  { kind: "task", title: "Complete 2 tasks", target: 2, reward: { stars: 16, coins: 12, xp: 8 } },
  { kind: "mood", title: "Check your mood", target: 1, reward: { stars: 8, coins: 8, xp: 5 } },
  { kind: "sleep", title: "Log sleep once", target: 1, reward: { stars: 10, coins: 8, xp: 6 } },
  { kind: "reminder", title: "Complete a reminder", target: 1, reward: { stars: 14, coins: 10, xp: 7 } }
];

export const ACHIEVEMENT_DEFINITIONS: Record<AchievementId, { title: string; description: string }> = {
  first_pet: { title: "First Pet", description: "You gave your cat attention for the first time." },
  first_reminder: { title: "First Reminder", description: "You completed your first reminder." },
  seven_day_streak: { title: "7 Day Streak", description: "You came back for seven days." },
  hundred_water_logs: { title: "100 Water Logs", description: "You logged 100 glasses of water." },
  best_friend: { title: "Best Friend", description: "Your relationship reached Best Friend." },
  soul_companion: { title: "Soul Companion", description: "Your relationship reached Soul Companion." }
};

const RANDOM_EVENTS: Array<Omit<RandomEvent, "id" | "createdAt">> = [
  { kind: "good", title: "Found Coins", message: "Your cat found coins under the rug and looked extremely proud.", reward: { coins: 12, stars: 4 } },
  { kind: "good", title: "Tiny Gift", message: "Your cat brought a small gift and waited for you to notice.", reward: { stars: 8, xp: 4 } },
  { kind: "good", title: "Toy Discovery", message: "Your cat discovered a forgotten toy behind the bed.", reward: { coins: 8, stars: 6 } },
  { kind: "good", title: "Furniture Coupon", message: "Your cat found a furniture coupon. Suspiciously useful.", reward: { coins: 15 } },
  { kind: "neutral", title: "Attention Please", message: "Your cat is sitting nearby, pretending not to want attention." },
  { kind: "neutral", title: "Play Mood", message: "Your cat tapped the floor twice. That means playtime, apparently." },
  { kind: "funny", title: "Plant Incident", message: "A plant has been gently knocked over. Your cat denies everything.", reward: { xp: 2 } },
  { kind: "funny", title: "Tiny Mess", message: "Your cat made a tiny mess, then sat inside it like it was modern art.", reward: { xp: 2 } }
];

export function generateDailyGoals(date: string): DailyGoal[] {
  const seed = hashString(date);
  const offset = seed % GOAL_POOL.length;
  return [0, 1, 2].map((index) => {
    const template = GOAL_POOL[(offset + index * 2) % GOAL_POOL.length];
    return {
      id: `${date}-${template.kind}`,
      kind: template.kind,
      title: template.title,
      target: template.target,
      progress: 0,
      reward: template.reward,
      claimed: false
    };
  });
}

export function createRandomEvent(now = new Date()): RandomEvent {
  const template = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
  return {
    ...template,
    id: `event-${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    createdAt: now.toISOString()
  };
}

export function createDailyCheckInEvent(message: string, now = new Date()): RandomEvent {
  return {
    id: `checkin-${now.getTime()}`,
    kind: "checkin",
    title: "Daily Check-in",
    message,
    reward: { stars: 5, coins: 5, xp: 4 },
    createdAt: now.toISOString()
  };
}

export function returningMessage(absentDays: number) {
  if (absentDays >= 14) return "I thought you forgot me. I kept your spot warm.";
  if (absentDays >= 7) return "I missed you. The room felt quieter without you.";
  if (absentDays >= 3) return "I was waiting for you.";
  if (absentDays >= 1) return "Welcome back!";
  return Math.random() > 0.5 ? "You came back!" : "Good morning!";
}

export function relationshipStory(level: RelationshipLevel) {
  if (level === "Friend") return "I think we are becoming friends.";
  if (level === "Best Friend") return "I always look forward to seeing you.";
  if (level === "Family") return "You are part of my family.";
  if (level === "Soul Companion") return "I will always be here for you.";
  return "I am still learning your rhythm, but I am here.";
}

export function memoryLine(memory: { lastMood?: string; lastCompletedTask?: string; lastReminderCompleted?: string }) {
  if (memory.lastCompletedTask) return `You finished "${memory.lastCompletedTask}" recently. I noticed.`;
  if (memory.lastReminderCompleted) return `You completed "${memory.lastReminderCompleted}". Small care still counts.`;
  if (memory.lastMood) return `Last time, your mood was ${memory.lastMood}. I am checking in gently.`;
  return "Did you drink enough water today?";
}

export function collectionItems() {
  const cats = BREED_OPTIONS.map((breed, index) => ({
    id: `cat-${breed.id}`,
    category: "Cats",
    name: breed.name,
    requirement: index === 0 ? "Unlocked by default" : "Unlock through long-term care"
  }));
  const shop = SHOP_ITEMS.map((item) => ({
    id: item.id,
    category: item.category === "Cat Bed" || item.category === "Furniture" || item.category === "Rug" || item.category === "Window" || item.category === "Plants" ? "Furniture" : item.category,
    name: item.name,
    requirement: `${item.price} stars`
  }));
  const rare = [
    { id: "rare-golden-yarn", category: "Rare Items", name: "Golden Yarn", requirement: "7 day streak" },
    { id: "rare-legend-room", category: "Wallpapers", name: "Legend Room", requirement: "30 day streak" },
    { id: "rare-dragon-toy", category: "Toys", name: "Dragon Toy", requirement: "Soul Companion" }
  ];
  return [...cats, ...shop, ...rare];
}

function hashString(value: string) {
  return value.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}
