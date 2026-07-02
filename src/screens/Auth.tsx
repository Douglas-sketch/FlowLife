import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Droplet, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { clsx } from "clsx";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = mode === "login" ? await login(email, password) : await register(name, email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Não foi possível continuar.");
      return;
    }
    if (!user?.bloodType) navigate("/setup-blood", { replace: true });
    else navigate("/app/home", { replace: true });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-6 pb-10 pt-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 shadow-lg shadow-brand-600/30">
          <Droplet className="h-8 w-8 fill-white text-white" />
        </div>
        <h1 className="text-xl font-black text-gray-900">FlowLife</h1>
        <p className="text-xs text-gray-500">Sua conta é protegida e seus dados nunca são compartilhados sem permissão.</p>
      </div>

      <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError(null);
            }}
            className={clsx(
              "flex-1 rounded-lg py-2 text-sm font-bold transition",
              mode === m ? "bg-white text-brand-600 shadow-sm" : "text-gray-500",
            )}
          >
            {m === "login" ? "Entrar" : "Criar conta"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4">
        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-gray-600">Nome completo</span>
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-500">
              <User className="h-4 w-4 text-gray-400" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full text-sm outline-none"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-gray-600">E-mail</span>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-500">
            <Mail className="h-4 w-4 text-gray-400" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full text-sm outline-none"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-gray-600">Senha</span>
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-3 focus-within:border-brand-500">
            <Lock className="h-4 w-4 text-gray-400" />
            <input
              required
              minLength={6}
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full text-sm outline-none"
            />
            <button type="button" onClick={() => setShowPass((s) => !s)} aria-label="Mostrar senha">
              {showPass ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </label>

        {error && <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700">{error}</p>}

        <div className="mt-2 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
          Seus dados de saúde e identificação são criptografados e usados apenas para viabilizar sua doação, conforme a LGPD.
        </div>

        <Button type="submit" disabled={submitting} full className="mt-auto">
          {submitting ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar minha conta"}
        </Button>
      </form>
    </div>
  );
}
