import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Onboarding from "./components/Onboarding";
import { CAT_BREEDS } from "./features/cat/breeds";
import { useReminderNotifications } from "./hooks/useReminderNotifications";
import CatPage from "./pages/CatPage";
import HealthPage from "./pages/HealthPage";
import HomePage from "./pages/HomePage";
import RemindersPage from "./pages/RemindersPage";
import TasksPage from "./pages/TasksPage";
import { useMochiStore } from "./store/useMochiStore";

export default function App() {
  const profile = useMochiStore((state) => state.profile);
  const reminders = useMochiStore((state) => state.reminders);
  const completeOnboarding = useMochiStore((state) => state.completeOnboarding);
  const recordDailyReturn = useMochiStore((state) => state.recordDailyReturn);
  const notificationsEnabled = profile.notificationPreference === "allowed";
  const breed = CAT_BREEDS[profile.breedId];

  useReminderNotifications(reminders, notificationsEnabled);

  useEffect(() => {
    if (profile.onboardingComplete) {
      recordDailyReturn();
    }
  }, [profile.onboardingComplete, recordDailyReturn]);

  if (!profile.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <main className="min-h-screen bg-mochi-bg px-4 pb-28 pt-[calc(1rem+env(safe-area-inset-top))] text-[#49343a]">
      <section className="mx-auto grid max-w-[430px] gap-4">
        <header className="flex items-center justify-between rounded-[26px] border border-white/20 bg-white/75 px-4 py-3 shadow-xl backdrop-blur">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#b26d83]">Mochi</p>
            <h1 className="text-xl font-black">The Cat That Cares</h1>
          </div>
          <div
            className="h-12 w-12 rounded-2xl border-4 border-white shadow-inner"
            style={{ background: `linear-gradient(135deg, ${breed.colors.secondary}, ${breed.colors.primary})` }}
          />
        </header>

        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<HealthPage />} path="/health" />
          <Route element={<TasksPage />} path="/tasks" />
          <Route element={<RemindersPage />} path="/reminders" />
          <Route element={<CatPage />} path="/cat" />
        </Routes>
      </section>
      <BottomNav />
    </main>
  );
}
