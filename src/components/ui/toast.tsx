"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  success: "bg-success/10 border-success/20 text-success",
  error: "bg-danger/10 border-danger/20 text-danger",
  warning: "bg-warning/10 border-warning/20 text-warning",
  info: "bg-accent/10 border-accent/20 text-accent",
};

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
              styleMap[toast.type]
            )}
          >
            {(() => {
              const Icon = iconMap[toast.type];
              return <Icon className="h-5 w-5 shrink-0 mt-0.5" />;
            })()}
            <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
