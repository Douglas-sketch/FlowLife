import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff, Send, Sparkles, Volume2 } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { askAssistant } from "../lib/ai";
import { useVoiceCommands } from "../lib/voice";
import { useAccessibility } from "../context/AccessibilityContext";
import { clsx } from "clsx";

interface Message {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "O que é o fator Rh?",
  "Quem pode doar para AB+?",
  "Como agendo uma doação?",
  "Como aumento o contraste?",
];

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Oi! Eu sou a Vita, sua assistente do FlowLife. Posso te ajudar com dúvidas sobre tipos sanguíneos, doação de sangue e acessibilidade. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const { speak, speechEnabled } = useAccessibility();
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  const handleCommand = (text: string) => {
    if (text.includes("agend")) navigate("/app/schedule");
    else if (text.includes("posto") || text.includes("mapa")) navigate("/app/centers");
    else if (text.includes("perfil")) navigate("/app/profile");
    else if (text.includes("início") || text.includes("inicio") || text.includes("home")) navigate("/app/home");
    else send(text);
  };

  const { listening, supported, start, stop } = useVoiceCommands(handleCommand);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    const newHistory = [...messages, { role: "user" as const, text }];
    setMessages(newHistory);
    setInput("");
    setSending(true);
    const result = await askAssistant(
      text,
      newHistory.map((m) => ({ role: m.role, text: m.text })),
    );
    setMessages((prev) => [...prev, { role: "model", text: result.text }]);
    setSending(false);
    if (speechEnabled) speak(result.text);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Vita · Assistente IA"
        subtitle="Ajuda e acessibilidade em tempo real"
        right={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
        }
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={clsx(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "ml-auto rounded-br-sm bg-brand-600 text-white"
                  : "mr-auto rounded-bl-sm bg-white text-gray-700 ring-1 ring-black/5",
              )}
            >
              {m.text}
              {m.role === "model" && (
                <button
                  onClick={() => speak(m.text)}
                  aria-label="Ouvir mensagem"
                  className="ml-2 inline-flex align-middle text-gray-400 hover:text-brand-600"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
          {sending && (
            <div className="mr-auto flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 ring-1 ring-black/5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-300" />
            </div>
          )}
          <div ref={endRef} />
        </div>

        {messages.length < 2 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="a11y-surface border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-3 py-2">
          {supported && (
            <button
              onClick={() => (listening ? stop() : start())}
              aria-label="Comando de voz"
              className={clsx(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition",
                listening ? "bg-brand-600 text-white" : "bg-white text-gray-500 shadow-sm",
              )}
            >
              {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          )}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={listening ? "Ouvindo..." : "Pergunte algo à Vita..."}
            className="flex-1 bg-transparent text-sm outline-none"
          />
          <button
            onClick={() => send()}
            aria-label="Enviar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        {!supported && (
          <p className="mt-2 text-center text-[10px] text-gray-400">
            Comandos de voz não são suportados neste navegador.
          </p>
        )}
      </div>
    </div>
  );
}
