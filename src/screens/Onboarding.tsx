import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { clsx } from "clsx";

const SLIDES = [
  {
    icon: Droplet,
    title: "Entenda seu tipo sanguíneo",
    text: "Descubra de forma simples como funcionam o sistema ABO e o fator Rh, e por que sua doação é única.",
  },
  {
    icon: MapPin,
    title: "Doe perto de você",
    text: "Encontre postos e coletas móveis próximas, veja o estoque em tempo real e agende em poucos toques.",
  },
  {
    icon: HeartHandshake,
    title: "Sinta o impacto",
    text: "Acompanhe conquistas, seu histórico de doações e quantas vidas você já ajudou a salvar.",
  },
  {
    icon: Sparkles,
    title: "Um app para todos",
    text: "Assistente inteligente, comandos de voz e alto contraste tornam o FlowLife acessível para qualquer pessoa.",
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useAuth();
  const slide = SLIDES[step];
  const Icon = slide.icon;
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white px-6 pb-8 pt-14">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] bg-brand-50">
          <Icon className="h-14 w-14 text-brand-600" strokeWidth={1.6} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">{slide.title}</h2>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500">{slide.text}</p>
      </div>

      <div className="mb-8 flex items-center justify-center gap-2">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={clsx("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-brand-600" : "w-1.5 bg-gray-200")}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {!isLast && (
          <Button variant="ghost" onClick={finish} className="flex-1">
            Pular
          </Button>
        )}
        <Button
          variant="primary"
          full
          onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          className={isLast ? "" : "flex-[2]"}
        >
          {isLast ? "Começar agora" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
