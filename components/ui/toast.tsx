"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Toast = { id: number; message: string; type: "success" | "error" | "info" };
const Ctx = createContext<{ toast: (m: string, t?: Toast["type"]) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = (message: string, type: Toast["type"] = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className={`rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${t.type === "success" ? "bg-emerald-600 text-white" : t.type === "error" ? "bg-red-600 text-white" : "bg-zinc-900 text-white"}`}>
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast outside provider");
  return ctx;
}
