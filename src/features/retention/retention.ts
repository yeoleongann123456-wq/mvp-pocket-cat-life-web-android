import { BREED_OPTIONS } from "../cat/breeds";
import { SHOP_ITEMS } from "../cat/shopItems";
import type { AchievementId, BreedId, DailyGoal, DailyGoalKind, HealthLog, RandomEvent, RelationshipLevel, RetentionReward } from "../../types/game";

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
  { kind: "good", title: "Found Gift", message: "Your cat carried over a tiny wrapped gift and waited very politely.", reward: { coins: 10, stars: 8 } },
  { kind: "neutral", title: "Attention Please", message: "Your cat is sitting nearby, pretending not to want attention." },
  { kind: "neutral", title: "Play Mood", message: "Your cat tapped the floor twice. That means playtime, apparently." },
  { kind: "neutral", title: "Wants Cuddle", message: "Your cat leaned against you. This is not a request. It is a soft announcement." },
  { kind: "funny", title: "Plant Incident", message: "A plant has been gently knocked over. Your cat denies everything.", reward: { xp: 2 } },
  { kind: "funny", title: "Sock Thief", message: "Your cat stole one sock and placed it in the room like a treasure.", reward: { xp: 2, coins: 4 } },
  { kind: "funny", title: "Tiny Mess", message: "Your cat made a tiny mess, then sat inside it like it was modern art.", reward: { xp: 2 } }
];

export type AutonomousCatAction = "idle" | "walk" | "sit" | "nap" | "stretch" | "window" | "toy" | "groom" | "look";
export type WorldPhase = "morning" | "afternoon" | "evening" | "night" | "rain";

const AUTONOMOUS_ACTIONS: AutonomousCatAction[] = ["walk", "sit", "nap", "stretch", "window", "toy", "groom", "look"];

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

export function relationshipReaction(level: RelationshipLevel) {
  if (level === "Friend") return "Your cat waits closer to the front of the room now.";
  if (level === "Best Friend") return "Your cat runs over when you open the app.";
  if (level === "Family") return "Your cat acts like this room belongs to both of you.";
  if (level === "Soul Companion") return "Your cat seems to know when you need a gentle nudge.";
  return "Your cat is curious about your habits.";
}

export function memoryLine(memory: { lastMood?: string; lastCompletedTask?: string; lastReminderCompleted?: string; lastVisitMessage?: string }, streakCount = 0) {
  if (memory.lastMood === "tired") return "You looked tired yesterday. I saved the quiet corner for you.";
  if (memory.lastMood === "sad" || memory.lastMood === "stressed") return "Last time felt heavy. I am here softly today.";
  if (memory.lastCompletedTask) return `You finished "${memory.lastCompletedTask}" recently. I noticed.`;
  if (memory.lastReminderCompleted) return `You completed "${memory.lastReminderCompleted}". Small care still counts.`;
  if (memory.lastMood) return `Last time, your mood was ${memory.lastMood}. I am checking in gently.`;
  if (streakCount >= 3) return `You came back ${streakCount} days in a row. I remember that.`;
  if (memory.lastVisitMessage) return memory.lastVisitMessage;
  return "Did you drink enough water today?";
}

export function breedCareDialogue(breedId: BreedId, catName: string, log: HealthLog, streakCount: number) {
  const needsWater = log.waterGlasses < 4;
  const hasMood = Boolean(log.mood);
  const byBreed: Record<BreedId, string[]> = {
    orange: [
      needsWater ? `${catName} is dramatically hungry for snacks, but first: water.` : `${catName} says your hydration arc is looking heroic.`,
      "Tiny sprint, tiny stretch, tiny victory. We can do one good thing."
    ],
    ragdoll: [
      needsWater ? `${catName} nudges your cup closer, very gently.` : `${catName} feels calm knowing you cared for yourself.`,
      hasMood ? "Thank you for telling me how your heart feels." : "When you are ready, I can sit with your mood."
    ],
    british: [
      needsWater ? `${catName} recommends one orderly glass of water.` : `${catName} approves of today's routine.`,
      streakCount >= 3 ? "Consistent effort. Quite respectable." : "A small routine, repeated, becomes comfort."
    ],
    black: [
      needsWater ? `${catName} appears from the moonlit corner with a water reminder.` : `${catName} noticed your quiet discipline today.`,
      "No drama. One small act of care. Then another."
    ],
    munchkin: [
      needsWater ? `${catName} is zooming in circles until you drink water.` : `${catName} says: hydration completed, chaos reduced by 2%.`,
      "Fast paws, soft heart. Let's do the next tiny thing."
    ],
    dragon: [
      needsWater ? `${catName} blesses your water bottle with tiny dragon luck.` : `${catName} sparkles proudly over your care streak.`,
      "Your day is guarded. Your next gentle action is blessed."
    ]
  };
  const lines = byBreed[breedId];
  return lines[Math.min(lines.length - 1, streakCount % lines.length)];
}

export function chooseAutonomousAction() {
  return AUTONOMOUS_ACTIONS[Math.floor(Math.random() * AUTONOMOUS_ACTIONS.length)];
}

export function autonomousBehaviorLine(action: AutonomousCatAction, catName: string, breedId: BreedId) {
  if (action === "walk") return `${catName} pads around the room to check on everything.`;
  if (action === "sit") return `${catName} sits nearby, quietly keeping you company.`;
  if (action === "nap") return `${catName} takes a tiny nap, saving energy for later.`;
  if (action === "stretch") return `${catName} does a long stretch like a wellness professional.`;
  if (action === "window") return `${catName} looks out the window and thinks mysterious cat thoughts.`;
  if (action === "toy") return breedId === "munchkin" ? `${catName} attacks the toy with heroic nonsense.` : `${catName} bats a toy across the rug.`;
  if (action === "groom") return `${catName} grooms carefully, then pretends nothing happened.`;
  if (action === "look") return `${catName} looks at you like you matter.`;
  return `${catName} is breathing softly beside you.`;
}

export function worldPhaseFor(date = new Date(), ambience?: string): WorldPhase {
  if (ambience === "rain") return "rain";
  const hour = date.getHours();
  if (hour < 6 || hour >= 21) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
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
    { id: "rare-legend-room", category: "Rare Items", name: "Legend Room", requirement: "30 day streak" },
    { id: "rare-dragon-toy", category: "Toys", name: "Dragon Toy", requirement: "Soul Companion" }
  ];
  return [...cats, ...shop, ...rare];
}

function hashString(value: string) {
  return value.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 7);
}
