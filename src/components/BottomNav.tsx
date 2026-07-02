import { NavLink } from "react-router-dom";
import { Droplets, Gift, Home, MapPin, Sparkles, UserRound } from "lucide-react";
import { clsx } from "clsx";
import { useGamification } from "../context/GamificationContext";

const ITEMS = [
  { to: "/app/home", label: "Início", icon: Home },
  { to: "/app/compatibility", label: "Sangue", icon: Droplets },
  { to: "/app/centers", label: "Postos", icon: MapPin },
  { to: "/app/rewards", label: "Prêmios", icon: Gift, highlight: true },
  { to: "/app/assistant", label: "Vita IA", icon: Sparkles },
  { to: "/app/profile", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const { points } = useGamification();
  return (
    <nav className="a11y-surface sticky bottom-0 z-30 grid grid-cols-6 border-t border-gray-100 bg-white/95 px-0.5 pb-[max(0.3rem,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur">
      {ITEMS.map(({ to, label, icon: Icon, highlight }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              "relative flex flex-col items-center gap-0.5 rounded-lg px-0.5 py-1 text-[9px] font-semibold transition",
              isActive ? "text-brand-600" : "a11y-muted text-gray-400",
            )
          }
        >
          {({ isActive }) => (
            <>
              {label === "Prêmios" && (
                <span className="absolute -top-0 right-1/2 translate-x-3 rounded-full bg-brand-600 px-1 text-[8px] font-black leading-tight text-white">
                  {points > 999 ? "999+" : points}
                </span>
              )}
              <span
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full transition",
                  isActive && "bg-brand-50",
                  highlight && !isActive && "bg-brand-600/10 text-brand-500",
                )}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={isActive || highlight ? 2.4 : 2} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
