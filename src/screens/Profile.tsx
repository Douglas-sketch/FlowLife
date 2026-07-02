import { Link, useNavigate } from "react-router-dom";
import { Award, ChevronRight, History, LogOut, Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BloodBadge } from "../components/BloodBadge";
import { Badge, Card, SectionTitle } from "../components/ui";
import { HISTORY } from "../data/mock";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 px-5 pb-6 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-gray-900">Meu perfil</h1>
        <Link to="/app/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
          <SettingsIcon className="h-4.5 w-4.5 text-gray-600" />
        </Link>
      </div>

      <Card className="flex flex-col items-center gap-3 py-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-black text-white">
          {user?.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="text-center">
          <p className="text-base font-extrabold text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        {user?.bloodType && <BloodBadge type={user.bloodType} />}
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="flex flex-col items-center gap-1 py-4">
          <p className="text-lg font-extrabold text-brand-600">{user?.donationsCount ?? 0}</p>
          <p className="text-center text-[11px] text-gray-500">Doações</p>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <p className="text-lg font-extrabold text-brand-600">{(user?.donationsCount ?? 0) * 3}</p>
          <p className="text-center text-[11px] text-gray-500">Vidas impactadas</p>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <p className="text-lg font-extrabold text-brand-600">2</p>
          <p className="text-center text-[11px] text-gray-500">Conquistas</p>
        </Card>
      </div>

      <Link to="/app/rewards">
        <Card className="flex items-center gap-3 bg-gradient-to-br from-brand-600 to-brand-700 !ring-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl">🎁</span>
          <div className="flex-1 text-white">
            <p className="text-sm font-extrabold">Minhas recompensas</p>
            <p className="text-[11px] text-white/80">Troque suas Gotas por descontos reais</p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/90" />
        </Card>
      </Link>

      <div>
        <SectionTitle
          action={
            <Link to="/app/achievements" className="flex items-center gap-1 text-xs font-bold text-brand-600">
              Ver todas <ChevronRight className="h-3 w-3" />
            </Link>
          }
        >
          Conquistas recentes
        </SectionTitle>
        <Card className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-warn-100 text-warn-600">
            <Award className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-800">Sabe do Sangue</p>
            <p className="text-xs text-gray-500">Concluiu o quiz sobre ABO e Rh</p>
          </div>
          <Badge tone="success">Novo</Badge>
        </Card>
      </div>

      <div>
        <SectionTitle>Histórico de doações</SectionTitle>
        <div className="flex flex-col gap-2">
          {HISTORY.map((h) => (
            <Card key={h.id} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <History className="h-4.5 w-4.5 text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{h.center}</p>
                <p className="text-xs text-gray-500">{h.date}</p>
              </div>
              <Badge tone="success">Concluída</Badge>
            </Card>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/auth", { replace: true });
        }}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-500"
      >
        <LogOut className="h-4 w-4" /> Sair da conta
      </button>
    </div>
  );
}
