import { Droplet } from "lucide-react";
import { clsx } from "clsx";

export function PointsPill({
  points,
  className,
  onClick,
}: {
  points: number;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm shadow-brand-600/30",
        onClick && "active:scale-95",
        className,
      )}
    >
      <Droplet className="h-3 w-3 fill-white" />
      {points.toLocaleString("pt-BR")}
    </Comp>
  );
}
