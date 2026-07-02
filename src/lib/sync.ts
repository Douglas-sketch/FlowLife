import { useEffect, useState } from "react";

export type SyncStatus = "synced" | "syncing" | "offline";

/**
 * Simula o comportamento de um cache local (equivalente ao Room no Android)
 * combinado a sincronização em tempo real com o backend: os dados sempre
 * carregam instantaneamente do armazenamento local e, quando há conexão,
 * uma sincronização em segundo plano é disparada.
 */
export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>("syncing");
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const online = navigator.onLine;
    setStatus(online ? "syncing" : "offline");

    const t = setTimeout(() => {
      setStatus(navigator.onLine ? "synced" : "offline");
      setLastSync(new Date());
    }, 900);

    const goOnline = () => {
      setStatus("syncing");
      setTimeout(() => {
        setStatus("synced");
        setLastSync(new Date());
      }, 800);
    };
    const goOffline = () => setStatus("offline");

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      clearTimeout(t);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return { status, lastSync };
}
