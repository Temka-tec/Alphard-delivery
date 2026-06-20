import Link from "next/link";

import { getCurrentViewer } from "@/lib/current-viewer";
import { DriverRegistrationDialog } from "./DriverRegistrationDialog";
import { stats } from "./landing-data";

export const HeroSection = async () => {
  const viewer = await getCurrentViewer();
  const canApplyAsDriver =
    viewer.isSignedIn &&
    !viewer.isAdmin &&
    !viewer.isDriver &&
    !viewer.hasDriverApplication;

  return (
    <section className="relative overflow-hidden border-b border-[var(--color-text)]/8 bg-[linear-gradient(135deg,var(--color-bg)_0%,var(--color-panel)_50%,var(--color-bg)_100%)] px-3 py-12 sm:px-6 lg:px-10 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,168,76,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.1)] px-4 py-1.5 text-[11px] tracking-[0.04em] text-[var(--color-gold)] sm:text-xs">
          <span aria-hidden="true">🚗</span>
          <span className="truncate">Жолоочтой түрээслэл · 1-7 хоног</span>
        </div>

        <h1 className="font-display text-4xl font-extrabold leading-none tracking-[-0.08em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
          Таны аяллыг
          <br />
          <span className="text-[var(--color-gold)]">тав тухтай</span> болгоно
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">
          Туршлагатай жолоочтой машин түрээслэж, хотоос хөдөөд хүртэл
          аялаарай. Захиалга хялбар, аюулгүй, найдвартай.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3">
          {viewer.isAdmin ? (
            <Link
              href="/admin/driver-applications"
              className="rounded-xl border border-[rgba(201,168,76,0.4)] px-3 py-3 text-center text-xs font-medium text-[var(--color-gold)] transition hover:-translate-y-0.5 hover:bg-[rgba(201,168,76,0.08)] sm:px-6 sm:py-4 sm:text-sm"
            >
              Админ хэсэг рүү
            </Link>
          ) : null}
          <Link
            href="/booking"
            className="rounded-xl bg-[var(--color-gold)] px-3 py-3 text-center text-xs font-medium text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)] sm:px-6 sm:py-4 sm:text-sm"
          >
            Машин захиалах →
          </Link>
          {viewer.isDriver ? (
            <Link
              href="/driver/profile"
              className="rounded-xl border border-white/15 px-3 py-3 text-center text-xs font-medium text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)] sm:px-6 sm:py-4 sm:text-sm"
            >
              Жолоочийн профайл
            </Link>
          ) : viewer.hasDriverApplication ? (
            <Link
              href="/driver/dashboard"
              className="rounded-xl border border-white/15 px-3 py-3 text-center text-xs font-medium text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)] sm:px-6 sm:py-4 sm:text-sm"
            >
              Хүсэлтийн төлөв
            </Link>
          ) : canApplyAsDriver ? (
            <DriverRegistrationDialog
              label="Жолоочийн хүсэлт өгөх"
              className="rounded-xl border border-white/15 px-3 py-3 text-center text-xs font-medium text-[var(--color-text)] transition hover:border-[rgba(201,168,76,0.4)] hover:text-[var(--color-gold)] sm:px-6 sm:py-4 sm:text-sm"
              isSignedIn={viewer.isSignedIn}
            />
          ) : null}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/8 pt-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold text-[var(--color-gold)] sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] text-[var(--color-muted)] sm:text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
