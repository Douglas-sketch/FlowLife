import { clsx } from "clsx";
import type { BloodType } from "../data/blood";

export function BloodBadge({ type, size = "md" }: { type: BloodType; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-lg",
  };
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 font-extrabold text-white shadow-md shadow-brand-600/30",
        sizes[size],
      )}
    >
      {type}
    </div>
  );
}
