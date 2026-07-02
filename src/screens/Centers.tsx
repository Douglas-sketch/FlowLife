import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Navigation } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Button, Card } from "../components/ui";
import { CENTERS } from "../data/mock";

export default function Centers() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col">
      <TopBar title="Postos de coleta" subtitle="Encontrados próximos à sua localização" />
      <div className="flex flex-col gap-3 px-5 py-5">
        <div className="a11y-surface flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-info-100 to-info-50 text-info-500">
          <div className="flex flex-col items-center gap-1">
            <Navigation className="h-7 w-7" />
            <p className="text-xs font-semibold">Mapa de postos próximos</p>
          </div>
        </div>

        {CENTERS.map((c) => (
          <Card key={c.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="a11y-invert-text text-sm font-extrabold text-gray-900">{c.name}</p>
                <p className="a11y-muted flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /> {c.address} · {c.city}
                </p>
              </div>
              <span className="whitespace-nowrap rounded-full bg-brand-50 px-2 py-1 text-[11px] font-bold text-brand-700">
                {c.distanceKm} km
              </span>
            </div>
            <div className="a11y-muted flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Espera ~{c.waitMinutes} min
              </span>
              <span>{c.hours}</span>
            </div>
            <Button variant="outline" onClick={() => navigate("/app/schedule", { state: { centerId: c.id } })}>
              Agendar neste posto
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
