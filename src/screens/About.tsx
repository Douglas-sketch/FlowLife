import { Droplet, HeartHandshake, Sparkles, Target } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { Card } from "../components/ui";

export default function About() {
  return (
    <div className="flex flex-col">
      <TopBar title="Sobre o FlowLife" back />
      <div className="flex flex-col gap-5 px-5 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/25">
            <Droplet className="h-8 w-8 fill-white text-white" />
          </div>
          <h1 className="text-lg font-extrabold text-gray-900">FlowLife</h1>
          <p className="text-xs text-gray-500">Cada gota move uma vida</p>
        </div>

        <Card className="flex items-start gap-3">
          <Target className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="text-sm font-bold text-gray-800">Nosso propósito</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              O FlowLife nasceu para aproximar novos doadores dos hemocentros, usando educação sobre tipos
              sanguíneos, lembretes inteligentes e acessibilidade para engajar públicos que hoje doam pouco, como
              jovens e universitários.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <HeartHandshake className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="text-sm font-bold text-gray-800">Impacto esperado</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Ao reduzir barreiras de informação e logística, o FlowLife busca aumentar a frequência de doações
              regulares e ajudar bancos de sangue a manterem estoques seguros para cirurgias e emergências.
            </p>
          </div>
        </Card>

        <Card className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
          <div>
            <p className="text-sm font-bold text-gray-800">Acessibilidade em primeiro lugar</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              Contamos com a assistente Vita, comandos de voz e alto contraste dinâmico para que pessoas com
              deficiência visual, motora ou cognitiva também possam participar dessa corrente do bem.
            </p>
          </div>
        </Card>

        <p className="text-center text-[11px] text-gray-400">
          Projeto desenvolvido para fins educacionais — protótipo de Desenvolvimento de Sistemas.
        </p>
      </div>
    </div>
  );
}
