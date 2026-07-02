import { useState } from "react";
import { ArrowRight, Droplets } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Card, SectionTitle } from "../components/ui";
import { BloodBadge } from "../components/BloodBadge";
import { useAuth } from "../context/AuthContext";
import {
  ABO_EXPLANATION,
  ALL_BLOOD_TYPES,
  BLOOD_FACTS,
  RH_EXPLANATION,
  canDonateTo,
  canReceiveFrom,
  type BloodType,
} from "../data/blood";

export default function Compatibility() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<BloodType>(user?.bloodType ?? "O+");

  return (
    <div className="flex flex-col">
      <TopBar title="Compatibilidade sanguínea" subtitle="Baseado no sistema ABO e fator Rh" />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">Escolha um tipo sanguíneo</p>
          <div className="grid grid-cols-4 gap-2">
            {ALL_BLOOD_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setSelected(t)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 py-3 transition ${
                  selected === t ? "border-brand-600 bg-brand-50" : "border-gray-200"
                }`}
              >
                <span className="text-sm font-extrabold text-gray-700">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <Card className="flex items-center gap-3">
          <BloodBadge type={selected} size="lg" />
          <p className="a11y-muted text-sm leading-relaxed text-gray-600">{BLOOD_FACTS[selected]}</p>
        </Card>

        <div>
          <SectionTitle>Pode doar para</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {canDonateTo(selected).map((t) => (
              <div key={t} className="flex items-center gap-1 rounded-full bg-brand-50 py-1.5 pl-1.5 pr-3">
                <BloodBadge type={t} size="sm" />
                <span className="text-xs font-bold text-brand-700">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Pode receber de</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {canReceiveFrom(selected).map((t) => (
              <div key={t} className="flex items-center gap-1 rounded-full bg-info-50 py-1.5 pl-1.5 pr-3">
                <BloodBadge type={t} size="sm" />
                <span className="text-xs font-bold text-info-700">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Droplets className="h-5 w-5 text-brand-600" />
            <p className="text-sm font-extrabold text-gray-800">{ABO_EXPLANATION.title}</p>
          </div>
          <p className="a11y-muted text-xs leading-relaxed text-gray-500">{ABO_EXPLANATION.text}</p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-brand-600" />
            <p className="text-sm font-extrabold text-gray-800">{RH_EXPLANATION.title}</p>
          </div>
          <p className="a11y-muted text-xs leading-relaxed text-gray-500">{RH_EXPLANATION.text}</p>
        </Card>
      </div>
    </div>
  );
}
