import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx("a11y-surface rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5", className)}>
      {children}
    </div>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  full?: boolean;
}

export function Button({ variant = "primary", full, className, children, ...rest }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  const variants: Record<string, string> = {
    primary: "a11y-primary bg-brand-600 text-white shadow-md shadow-brand-600/25 hover:bg-brand-700",
    secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  return (
    <button className={clsx(base, variants[variant], full && "w-full", className)} {...rest}>
      {children}
    </button>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="a11y-invert-text text-base font-bold text-gray-900">{children}</h2>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "danger",
}: {
  children: ReactNode;
  tone?: "danger" | "warning" | "info" | "neutral" | "success";
}) {
  const tones: Record<string, string> = {
    danger: "bg-brand-50 text-brand-700 ring-1 ring-brand-200",
    warning: "bg-warn-100 text-warn-700 ring-1 ring-warn-300",
    info: "bg-info-100 text-info-700 ring-1 ring-info-300",
    neutral: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
    success: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
  };
  return <span className={clsx("rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>{children}</span>;
}
