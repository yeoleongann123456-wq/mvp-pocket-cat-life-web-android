import { NavLink } from "react-router-dom";
import { FiBell, FiBookOpen, FiCheckCircle, FiCheckSquare, FiHome, FiSmile } from "react-icons/fi";
import { TbDropletHeart } from "react-icons/tb";

const items = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/health", label: "Health", icon: TbDropletHeart },
  { to: "/goals", label: "Goals", icon: FiCheckCircle },
  { to: "/tasks", label: "Tasks", icon: FiCheckSquare },
  { to: "/reminders", label: "Reminders", icon: FiBell },
  { to: "/collection", label: "Book", icon: FiBookOpen },
  { to: "/cat", label: "Cat", icon: FiSmile }
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[460px] gap-1 overflow-x-auto rounded-t-[28px] border-t border-white/20 bg-[#2a1c2d]/62 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-18px_36px_rgba(52,32,52,.16)] backdrop-blur-xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            className={({ isActive }) =>
              `grid min-h-14 min-w-[64px] flex-1 place-items-center rounded-xl text-[0.62rem] font-black transition ${
                isActive
                  ? "bg-gradient-to-br from-[#ff8dad] to-[#ffc36f] text-white shadow-lg"
                  : "bg-white/10 text-[#fff4f7]"
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
