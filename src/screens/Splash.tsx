import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, onboarded, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      if (!onboarded) navigate("/onboarding", { replace: true });
      else if (!isAuthenticated) navigate("/auth", { replace: true });
      else navigate("/app/home", { replace: true });
    }, 1400);
    return () => clearTimeout(t);
  }, [loading, isAuthenticated, onboarded, navigate]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 pulse-ring backdrop-blur">
        <Droplet className="h-12 w-12 fill-white text-white" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight">FlowLife</h1>
        <p className="mt-1 text-sm text-white/80">Cada gota move uma vida</p>
      </div>
    </div>
  );
}
