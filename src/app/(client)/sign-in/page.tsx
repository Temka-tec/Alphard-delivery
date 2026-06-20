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

type View = "login" | "forgot-email" | "forgot-code" | "forgot-reset" | "forgot-success";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const [view, setView] = useState<View>("login");

  // login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // forgot password state
  const [fpEmail, setFpEmail] = useState("");
  const [fpCode, setFpCode] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpShowPassword, setFpShowPassword] = useState(false);
  const [fpError, setFpError] = useState<string | null>(null);
  const [fpLoading, setFpLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError(null);
    setFpLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail }),
      });

      if (!res.ok) {
        setFpError(await res.text());
        return;
      }

      setView("forgot-code");
    } catch {
      setFpError("Холболтын алдаа гарлаа.");
    } finally {
      setFpLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpCode.length !== 6) {
      setFpError("6 оронтой кодоо оруулна уу.");
      return;
    }
    setFpError(null);
    setView("forgot-reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFpError(null);
    setFpLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fpEmail,
          code: fpCode,
          newPassword: fpNewPassword,
        }),
      });

      if (!res.ok) {
        setFpError(await res.text());
        return;
      }

      setView("forgot-success");
    } catch {
      setFpError("Холболтын алдаа гарлаа.");
    } finally {
      setFpLoading(false);
    }
  };

  const resetForgotFlow = () => {
    setFpEmail("");
    setFpCode("");
    setFpNewPassword("");
    setFpError(null);
    setView("login");
  };

  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
      {/* ── LOGIN ── */}
      {view === "login" && (
        <>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
            Нэвтрэх
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Бүртгэлгүй юу?{" "}
            <Link
              href={`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`}
              className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)]"
            >
              Бүртгүүлэх
            </Link>
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs text-[var(--color-muted)]">
                  Нууц үг
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setView("forgot-email");
                    setFpEmail(email);
                  }}
                  className="text-xs text-[var(--color-gold)] hover:text-[var(--color-gold-light)]"
                >
                  Нууц үгээ мартсан уу?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>
          </form>
        </>
      )}

      {/* ── FORGOT: ENTER EMAIL ── */}
      {view === "forgot-email" && (
        <>
          <button
            type="button"
            onClick={resetForgotFlow}
            className="mb-4 flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          >
            ← Буцах
          </button>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
            Нууц үг сэргээх
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Бүртгэлтэй и-мэйл хаягаа оруулна уу. Нэг удаагийн код илгээнэ.
          </p>

          <form onSubmit={handleSendCode} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
                И-мэйл хаяг
              </label>
              <input
                type="email"
                required
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
              />
            </div>

            {fpError ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {fpError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={fpLoading}
              className="btn-shine w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] disabled:opacity-60"
            >
              {fpLoading ? "Илгээж байна..." : "Код илгээх"}
            </button>
          </form>
        </>
      )}

      {/* ── FORGOT: ENTER CODE ── */}
      {view === "forgot-code" && (
        <>
          <button
            type="button"
            onClick={() => { setFpError(null); setView("forgot-email"); }}
            className="mb-4 flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          >
            ← Буцах
          </button>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
            Кодоо оруулна уу
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            <span className="font-medium text-[var(--color-text)]">{fpEmail}</span>
            {" "}хаяг руу 6 оронтой код илгээлээ. 10 минутын дотор хүчинтэй.
          </p>

          <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
                Нэг удаагийн код
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={fpCode}
                onChange={(e) => setFpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 text-center text-2xl font-bold tracking-[0.25em] text-[var(--color-text)] placeholder:text-[var(--color-muted)]/40 focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
              />
            </div>

            {fpError ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {fpError}
              </div>
            ) : null}

            <button
              type="submit"
              className="btn-shine w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
            >
              Баталгаажуулах
            </button>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={fpLoading}
              className="w-full text-center text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              Код ирээгүй юу? Дахин илгээх
            </button>
          </form>
        </>
      )}

      {/* ── FORGOT: NEW PASSWORD ── */}
      {view === "forgot-reset" && (
        <>
          <button
            type="button"
            onClick={() => { setFpError(null); setView("forgot-code"); }}
            className="mb-4 flex items-center gap-1.5 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
          >
            ← Буцах
          </button>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
            Шинэ нууц үг
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Хамгийн багадаа 6 тэмдэгт байх ёстой.
          </p>

          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs text-[var(--color-muted)]">
                Шинэ нууц үг
              </label>
              <div className="relative">
                <input
                  type={fpShowPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  placeholder="Хамгийн багадаа 6 тэмдэгт"
                  className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 pr-11 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
                />
                <button
                  type="button"
                  onClick={() => setFpShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                  tabIndex={-1}
                >
                  <EyeIcon open={fpShowPassword} />
                </button>
              </div>
            </div>

            {fpError ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {fpError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={fpLoading}
              className="btn-shine w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] disabled:opacity-60"
            >
              {fpLoading ? "Хадгалж байна..." : "Нууц үг шинэчлэх"}
            </button>
          </form>
        </>
      )}

      {/* ── FORGOT: SUCCESS ── */}
      {view === "forgot-success" && (
        <div className="py-4 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(62,207,142,0.12)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3ECF8E"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-[var(--color-text)]">
            Амжилттай!
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Нууц үг амжилттай шинэчлэгдлээ. Одоо шинэ нууц үгээрээ нэвтэрч болно.
          </p>
          <button
            type="button"
            onClick={resetForgotFlow}
            className="btn-shine mt-6 w-full rounded-xl bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
          >
            Нэвтрэх
          </button>
        </div>
      )}
    </div>
  );
}

export default function SignInPage() {
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
              Жолоочтой түрээс
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-[-0.05em] sm:text-5xl">
              Аяллаа
              <br />
              <span className="text-[var(--color-gold)]">хялбар</span>
              <br />
              болгоорой
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              Баталгаажсан жолооч, найдвартай машинтай хамт Монголын бүх
              чиглэлд аялаарай.
            </p>
            <div className="mt-8 space-y-3 text-sm text-[var(--color-muted)]">
              <div>• 1-7 хоногийн уян хатан захиалга</div>
              <div>• Баталгаажсан жолооч, даатгалтай машин</div>
              <div>• Аялал дуусмагц төлбөр</div>
              <div>• Дотоодын 50+ чиглэл</div>
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
            <SignInForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
