const GEMINI_KEY_STORAGE = "flowlife.ai.key.v1";

export function getStoredGeminiKey(): string {
  try {
    return localStorage.getItem(GEMINI_KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

export function setStoredGeminiKey(key: string) {
  try {
    if (key) localStorage.setItem(GEMINI_KEY_STORAGE, key);
    else localStorage.removeItem(GEMINI_KEY_STORAGE);
  } catch {
    /* ignore */
  }
}

const SYSTEM_CONTEXT = `Você é a Vita, assistente de acessibilidade e ajuda do aplicativo FlowLife,
um app brasileiro que incentiva a doação de sangue e explica o sistema ABO e o fator Rh.
Responda sempre em português do Brasil, de forma curta (até 4 frases), calorosa, clara e acessível
(evite jargões técnicos). Você pode explicar tipos sanguíneos, requisitos para doar sangue,
como usar o app (agendar doação, encontrar postos, ver conquistas) e dar apoio a pessoas com
deficiência visual, motora ou cognitiva. Nunca mencione bancos de dados, provedores de nuvem ou
tecnologias internas do aplicativo.`;

interface AskResult {
  text: string;
  source: "gemini" | "offline";
}

const FALLBACK_RULES: { keys: string[]; answer: string }[] = [
  {
    keys: ["o negativo", "o-", "doador universal"],
    answer:
      "O tipo O- é chamado de doador universal porque não possui os antígenos A, B nem o fator Rh, podendo doar hemácias para qualquer pessoa. Por isso ele é tão importante em emergências!",
  },
  {
    keys: ["ab+", "ab positivo", "receptor universal"],
    answer:
      "O tipo AB+ é o receptor universal: como já tem os antígenos A, B e o fator Rh, pode receber sangue de qualquer tipo sanguíneo sem risco de rejeição.",
  },
  {
    keys: ["fator rh", "rh"],
    answer:
      "O fator Rh indica se existe (positivo) ou não (negativo) a proteína Rh nas hemácias. Pessoas Rh negativo só devem receber sangue Rh negativo, já as Rh positivo podem receber os dois tipos, respeitando o sistema ABO.",
  },
  {
    keys: ["sistema abo", "tipo sanguíneo", "tipos sanguíneos", "abo"],
    answer:
      "O sistema ABO classifica o sangue em A, B, AB ou O, de acordo com os antígenos presentes nas hemácias. Essa classificação, junto com o fator Rh, define quem pode doar sangue para quem com segurança.",
  },
  {
    keys: ["agendar", "marcar doação", "doar sangue", "como doar"],
    answer:
      "Para agendar sua doação, toque em 'Agendar doação' na tela inicial, escolha o posto mais próximo e o melhor horário. Vou te lembrar um dia antes!",
  },
  {
    keys: ["posto", "onde doar", "perto de mim", "unidade"],
    answer:
      "Você encontra os postos de coleta mais próximos na aba 'Postos'. Também temos coletas móveis em universidades e empresas parceiras.",
  },
  {
    keys: ["contraste", "enxergar", "visão", "letra", "fonte", "tamanho da letra"],
    answer:
      "Você pode aumentar o contraste e o tamanho da letra em Configurações > Acessibilidade. Isso deixa o app mais confortável para quem tem baixa visão.",
  },
  {
    keys: ["voz", "comando de voz", "falar com o app", "microfone"],
    answer:
      "Ative os comandos de voz em Configurações > Acessibilidade e toque no microfone. Você pode dizer coisas como 'abrir agendamento' ou 'ler estoque de sangue'.",
  },
  {
    keys: ["posso doar", "requisitos", "elegível", "peso", "idade mínima"],
    answer:
      "Em geral, é preciso ter entre 16 e 69 anos (menores precisam de autorização), pesar mais de 50kg, estar bem alimentado e descansado, e aguardar o intervalo mínimo entre doações (60 dias para homens, 90 para mulheres). Sempre confirme no posto de coleta.",
  },
];

function offlineAnswer(message: string): string {
  const normalized = message.toLowerCase();
  const match = FALLBACK_RULES.find((rule) => rule.keys.some((k) => normalized.includes(k)));
  if (match) return match.answer;
  return "Ótima pergunta! Posso te ajudar com dúvidas sobre tipos sanguíneos, como agendar uma doação, encontrar postos próximos ou ajustar a acessibilidade do app. Pode perguntar de outro jeito?";
}

export async function askAssistant(message: string, history: { role: "user" | "model"; text: string }[]): Promise<AskResult> {
  const apiKey = getStoredGeminiKey();

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 500));
    return { text: offlineAnswer(message), source: "offline" };
  }

  try {
    const contents = [
      { role: "user", parts: [{ text: SYSTEM_CONTEXT }] },
      { role: "model", parts: [{ text: "Entendido! Estou pronta para ajudar." }] },
      ...history.map((h) => ({ role: h.role, parts: [{ text: h.text }] })),
      { role: "user", parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      },
    );

    if (!res.ok) throw new Error("Falha na resposta da IA");
    const data = await res.json();
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Resposta vazia");
    return { text: text.trim(), source: "gemini" };
  } catch {
    return { text: offlineAnswer(message), source: "offline" };
  }
}
