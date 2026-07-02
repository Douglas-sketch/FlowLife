import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function TopBar({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const navigate = useNavigate();
  return (
    <header className="a11y-surface sticky top-0 z-20 flex items-center gap-3 border-b border-gray-100 bg-white/95 px-4 py-3.5 backdrop-blur">
      {back && (
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 active:scale-95"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
      )}
      <div className="flex-1">
        <h1 className="a11y-invert-text text-[17px] font-extrabold leading-tight text-gray-900">{title}</h1>
        {subtitle && <p className="a11y-muted text-xs text-gray-500">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
