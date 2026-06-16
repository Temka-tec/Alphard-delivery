"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) {
    return (
      <button
        type="button"
        aria-label="Theme солих"
        className="rounded-lg border border-white/10 p-2.5 text-[var(--color-muted)] transition"
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Theme солих"
      className="group rounded-lg border border-[rgba(201,168,76,0.2)] bg-[var(--color-surface)] p-2.5 text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:bg-[rgba(201,168,76,0.05)] hover:text-[var(--color-gold)]"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform group-hover:rotate-12" />
      ) : (
        <Moon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
