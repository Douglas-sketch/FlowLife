import { CloudOff, RefreshCw, CloudCheck } from "lucide-react";
import { useSyncStatus } from "../lib/sync";

export function SyncIndicator() {
  const { status } = useSyncStatus();

  if (status === "offline") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500">
        <CloudOff className="h-3 w-3" /> Modo offline
      </span>
    );
  }
  if (status === "syncing") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-info-50 px-2 py-1 text-[10px] font-semibold text-info-600">
        <RefreshCw className="h-3 w-3 animate-spin" /> Sincronizando
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
      <CloudCheck className="h-3 w-3" /> Atualizado
    </span>
  );
}
