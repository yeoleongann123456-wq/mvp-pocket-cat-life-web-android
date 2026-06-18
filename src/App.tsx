import { motion } from "framer-motion";
import { FiHeart, FiSettings } from "react-icons/fi";
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <main className="min-h-screen bg-[#120f19] px-4 py-6 text-mochi-cream">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto grid max-w-md gap-4 rounded-lg border border-white/10 bg-white/10 p-4 shadow-game backdrop-blur"
      >
        <nav className="flex items-center justify-between">
          <Link className="inline-flex items-center gap-2 font-black" to="/">
            <FiHeart /> Mochi
          </Link>
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-mochi-rose" to="/settings">
            <FiSettings /> Settings
          </Link>
        </nav>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<SettingsPage />} path="/settings" />
        </Routes>
      </motion.section>
    </main>
  );
}
