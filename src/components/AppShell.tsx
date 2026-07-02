import type { ReactNode } from "react";

/**
 * Layout normal (sem moldura de celular), mas mobile-first:
 * ocupa a tela inteira no celular e fica centralizado em telas grandes.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-gray-200/70">
      <div className="relative flex h-screen w-full max-w-[460px] flex-col overflow-hidden bg-gray-50 sm:border-x sm:border-gray-200">
        {children}
      </div>
    </div>
  );
}
