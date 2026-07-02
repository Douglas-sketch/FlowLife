import { useEffect } from "react";
import { Droplet } from "lucide-react";
import { useGamification } from "../context/GamificationContext";
import { clsx } from "clsx";

export function Toaster() {
  const { toast, dismissToast } = useGamification();

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 2800);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  if (!toast) return null;

  const positive = toast.amount >= 0;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-6">
      <div
        className={clsx(
          "flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl ring-1 transition-all",
          positive ? "bg-brand-600 text-white ring-brand-700" : "bg-warn-500 text-white ring-warn-600",
        )}
        key={toast.id}
      >
        <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full", positive ? "bg-white/20" : "bg-black/15")}>
          <Droplet className={clsx("h-4 w-4", positive && "fill-white")} />
        </span>
        <div className="text-left">
          <p className="text-sm font-extrabold leading-none">
            {positive ? `+${toast.amount}` : toast.amount} Gotas
          </p>
          <p className="text-xs text-white/85">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}
