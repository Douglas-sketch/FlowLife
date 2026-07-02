import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { ABO_TYPES, RH_TYPES, type ABOType, type RhType } from "../data/blood";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useGamification } from "../context/GamificationContext";
import { clsx } from "clsx";

export default function BloodSetup() {
  const [abo, setAbo] = useState<ABOType | null>(null);
  const [rh, setRh] = useState<RhType | null>(null);
  const [unknown, setUnknown] = useState(false);
  const { setBloodType, user } = useAuth();
  const { earn } = useGamification();
  const navigate = useNavigate();

  const canContinue = unknown || (abo && rh);

  const handleContinue = () => {
    if (abo && rh) {
      setBloodType(`${abo}${rh}`);
      if (!user?.bloodType) earn(50, "Tipo sanguíneo cadastrado");
    }
    navigate("/app/home", { replace: true });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-6 pb-8 pt-12">
      <h1 className="text-xl font-extrabold text-gray-900">Qual é o seu tipo sanguíneo?</h1>
      <p className="mt-1 text-sm text-gray-500">
        Vamos usar isso para te mostrar sua compatibilidade e alertas de estoque relevantes.
      </p>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Grupo (sistema ABO)</p>
        <div className="grid grid-cols-4 gap-2">
          {ABO_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setAbo(t);
                setUnknown(false);
              }}
              className={clsx(
                "rounded-xl border-2 py-3 text-sm font-extrabold transition",
                abo === t ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Fator Rh</p>
        <div className="grid grid-cols-2 gap-2">
          {RH_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => {
                setRh(t);
                setUnknown(false);
              }}
              className={clsx(
                "rounded-xl border-2 py-3 text-sm font-extrabold transition",
                rh === t ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-500",
              )}
            >
              {t === "+" ? "Positivo (+)" : "Negativo (-)"}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setUnknown(true);
          setAbo(null);
          setRh(null);
        }}
        className={clsx(
          "mt-6 flex items-center gap-2 rounded-xl border-2 border-dashed p-3 text-left text-xs font-semibold",
          unknown ? "border-info-500 bg-info-50 text-info-700" : "border-gray-200 text-gray-500",
        )}
      >
        <HelpCircle className="h-4 w-4 shrink-0" />
        Ainda não sei meu tipo sanguíneo — quero descobrir no posto de doação.
      </button>

      <Button full disabled={!canContinue} onClick={handleContinue} className="mt-8">
        Continuar
      </Button>
    </div>
  );
}
