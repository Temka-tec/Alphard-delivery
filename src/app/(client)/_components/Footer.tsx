import Link from "next/link";
import { getCurrentViewer } from "@/lib/current-viewer";

export const Footer = async () => {
  const viewer = await getCurrentViewer();

  return (
    <footer
      id="about"
      className="border-t border-[var(--color-text)]/6 bg-[var(--color-bg)] px-6 py-10 text-center lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)]">
          ALPHARD<span className="text-[var(--color-gold)]">.</span>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Жолоочтой машин түрээслэлийн платформ · Монгол
        </p>
        {!viewer.isSignedIn ? (
          <Link
            href="/sign-in"
            className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[rgba(201,168,76,0.5)]" />
            <span>Нэвтрэх</span>
          </Link>
        ) : (
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E]" />
            <span>Та нэвтэрсэн байна</span>
          </div>
        )}
      </div>
    </footer>
  );
};
