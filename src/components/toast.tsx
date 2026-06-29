"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Sparkles, X } from "lucide-react";

type ToastType = "default" | "success" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

let externalSetToasts: React.Dispatch<React.SetStateAction<Toast[]>> | null =
  null;

export const toast = {
  show(message: string, type: ToastType = "default") {
    if (!externalSetToasts) return;
    const id = Math.random().toString(36).slice(2);
    externalSetToasts((prev) => [...prev, { id, message, type }]);
  },
  success(message: string) {
    toast.show(message, "success");
  },
  error(message: string) {
    toast.show(message, "error");
  },
};

export function ToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    externalSetToasts = setToasts;
    return () => {
      externalSetToasts = null;
    };
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDone={remove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast: t,
  onDone,
}: {
  toast: Toast;
  onDone: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // mount хийгдсэний дараа нэг frame хүлээнэ → CSS transition ажиллана
    const raf = requestAnimationFrame(() => setVisible(true));

    timer.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone(t.id), 380);
    }, 3200);

    return () => {
      cancelAnimationFrame(raf);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [t.id, onDone]);

  const iconMap: Record<ToastType, ReactNode> = {
    default: <Sparkles size={14} aria-hidden="true" />,
    success: <Check size={14} aria-hidden="true" />,
    error: <X size={14} aria-hidden="true" />,
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={() => {
        setVisible(false);
        setTimeout(() => onDone(t.id), 380);
      }}
      className={[
        "toast",
        visible ? "toast-show" : "",
        t.type === "success" ? "toast-success" : "",
        t.type === "error" ? "toast-error" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="toast-icon">{iconMap[t.type]}</span>
      <span>{t.message}</span>
    </div>
  );
}
