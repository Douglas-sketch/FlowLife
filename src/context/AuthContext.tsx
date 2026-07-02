import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { BloodType } from "../data/blood";

export interface UserProfile {
  name: string;
  email: string;
  bloodType: BloodType | null;
  city: string;
  eligible: boolean;
  donationsCount: number;
  createdAt: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  onboarded: boolean;
  loading: boolean;
  login: (email: string, _password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, _password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  setBloodType: (type: BloodType) => void;
  completeOnboarding: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
}

const STORAGE_KEY = "flowlife.session.v1";
const ONBOARD_KEY = "flowlife.onboarded.v1";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simula leitura do cache local (equivalente a um DAO Room) ao iniciar o app,
  // permitindo uso offline antes de revalidar com o backend.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      setOnboarded(localStorage.getItem(ONBOARD_KEY) === "1");
    } catch {
      /* cache indisponível */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const login: AuthContextValue["login"] = async (email, _password) => {
    await new Promise((r) => setTimeout(r, 700));
    if (!email.includes("@")) return { ok: false, error: "Informe um e-mail válido." };
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? (JSON.parse(existingRaw) as UserProfile) : null;
    const profile: UserProfile = existing ?? {
      name: email.split("@")[0],
      email,
      bloodType: null,
      city: "Recife, PE",
      eligible: true,
      donationsCount: 2,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    return { ok: true };
  };

  const register: AuthContextValue["register"] = async (name, email, _password) => {
    await new Promise((r) => setTimeout(r, 900));
    if (!name.trim()) return { ok: false, error: "Informe seu nome." };
    if (!email.includes("@")) return { ok: false, error: "Informe um e-mail válido." };
    const profile: UserProfile = {
      name,
      email,
      bloodType: null,
      city: "Recife, PE",
      eligible: true,
      donationsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ONBOARD_KEY);
    setOnboarded(false);
  };

  const setBloodType = (type: BloodType) => {
    setUser((u) => (u ? { ...u, bloodType: type } : u));
  };

  const completeOnboarding = () => {
    setOnboarded(true);
    localStorage.setItem(ONBOARD_KEY, "1");
  };

  const updateProfile = (patch: Partial<UserProfile>) => {
    setUser((u) => (u ? { ...u, ...patch } : u));
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      onboarded,
      loading,
      login,
      register,
      logout,
      setBloodType,
      completeOnboarding,
      updateProfile,
    }),
    [user, onboarded, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
