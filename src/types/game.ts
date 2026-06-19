export type BreedId = "orange" | "ragdoll" | "british" | "black" | "munchkin" | "dragon";

export type RelationshipLevel = "Stranger" | "Friend" | "Best Friend" | "Family" | "Soul Companion";

export type MoodValue = "great" | "okay" | "tired" | "stressed" | "sad";

export type RepeatOption = "none" | "daily" | "weekly";

export type CatBreed = {
  id: BreedId;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: string;
  reminderTone: string;
  dialogueStyle: string;
  greeting: string;
};

export type UserProfile = {
  onboardingComplete: boolean;
  catName: string;
  breedId: BreedId;
  notificationPreference: "unknown" | "allowed" | "denied" | "in-app";
  lastVisitDate: string;
};

export type HealthLog = {
  date: string;
  waterGlasses: number;
  sleepHours: number;
  steps: number;
  mood: MoodValue | "";
};

export type CareTask = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  repeat: RepeatOption;
  completed: boolean;
  createdAt: string;
};

export type ShopCategory = "Room" | "Furniture" | "Cat Bed" | "Rug" | "Window" | "Plants" | "Collar" | "Toys";

export type ShopItem = {
  id: string;
  name: string;
  category: ShopCategory;
  price: number;
  description: string;
  preview: string;
  afterPreview: string;
};

export type MusicTrack = "cozyPiano" | "softLofi" | "relaxing";

export type AmbientTrack = "day" | "night" | "rain" | "off";

export type AudioSettings = {
  enabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  musicTrack: MusicTrack;
  ambientTrack: AmbientTrack;
};

export type DailyGoalKind = "water" | "pet" | "task" | "mood" | "sleep" | "reminder";

export type RetentionReward = {
  stars: number;
  coins: number;
  xp: number;
};

export type DailyGoal = {
  id: string;
  kind: DailyGoalKind;
  title: string;
  target: number;
  progress: number;
  reward: RetentionReward;
  claimed: boolean;
};

export type RandomEventKind = "good" | "neutral" | "funny" | "checkin";

export type RandomEvent = {
  id: string;
  kind: RandomEventKind;
  title: string;
  message: string;
  reward?: Partial<RetentionReward>;
  createdAt: string;
};

export type AchievementId =
  | "first_pet"
  | "first_reminder"
  | "seven_day_streak"
  | "hundred_water_logs"
  | "best_friend"
  | "soul_companion";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  unlockedAt: string;
};

export type CatMemory = {
  lastMood?: MoodValue;
  lastCompletedTask?: string;
  lastReminderCompleted?: string;
  lastVisitMessage?: string;
  lastPetAt?: string;
  lastLoginDate?: string;
};

export type RetentionState = {
  coins: number;
  dailyGoalsDate: string;
  dailyGoals: DailyGoal[];
  lastDailyCheckIn: string;
  lastRandomEventAt: string;
  activeEvent?: RandomEvent;
  activeAchievement?: Achievement;
  achievements: Achievement[];
  streaks: {
    dailyVisits: number;
    waterGoals: number;
    taskCompletion: number;
    lastVisitDate: string;
    lastWaterGoalDate: string;
    lastTaskGoalDate: string;
  };
  memory: CatMemory;
};

export type MochiState = {
  profile: UserProfile;
  relationshipPoints: number;
  healthLogs: Record<string, HealthLog>;
  tasks: CareTask[];
  reminders: Reminder[];
  stars: number;
  ownedItems: string[];
  audioSettings: AudioSettings;
  retention: RetentionState;
};
