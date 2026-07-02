import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export interface Level {
  name: string;
  min: number;
  emoji: string;
}

export const LEVELS: Level[] = [
  { name: "Iniciante", min: 0, emoji: "🌱" },
  { name: "Solidário", min: 150, emoji: "🤝" },
  { name: "Herói", min: 400, emoji: "🦸" },
  { name: "Guardião", min: 900, emoji: "🛡️" },
  { name: "Lenda da Vida", min: 1800, emoji: "💎" },
];

function levelFor(points: number) {
  let current = LEVELS[0];
  let next: Level | null = null;
  for (let i = 0; i < LEVELS.length; i++) {
    if (points >= LEVELS[i].min) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }
  return { current, next };
}

export interface ToastData {
  id: number;
  message: string;
  amount: number;
}

interface GamificationContextValue {
  points: number;
  totalEarned: number;
  level: Level;
  nextLevel: Level | null;
  progress: number;
  pointsToNext: number;
  claimed: string[];
  toast: ToastData | null;
  dismissToast: () => void;
  earn: (amount: number, reason: string) => void;
  claim: (rewardId: string, cost: number) => boolean;
  isClaimed: (id: string) => boolean;
}

const KEY = "flowlife.game.v1";
const STARTING_POINTS = 120;

const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(STARTING_POINTS);
  const [totalEarned, setTotalEarned] = useState(STARTING_POINTS);
  const [claimed, setClaimed] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastData | null>(null);
  const pointsRef = useRef(STARTING_POINTS);

  // Hidrata o cache local (equivalente ao Room) e aplica o bônus diário de visita.
  useEffect(() => {
    const today = new Date().toDateString();
    let data: { points: number; totalEarned: number; claimed: string[]; lastVisit: string };
    try {
      const raw = localStorage.getItem(KEY);
      data = raw
        ? JSON.parse(raw)
        : { points: STARTING_POINTS, totalEarned: STARTING_POINTS, claimed: [], lastVisit: "" };
    } catch {
      data = { points: STARTING_POINTS, totalEarned: STARTING_POINTS, claimed: [], lastVisit: "" };
    }

    let bonus = false;
    if (data.lastVisit !== today) {
      data.points += 10;
      data.totalEarned += 10;
      data.lastVisit = today;
      bonus = true;
    }

    setPoints(data.points);
    setTotalEarned(data.totalEarned);
    setClaimed(data.claimed);
    pointsRef.current = data.points;
    localStorage.setItem(KEY, JSON.stringify(data));

    if (bonus) {
      setTimeout(() => setToast({ id: Date.now(), message: "Bônus diário resgatado", amount: 10 }), 600);
    }
  }, []);

  // Persistência (sincronização do cache local)
  useEffect(() => {
    pointsRef.current = points;
    const today = new Date().toDateString();
    localStorage.setItem(KEY, JSON.stringify({ points, totalEarned, claimed, lastVisit: today }));
  }, [points, totalEarned, claimed]);

  const earn = useCallback((amount: number, reason: string) => {
    setPoints((p) => p + amount);
    setTotalEarned((t) => t + amount);
    setToast({ id: Date.now(), message: reason, amount });
  }, []);

  const claim = useCallback((rewardId: string, cost: number) => {
    if (pointsRef.current < cost) return false;
    setPoints((p) => p - cost);
    setClaimed((c) => [...c, rewardId]);
    setToast({ id: Date.now(), message: "Recompensa resgatada!", amount: -cost });
    return true;
  }, []);

  const isClaimed = useCallback((id: string) => claimed.includes(id), [claimed]);
  const dismissToast = useCallback(() => setToast(null), []);

  const { current: level, next: nextLevel } = useMemo(() => levelFor(points), [points]);

  const progress = useMemo(() => {
    if (!nextLevel) return 100;
    const span = nextLevel.min - level.min;
    const done = points - level.min;
    return Math.min(100, Math.max(0, Math.round((done / span) * 100)));
  }, [points, level, nextLevel]);

  const pointsToNext = nextLevel ? Math.max(0, nextLevel.min - points) : 0;

  const value = useMemo(
    () => ({
      points,
      totalEarned,
      level,
      nextLevel,
      progress,
      pointsToNext,
      claimed,
      toast,
      dismissToast,
      earn,
      claim,
      isClaimed,
    }),
    [points, totalEarned, level, nextLevel, progress, pointsToNext, claimed, toast, dismissToast, earn, claim, isClaimed],
  );

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification deve ser usado dentro de GamificationProvider");
  return ctx;
}
