export type RewardCategory = "farmacia" | "restaurante" | "transporte" | "loja" | "saude" | "brinde";

export interface Reward {
  id: string;
  partner: string;
  emoji: string;
  category: RewardCategory;
  offer: string;
  cost: number;
}

export const CATEGORY_STYLE: Record<
  RewardCategory,
  { label: string; chip: string; ring: string; soft: string; text: string }
> = {
  farmacia: { label: "Farmácia", chip: "bg-emerald-100 text-emerald-700", ring: "ring-emerald-100", soft: "bg-emerald-50", text: "text-emerald-600" },
  restaurante: { label: "Alimentação", chip: "bg-warn-100 text-warn-700", ring: "ring-warn-100", soft: "bg-warn-50", text: "text-warn-600" },
  transporte: { label: "Transporte", chip: "bg-info-100 text-info-700", ring: "ring-info-100", soft: "bg-info-50", text: "text-info-600" },
  loja: { label: "Compras", chip: "bg-violet-100 text-violet-700", ring: "ring-violet-100", soft: "bg-violet-50", text: "text-violet-600" },
  saude: { label: "Saúde", chip: "bg-brand-100 text-brand-700", ring: "ring-brand-100", soft: "bg-brand-50", text: "text-brand-600" },
  brinde: { label: "Brinde", chip: "bg-amber-100 text-amber-700", ring: "ring-amber-100", soft: "bg-amber-50", text: "text-amber-600" },
};

// Parceiros reais que oferecem descontos em troca de Gotas
export const REWARDS: Reward[] = [
  { id: "r1", partner: "Pague Menos", emoji: "💊", category: "farmacia", offer: "15% de desconto em toda a compra", cost: 220 },
  { id: "r2", partner: "RD Saúde", emoji: "🏥", category: "farmacia", offer: "R$ 25 de desconto em medicamentos", cost: 260 },
  { id: "r3", partner: "iFood", emoji: "🍔", category: "restaurante", offer: "R$ 20 de crédito no app", cost: 200 },
  { id: "r4", partner: "99", emoji: "🚗", category: "transporte", offer: "25% off em até 3 viagens", cost: 240 },
  { id: "r5", partner: "Amazon", emoji: "📦", category: "loja", offer: "Frete grátis + 10% de cashback", cost: 160 },
  { id: "r6", partner: "Mercado Livre", emoji: "🛒", category: "loja", offer: "Cupom de R$ 30 para usar agora", cost: 320 },
  { id: "r7", partner: "Real Hosp. Português", emoji: "🩺", category: "saude", offer: "Check-up preventivo com 30% off", cost: 900 },
  { id: "r8", partner: "Hemope", emoji: "🎁", category: "brinde", offer: "Kit doador exclusivo (camiseta + caneca)", cost: 120 },
];

export interface EarnRule {
  id: string;
  label: string;
  points: number;
  emoji: string;
  to?: string; // rota para realizar a ação
  demo?: boolean; // ação simulável na própria tela (convite/compartilhamento)
}

export const EARN_RULES: EarnRule[] = [
  { id: "e1", label: "Visita diária no app", points: 10, emoji: "📅" },
  { id: "e2", label: "Cadastrar tipo sanguíneo", points: 50, emoji: "🩸", to: "/setup-blood" },
  { id: "e3", label: "Agendar uma doação", points: 100, emoji: "📅", to: "/app/schedule" },
  { id: "e4", label: "Acertar o quiz ABO/Rh", points: 30, emoji: "🧠", to: "/app/compatibility" },
  { id: "e5", label: "Convidar um amigo", points: 50, emoji: "👥", demo: true },
  { id: "e6", label: "Compartilhar o FlowLife", points: 20, emoji: "📲", demo: true },
  { id: "e7", label: "Concluir uma doação", points: 200, emoji: "🏆" },
];
