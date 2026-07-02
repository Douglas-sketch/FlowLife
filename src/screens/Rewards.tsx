import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronRight, Gift, Lock, Sparkles, Trophy } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Button, Card, SectionTitle } from "../components/ui";
import { useGamification } from "../context/GamificationContext";
import { CATEGORY_STYLE, EARN_RULES, REWARDS } from "../data/rewards";
import { clsx } from "clsx";

function voucherCode(id: string) {
  return `FL-${id.toUpperCase().slice(1)}-${Math.floor(100 + Math.random() * 900)}`;
}

export default function Rewards() {
  const { points, level, nextLevel, progress, pointsToNext, totalEarned, claim, isClaimed, earn } = useGamification();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState<string | null>(null);

  const handleClaim = (id: string, cost: number, partner: string) => {
    const ok = claim(id, cost);
    if (ok) setVoucher(`${partner} · ${voucherCode(id)}`);
  };

  const handleDemo = (ruleId: string, points: number, label: string) => {
    earn(points, label);
    void ruleId;
  };

  return (
    <div className="flex flex-col">
      <TopBar
        title="Recompensas"
        subtitle="Doe sangue, ganhe Gotas e troque por prêmios reais"
        right={<span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Gift className="h-4.5 w-4.5" /></span>}
      />

      <div className="flex flex-col gap-5 px-5 py-5">
        {/* Cartão de progresso / nível */}
        <Card className="overflow-hidden !p-0">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/80">Suas Gotas</p>
                <p className="text-4xl font-black leading-none">{points.toLocaleString("pt-BR")}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl">
                {level.emoji}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-bold">Nível {level.name}</span>
                {nextLevel ? (
                  <span className="text-white/80">Faltam {pointsToNext} para {nextLevel.name} {nextLevel.emoji}</span>
                ) : (
                  <span className="text-white/80">Nível máximo!</span>
                )}
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <div className="flex divide-x divide-gray-100 text-center">
            <div className="flex-1 py-3">
              <p className="text-base font-extrabold text-gray-900">{totalEarned}</p>
              <p className="text-[11px] text-gray-500">Total ganho</p>
            </div>
            <div className="flex-1 py-3">
              <p className="text-base font-extrabold text-gray-900">{isClaimed ? REWARDS.filter((r) => isClaimed(r.id)).length : 0}</p>
              <p className="text-[11px] text-gray-500">Resgatados</p>
            </div>
            <div className="flex-1 py-3">
              <p className="text-base font-extrabold text-gray-900">{level.name}</p>
              <p className="text-[11px] text-gray-500">Seu nível</p>
            </div>
          </div>
        </Card>

        {/* Como ganhar Gotas */}
        <div>
          <SectionTitle>Como ganhar Gotas</SectionTitle>
          <Card className="flex flex-col gap-1 !p-2">
            {EARN_RULES.map((rule) => (
              <div key={rule.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-lg">{rule.emoji}</span>
                <span className="flex-1 text-sm font-semibold text-gray-700">{rule.label}</span>
                {rule.demo ? (
                  <button
                    onClick={() => handleDemo(rule.id, rule.points, rule.label)}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700 active:scale-95"
                  >
                    +{rule.points}
                  </button>
                ) : rule.to ? (
                  <button onClick={() => navigate(rule.to!)} className="flex items-center gap-1 text-xs font-bold text-brand-600">
                    +{rule.points} <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">+{rule.points}</span>
                )}
              </div>
            ))}
          </Card>
        </div>

        {/* Recompensas dos parceiros */}
        <div>
          <SectionTitle action={<span className="flex items-center gap-1 text-xs font-bold text-info-600"><Sparkles className="h-3.5 w-3.5" /> Novidades toda semana</span>}>
            Recompensas dos parceiros
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {REWARDS.map((r) => {
              const style = CATEGORY_STYLE[r.category];
              const claimed = isClaimed(r.id);
              const affordable = points >= r.cost;
              return (
                <Card key={r.id} className="flex flex-col gap-2 !p-3">
                  <div className="flex items-start justify-between">
                    <span className={clsx("flex h-10 w-10 items-center justify-center rounded-xl text-xl", style.soft)}>{r.emoji}</span>
                    <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-bold", style.chip)}>{style.label}</span>
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-gray-900">{r.partner}</p>
                    <p className="text-[11px] leading-snug text-gray-500">{r.offer}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-0.5 text-xs font-extrabold text-brand-600">
                      <span className="text-[9px]">💧</span> {r.cost}
                    </span>
                    {claimed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <Check className="h-3 w-3" /> Resgatado
                      </span>
                    ) : affordable ? (
                      <button
                        onClick={() => handleClaim(r.id, r.cost, r.partner)}
                        className="rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white active:scale-95"
                      >
                        Resgatar
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-400">
                        <Lock className="h-2.5 w-2.5" /> faltam {r.cost - points}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Voucher revelado */}
        {voucher && (
          <Card className="flex items-start gap-3 border-2 border-dashed border-brand-300 bg-brand-50">
            <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <div className="flex-1">
              <p className="text-sm font-extrabold text-brand-700">Parabéns! 🎉</p>
              <p className="text-xs text-brand-700/80">Seu voucher foi gerado:</p>
              <p className="mt-1 rounded-lg bg-white px-3 py-2 text-center text-sm font-black tracking-wider text-brand-700 ring-1 ring-brand-200">
                {voucher}
              </p>
              <p className="mt-1 text-[10px] text-brand-700/70">Apresente este código no parceiro. Válido por 30 dias.</p>
            </div>
            <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => setVoucher(null)}>
              <Check className="h-4 w-4" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
