import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AudioControls from "./components/AudioControls";
import BottomNav from "./components/BottomNav";
import Onboarding from "./components/Onboarding";
import RetentionPopups from "./components/RetentionPopups";
import { CAT_BREEDS } from "./features/cat/breeds";
import { useButtonClickAudio, useMochiAudio } from "./hooks/useMochiAudio";
import { useReminderNotifications } from "./hooks/useReminderNotifications";
import CatPage from "./pages/CatPage";
import CollectionPage from "./pages/CollectionPage";
import DailyGoalsPage from "./pages/DailyGoalsPage";
import HealthPage from "./pages/HealthPage";
import HomePage from "./pages/HomePage";
import RemindersPage from "./pages/RemindersPage";
import TasksPage from "./pages/TasksPage";
import { useMochiStore } from "./store/useMochiStore";
import { getCatDisplayNameUpper } from "./utils/catName";

export default function App() {
  const profile = useMochiStore((state) => state.profile);
  const reminders = useMochiStore((state) => state.reminders);
  const completeOnboarding = useMochiStore((state) => state.completeOnboarding);
  const recordDailyReturn = useMochiStore((state) => state.recordDailyReturn);
  const location = useLocation();
  const notificationsEnabled = profile.notificationPreference === "allowed";
  const breed = CAT_BREEDS[profile.breedId];
  const catNameUpper = getCatDisplayNameUpper(profile.catName);
  const isHome = location.pathname === "/";

  useMochiAudio();
  useButtonClickAudio();
  useReminderNotifications(reminders, notificationsEnabled, profile.catName);

  useEffect(() => {
    if (profile.onboardingComplete) {
      recordDailyReturn();
    }
  }, [profile.onboardingComplete, recordDailyReturn]);

  if (!profile.onboardingComplete) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <main className={`min-h-screen bg-mochi-bg text-[#49343a] ${isHome ? "px-0 pb-0 pt-0" : "px-4 pb-28 pt-[calc(1rem+env(safe-area-inset-top))]"}`}>
      <section className={`mx-auto grid ${isHome ? "max-w-[430px]" : "max-w-[430px] gap-4"}`}>
        {!isHome && (
          <>
            <header className="flex items-center justify-between rounded-[26px] border border-white/20 bg-white/75 px-4 py-3 shadow-xl backdrop-blur">
              <div>
                <p className="text-[0.68rem] font-black uppercase tracking-wide text-[#b26d83]">{catNameUpper}</p>
                <h1 className="text-xl font-black">The Cat That Cares</h1>
              </div>
              <div
                className="h-12 w-12 rounded-2xl border-4 border-white shadow-inner"
                style={{ background: `linear-gradient(135deg, ${breed.colors.secondary}, ${breed.colors.primary})` }}
              />
            </header>
            <AudioControls />
          </>
        )}

        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<HealthPage />} path="/health" />
          <Route element={<DailyGoalsPage />} path="/goals" />
          <Route element={<TasksPage />} path="/tasks" />
          <Route element={<RemindersPage />} path="/reminders" />
          <Route element={<CollectionPage />} path="/collection" />
          <Route element={<CatPage />} path="/cat" />
        </Routes>
      </section>
      <RetentionPopups />
      <BottomNav />
    </main>
  );
}
