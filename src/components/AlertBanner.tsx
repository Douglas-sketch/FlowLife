import { AlertTriangle, Info, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { clsx } from "clsx";

type Tone = "danger" | "warning" | "info";

const STYLES: Record<Tone, { wrap: string; icon: ReactNode }> = {
  danger: {
    wrap: "bg-brand-600 text-white",
    icon: <Siren className="h-5 w-5 shrink-0" />,
  },
  warning: {
    wrap: "bg-warn-100 text-warn-700 ring-1 ring-warn-300",
    icon: <AlertTriangle className="h-5 w-5 shrink-0" />,
  },
  info: {
    wrap: "bg-info-100 text-info-700 ring-1 ring-info-300",
    icon: <Info className="h-5 w-5 shrink-0" />,
  },
};

export function AlertBanner({
  tone,
  title,
  description,
  action,
}: {
  tone: Tone;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  const s = STYLES[tone];
  return (
    <div className={clsx("a11y-surface flex items-start gap-3 rounded-2xl p-4", s.wrap, tone === "danger" && "shadow-lg shadow-brand-600/25")}>
      {s.icon}
      <div className="flex-1">
        <p className="text-sm font-bold leading-snug">{title}</p>
        {description && <p className={clsx("mt-0.5 text-xs leading-relaxed", tone === "danger" ? "text-white/90" : "opacity-90")}>{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
