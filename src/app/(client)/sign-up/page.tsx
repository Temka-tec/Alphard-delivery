"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Хамгийн багадаа 6 тэмдэгт"
            className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[rgba(201,168,76,0.4)]"
          />
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
          <Suspense fallback={<div className="w-full max-w-md animate-pulse rounded-[28px] border border-white/8 bg-[var(--color-surface)] p-8 h-64" />}>
            <SignUpForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
