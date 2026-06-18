import { NavLink } from "react-router-dom";
import { FiBell, FiCheckSquare, FiHeart, FiHome, FiSmile } from "react-icons/fi";
import { TbDropletHeart } from "react-icons/tb";

const items = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/health", label: "Health", icon: TbDropletHeart },
  { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
  { to: "/reminders", label: "Reminders", icon: FiBell },
  { to: "/cat", label: "Cat", icon: FiSmile }
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-[460px] grid-cols-5 gap-1 border-t border-white/10 bg-[#2a1c2d]/90 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            className={({ isActive }) =>
              `grid min-h-14 place-items-center rounded-xl text-[0.68rem] font-black transition ${
                isActive
                  ? "bg-gradient-to-br from-[#ff8dad] to-[#ffc36f] text-white shadow-lg"
                  : "bg-white/5 text-[#ead6dc]"
              }`
            }
            key={item.to}
            to={item.to}
          >
            <Icon className="text-lg" />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
