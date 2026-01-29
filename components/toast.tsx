"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastIcons: Record<ToastType, ReactNode> = {
  success: <Check className="h-4 w-4" />,
  error: <X className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

const toastStyles: Record<ToastType, string> = {
  success: "bg-emerald-500 text-white shadow-emerald-500/25",
  error: "bg-rose-500 text-white shadow-rose-500/25",
  warning: "bg-amber-500 text-white shadow-amber-500/25",
  info: "bg-sky-500 text-white shadow-sky-500/25",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex flex-col items-center px-4 pt-safe">
        <div className="mt-4 flex flex-col items-center gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              onClick={() => dismissToast(toast.id)}
              className={cn(
                "pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lg",
                "animate-in fade-in slide-in-from-top-4 duration-300",
                "cursor-pointer transition-all duration-200 active:scale-95",
                toastStyles[toast.type]
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white/20">
                {toastIcons[toast.type]}
              </span>
              <span className="text-[13px] font-semibold">{toast.message}</span>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
