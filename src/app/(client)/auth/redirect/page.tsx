"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    const resolveRedirect = async () => {
      try {
        const response = await fetch("/api/auth/redirect-target", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          router.replace("/");
          return;
        }

        const data = (await response.json()) as { target?: string };
        router.replace(data.target || "/");
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") {
          router.replace("/");
        }
      }
    };

    void resolveRedirect();

    return () => {
      controller.abort();
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 py-10 text-[var(--color-text)]">
      <div className="rounded-2xl border border-white/8 bg-[var(--color-surface)] px-6 py-5 text-sm text-[var(--color-muted)]">
        Нэвтрэлтийн мэдээллийг шалгаж байна...
      </div>
    </main>
  );
}
