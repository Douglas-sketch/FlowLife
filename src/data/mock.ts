import type { BloodType } from "./blood";

export interface StockItem {
  type: BloodType;
  level: number; // 0-100
}

export const STOCK: StockItem[] = [
  { type: "O-", level: 12 },
  { type: "O+", level: 28 },
  { type: "A-", level: 34 },
  { type: "A+", level: 58 },
  { type: "B-", level: 20 },
  { type: "B+", level: 47 },
  { type: "AB-", level: 15 },
  { type: "AB+", level: 66 },
];

export interface Center {
  id: string;
  name: string;
  city: string;
  address: string;
  distanceKm: number;
  waitMinutes: number;
  hours: string;
}

export const CENTERS: Center[] = [
  {
    id: "c1",
    name: "Hemope - Unidade Derby",
    city: "Recife, PE",
    address: "Av. Rui Barbosa, 350 - Derby",
    distanceKm: 1.8,
    waitMinutes: 15,
    hours: "07h às 17h",
  },
  {
    id: "c2",
    name: "Hemope - Unidade Boa Viagem",
    city: "Recife, PE",
    address: "Av. Domingos Ferreira, 1200",
    distanceKm: 4.2,
    waitMinutes: 30,
    hours: "07h às 16h",
  },
  {
    id: "c3",
    name: "Unidade Móvel FlowLife - Campus UNI",
    city: "Recife, PE",
    address: "Estacionamento do bloco C",
    distanceKm: 0.6,
    waitMinutes: 10,
    hours: "09h às 15h (hoje)",
  },
];

export interface Campaign {
  id: string;
  title: string;
  description: string;
  date: string;
  tag: "urgente" | "novidade" | "evento";
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: "cp1",
    title: "Alerta: estoque de O- em nível crítico",
    description:
      "O Hemope está pedindo doações urgentes de qualquer tipo sanguíneo. Sua doação pode salvar até 4 vidas.",
    date: "Hoje",
    tag: "urgente",
  },
  {
    id: "cp2",
    title: "Coleta móvel no seu campus",
    description: "FlowLife leva uma unidade móvel até universidades parceiras nesta semana.",
    date: "Sáb, 09h-15h",
    tag: "evento",
  },
  {
    id: "cp3",
    title: "Novidade: agora você acompanha seu impacto",
    description: "Veja quantas vidas você já ajudou a salvar no seu perfil.",
    date: "Novo",
    tag: "novidade",
  },
];

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: "urgente" | "lembrete" | "novidade";
  time: string;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Estoque crítico: O- e AB-",
    body: "Hemope precisa urgentemente de doadores O- e AB- nas próximas 48h.",
    type: "urgente",
    time: "há 2h",
  },
  {
    id: "n2",
    title: "Você já pode doar novamente!",
    body: "Já se passaram os 60 dias necessários desde sua última doação.",
    type: "lembrete",
    time: "há 1 dia",
  },
  {
    id: "n3",
    title: "Nova conquista disponível",
    body: "Complete o quiz sobre o Fator Rh e ganhe o selo 'Sabe do Sangue'.",
    type: "novidade",
    time: "há 3 dias",
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "a1", title: "Primeira Gota", description: "Cadastrou seu tipo sanguíneo", icon: "droplet", unlocked: true },
  { id: "a2", title: "Sabe do Sangue", description: "Concluiu o quiz ABO/Rh", icon: "brain", unlocked: true },
  { id: "a3", title: "Herói Iniciante", description: "Agendou sua 1ª doação", icon: "award", unlocked: false },
  { id: "a4", title: "Doador Fiel", description: "3 doações realizadas", icon: "medal", unlocked: false },
  { id: "a5", title: "Embaixador", description: "Convidou 3 amigos para o app", icon: "users", unlocked: false },
];

export interface DonationHistoryItem {
  id: string;
  date: string;
  center: string;
  status: "concluida" | "agendada" | "cancelada";
}

export const HISTORY: DonationHistoryItem[] = [
  { id: "h1", date: "12/03/2025", center: "Hemope - Unidade Derby", status: "concluida" },
  { id: "h2", date: "20/07/2025", center: "Hemope - Unidade Boa Viagem", status: "concluida" },
];
