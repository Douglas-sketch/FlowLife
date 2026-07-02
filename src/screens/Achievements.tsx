import { Award, Brain, Droplet, Medal, Users } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Card } from "../components/ui";
import { ACHIEVEMENTS } from "../data/mock";
import { clsx } from "clsx";

const ICONS: Record<string, typeof Award> = { award: Award, brain: Brain, droplet: Droplet, medal: Medal, users: Users };

export default function Achievements() {
  return (
    <div className="flex flex-col">
      <TopBar title="Conquistas" back subtitle="Continue doando para desbloquear mais selos" />
      <div className="grid grid-cols-2 gap-3 px-5 py-5">
        {ACHIEVEMENTS.map((a) => {
          const Icon = ICONS[a.icon] ?? Award;
          return (
            <Card key={a.id} className={clsx("flex flex-col items-center gap-2 py-6 text-center", !a.unlocked && "opacity-50")}>
              <div className={clsx("flex h-14 w-14 items-center justify-center rounded-full", a.unlocked ? "bg-brand-50 text-brand-600" : "bg-gray-100 text-gray-400")}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-sm font-extrabold text-gray-800">{a.title}</p>
              <p className="text-[11px] text-gray-500">{a.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
