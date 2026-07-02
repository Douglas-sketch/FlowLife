import { Link } from "react-router-dom";
import { Bell, CalendarPlus, ChevronRight, Droplet, Flame, Gift, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { AlertBanner } from "../components/AlertBanner";
import { Badge, Button, Card, SectionTitle } from "../components/ui";
import { BloodBadge } from "../components/BloodBadge";
import { SyncIndicator } from "../components/SyncIndicator";
import { PointsPill } from "../components/PointsPill";
import { STOCK, CAMPAIGNS } from "../data/mock";
import { bloodStockLevel } from "../data/blood";

export default function Home() {
  const { user } = useAuth();
  const { points, level, progress, nextLevel } = useGamification();
  const criticalStock = STOCK.filter((s) => bloodStockLevel(s.type, s.level).tone === "danger");
  const firstName = user?.name?.split(" ")[0] ?? "Doador";

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="a11y-muted text-xs text-gray-500">Olá, {firstName} 👋</p>
          <h1 className="a11y-invert-text text-lg font-extrabold text-gray-900">Vamos salvar vidas hoje?</h1>
        </div>
        <div className="flex items-center gap-2">
          <SyncIndicator />
          <Link to="/app/rewards" aria-label="Minhas Gotas">
            <PointsPill points={points} />
          </Link>
          <Link
            to="/app/notifications"
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5"
          >
            <Bell className="h-4.5 w-4.5 text-gray-600" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600" />
          </Link>
        </div>
      </div>

      <AlertBanner
        tone="danger"
        title="Estoque crítico de sangue no Hemope"
        description={`Tipos ${criticalStock.map((s) => s.type).join(", ")} estão em nível urgente. Qualquer tipo sanguíneo pode ajudar agora.`}
        action={
          <Link to="/app/schedule">
            <Button variant="secondary" className="!bg-white/15 !text-white hover:!bg-white/25">
              Agendar agora <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        }
      />

      <Card className="flex items-center gap-4">
        {user?.bloodType ? <BloodBadge type={user.bloodType} size="lg" /> : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Droplet className="h-7 w-7 text-gray-300" />
          </div>
        )}
        <div className="flex-1">
          <p className="a11y-muted text-xs text-gray-500">Seu tipo sanguíneo</p>
          <p className="a11y-invert-text text-lg font-extrabold text-gray-900">{user?.bloodType ?? "Não informado"}</p>
          <p className="a11y-muted text-xs text-gray-400">{user?.donationsCount ?? 0} doações realizadas</p>
        </div>
        <Link to="/app/compatibility">
          <Button variant="outline" className="!px-3 !py-2 text-xs">
            Ver compatibilidade
          </Button>
        </Link>
      </Card>

      <Link to="/app/rewards">
        <Card className="flex items-center gap-3 bg-gradient-to-br from-brand-600 to-brand-700 !ring-0">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">{level.emoji}</span>
          <div className="flex-1 text-white">
            <p className="text-xs text-white/80">Nível {level.name}</p>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            {nextLevel ? (
              <p className="mt-1 text-[11px] text-white/80">{points.toLocaleString("pt-BR")} Gotas · faltam {nextLevel.min - points} para {nextLevel.name}</p>
            ) : (
              <p className="mt-1 text-[11px] text-white/80">{points.toLocaleString("pt-BR")} Gotas · nível máximo!</p>
            )}
          </div>
          <Gift className="h-5 w-5 text-white/90" />
        </Card>
      </Link>

      <div className="grid grid-cols-2 gap-3">
        <Card className="flex flex-col items-start gap-1">
          <Flame className="h-5 w-5 text-warn-500" />
          <p className="a11y-invert-text text-xl font-extrabold text-gray-900">7 dias</p>
          <p className="a11y-muted text-xs text-gray-500">até você poder doar de novo</p>
        </Card>
        <Card className="flex flex-col items-start gap-1">
          <MapPin className="h-5 w-5 text-info-500" />
          <p className="a11y-invert-text text-xl font-extrabold text-gray-900">3 postos</p>
          <p className="a11y-muted text-xs text-gray-500">próximos de você agora</p>
        </Card>
      </div>

      <Link to="/app/schedule">
        <Button full className="!py-4">
          <CalendarPlus className="h-4.5 w-4.5" /> Agendar minha doação
        </Button>
      </Link>

      <div>
        <SectionTitle
          action={
            <Link to="/app/centers" className="text-xs font-bold text-brand-600">
              Ver postos
            </Link>
          }
        >
          Estoque de sangue no seu estado
        </SectionTitle>
        <Card className="flex flex-col gap-3">
          {STOCK.map((s) => {
            const info = bloodStockLevel(s.type, s.level);
            return (
              <div key={s.type} className="flex items-center gap-3">
                <span className="w-9 text-xs font-bold text-gray-600">{s.type}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={
                      info.tone === "danger"
                        ? "h-full bg-brand-600"
                        : info.tone === "warning"
                          ? "h-full bg-warn-500"
                          : "h-full bg-info-500"
                    }
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <Badge tone={info.tone}>{info.label}</Badge>
              </div>
            );
          })}
        </Card>
      </div>

      <div>
        <SectionTitle>Campanhas e novidades</SectionTitle>
        <div className="flex flex-col gap-3">
          {CAMPAIGNS.map((c) => (
            <Card key={c.id} className="flex items-start gap-3">
              <Badge tone={c.tag === "urgente" ? "danger" : c.tag === "novidade" ? "info" : "warning"}>
                {c.tag === "urgente" ? "Urgente" : c.tag === "novidade" ? "Novidade" : "Evento"}
              </Badge>
              <div className="flex-1">
                <p className="a11y-invert-text text-sm font-bold text-gray-800">{c.title}</p>
                <p className="a11y-muted mt-0.5 text-xs text-gray-500">{c.description}</p>
                <p className="mt-1 text-[11px] font-semibold text-gray-400">{c.date}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
