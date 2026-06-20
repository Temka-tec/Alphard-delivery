"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch {
      setError("Холболтын алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
      <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
        Бүртгүүлэх
      </h2>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Бүртгэлтэй юу?{" "}
        <Link
          href={`/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`}
          className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)]"
        >
          Нэвтрэх
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
            Нэр (заавал биш)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Таны нэр"
            className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
            И-мэйл хаяг
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
            Нууц үг
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Хамгийн багадаа 6 тэмдэгт"
              className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 pr-11 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="btn-shine w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] disabled:opacity-60"
        >
          {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
        </button>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative flex flex-col justify-between overflow-hidden border-b border-white/8 bg-[linear-gradient(160deg,#0A0A0F_0%,#12121A_60%,#0F0F18_100%)] p-8 lg:border-b-0 lg:border-r lg:border-white/8 lg:p-12">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.09)_0%,transparent_70%)]" />
          <Link
            href="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em]"
          >
            ALPHARD<span className="text-[var(--color-gold)]">.</span>
          </Link>

          <div className="relative max-w-md">
            <div className="mb-5 inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-4 py-1.5 text-xs text-[var(--color-gold)]">
              Шинэ хэрэглэгчийн бүртгэл
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl">
              Дараагийн
              <br />
              <span className="text-[var(--color-gold)]">аяллаа</span>
              <br />
              эндээс эхлүүл
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Бүртгүүлээд баталгаажсан жолооч, найдвартай машинтай аяллаа хэдхэн
              алхмаар захиалах боломжтой болно.
            </p>
            <div className="mt-8 space-y-3 text-sm text-[var(--color-muted)]">
              <div>• Хэдхэн минутын дотор шинэ эрх нээнэ</div>
              <div>• Баталгаажсан жолооч, даатгалтай машин сонгоно</div>
              <div>• Захиалгын түүх, сэтгэгдлээ нэг газраас удирдана</div>
              <div>• Дараа нь жолооч эсвэл байгууллагын хүсэлт гаргаж болно</div>
            </div>
          </div>

          <div className="text-xs text-[#5A5856]">
            © 2026 Alphard Rentals · Улаанбаатар, Монгол
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-8">
          <Suspense
            fallback={
              <div className="h-64 w-full max-w-md animate-pulse rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-8" />
            }
          >
            <SignUpForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
