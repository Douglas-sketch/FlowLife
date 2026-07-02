import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarCheck2, CheckCircle2 } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Button, Card } from "../components/ui";
import { CENTERS } from "../data/mock";
import { useGamification } from "../context/GamificationContext";
import { clsx } from "clsx";

const TIMES = ["08:00", "09:30", "11:00", "13:30", "15:00"];

export default function Schedule() {
  const location = useLocation() as { state?: { centerId?: string } };
  const navigate = useNavigate();
  const { earn } = useGamification();
  const [centerId, setCenterId] = useState(location.state?.centerId ?? CENTERS[0].id);
  const [time, setTime] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const confirm = () => {
    earn(100, "Doação agendada");
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900">Doação agendada!</h2>
        <p className="text-sm text-gray-500">
          Você vai receber um lembrete um dia antes. Obrigado por fazer parte dessa corrente de vida.
        </p>
        <Button full onClick={() => navigate("/app/home")}>
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Agendar doação" back />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Escolha o posto</p>
          <div className="flex flex-col gap-2">
            {CENTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCenterId(c.id)}
                className={clsx(
                  "rounded-xl border-2 p-3 text-left transition",
                  centerId === c.id ? "border-brand-600 bg-brand-50" : "border-gray-200",
                )}
              >
                <p className="text-sm font-bold text-gray-800">{c.name}</p>
                <p className="text-xs text-gray-500">{c.address}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Escolha o horário</p>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={clsx(
                  "rounded-xl border-2 py-2.5 text-sm font-bold transition",
                  time === t ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <Card className="flex items-start gap-3 bg-warn-50 ring-1 ring-warn-300">
          <CalendarCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-warn-600" />
          <p className="text-xs leading-relaxed text-warn-700">
            Lembre-se: durma bem, alimente-se e evite bebidas alcoólicas nas 12h antes da doação. Leve um documento
            com foto.
          </p>
        </Card>

        <Button full disabled={!time} onClick={confirm}>
          Confirmar agendamento
        </Button>
      </div>
    </div>
  );
}
