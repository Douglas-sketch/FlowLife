import { Bell, Info, Siren } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Card } from "../components/ui";
import { NOTIFICATIONS } from "../data/mock";
import { clsx } from "clsx";

const STYLE = {
  urgente: { icon: Siren, wrap: "bg-brand-50 text-brand-600" },
  lembrete: { icon: Bell, wrap: "bg-warn-100 text-warn-600" },
  novidade: { icon: Info, wrap: "bg-info-100 text-info-600" },
};

export default function Notifications() {
  return (
    <div className="flex flex-col">
      <TopBar title="Notificações" back />
      <div className="flex flex-col gap-3 px-5 py-5">
        {NOTIFICATIONS.map((n) => {
          const s = STYLE[n.type];
          const Icon = s.icon;
          return (
            <Card key={n.id} className="flex items-start gap-3">
              <div className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", s.wrap)}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-800">{n.title}</p>
                  <span className="whitespace-nowrap text-[10px] text-gray-400">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{n.body}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
