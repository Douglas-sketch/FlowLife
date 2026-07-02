import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Contrast, Eye, Info, Mic, ShieldCheck, Sparkles, Type, Volume2 } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Card, SectionTitle } from "../components/ui";
import { useAccessibility, type FontScale } from "../context/AccessibilityContext";
import { getStoredGeminiKey, setStoredGeminiKey } from "../lib/ai";
import { clsx } from "clsx";

const FONT_OPTIONS: { value: FontScale; label: string }[] = [
  { value: "md", label: "A" },
  { value: "lg", label: "A+" },
  { value: "xl", label: "A++" },
  { value: "xxl", label: "A+++" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={clsx("h-6 w-11 shrink-0 rounded-full p-0.5 transition", checked ? "bg-brand-600" : "bg-gray-200")}
      aria-pressed={checked}
    >
      <span className={clsx("block h-5 w-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
    </button>
  );
}

export default function Settings() {
  const { contrast, setContrast, fontScale, setFontScale, voiceEnabled, toggleVoice, speechEnabled, toggleSpeech } =
    useAccessibility();
  const [geminiKey, setGeminiKey] = useState(getStoredGeminiKey());
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex flex-col">
      <TopBar title="Configurações" back />
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <SectionTitle>Acessibilidade</SectionTitle>
          <Card className="flex flex-col gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Contrast className="h-4.5 w-4.5 text-brand-600" />
                <p className="text-sm font-bold text-gray-800">Alto contraste</p>
              </div>
              <div className="flex gap-2">
                {(["normal", "high"] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setContrast(c)}
                    className={clsx(
                      "flex-1 rounded-lg py-2 text-xs font-bold transition",
                      contrast === c ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {c === "normal" ? "Padrão" : "Alto contraste"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Type className="h-4.5 w-4.5 text-brand-600" />
                <p className="text-sm font-bold text-gray-800">Tamanho do texto</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFontScale(f.value)}
                    className={clsx(
                      "rounded-lg py-2 text-xs font-bold transition",
                      fontScale === f.value ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4.5 w-4.5 text-brand-600" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Comandos de voz</p>
                  <p className="text-[11px] text-gray-500">Navegue pelo app falando</p>
                </div>
              </div>
              <Toggle checked={voiceEnabled} onChange={toggleVoice} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4.5 w-4.5 text-brand-600" />
                <div>
                  <p className="text-sm font-bold text-gray-800">Leitura em voz alta</p>
                  <p className="text-[11px] text-gray-500">A Vita lê as respostas para você</p>
                </div>
              </div>
              <Toggle checked={speechEnabled} onChange={toggleSpeech} />
            </div>
          </Card>
        </div>

        <div>
          <SectionTitle>Assistente inteligente</SectionTitle>
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-brand-600" />
              <p className="text-sm font-bold text-gray-800">Chave da IA (opcional)</p>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-500">
              O FlowLife já vem com respostas inteligentes prontas. Se quiser respostas ainda mais avançadas da Vita,
              você pode conectar sua própria chave de IA. Ela fica salva apenas neste aparelho.
            </p>
            <input
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="Colar chave de API (opcional)"
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:border-brand-500"
            />
            <button
              onClick={() => {
                setStoredGeminiKey(geminiKey);
                setSaved(true);
                setTimeout(() => setSaved(false), 1600);
              }}
              className="rounded-lg bg-brand-600 py-2 text-xs font-bold text-white"
            >
              {saved ? "Salvo!" : "Salvar"}
            </button>
          </Card>
        </div>

        <div>
          <SectionTitle>Privacidade e segurança</SectionTitle>
          <Card className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
            <p className="text-xs leading-relaxed text-gray-500">
              Seus dados pessoais e de saúde são protegidos com criptografia e nunca são exibidos publicamente. Você
              pode solicitar a exclusão da sua conta a qualquer momento.
            </p>
          </Card>
        </div>

        <Link to="/about">
          <Card className="flex items-center gap-3">
            <Info className="h-5 w-5 text-gray-400" />
            <p className="flex-1 text-sm font-bold text-gray-700">Sobre o FlowLife</p>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Card>
        </Link>

        <Link to="/app/achievements">
          <Card className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-gray-400" />
            <p className="flex-1 text-sm font-bold text-gray-700">Minhas conquistas</p>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
