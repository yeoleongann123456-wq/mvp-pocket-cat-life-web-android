export type BreedId = "orange" | "ragdoll" | "british" | "black" | "munchkin";

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

export type MochiState = {
  profile: UserProfile;
  relationshipPoints: number;
  healthLogs: Record<string, HealthLog>;
  tasks: CareTask[];
  reminders: Reminder[];
};
