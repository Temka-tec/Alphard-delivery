import Link from "next/link";
import { CarFront } from "lucide-react";

import { getCurrentViewer } from "@/lib/current-viewer";
import { DriverRegistrationDialog } from "./DriverRegistrationDialog";
import { driverSteps } from "./landing-data";

export const DriverCTA = async () => {
  const viewer = await getCurrentViewer();
  const canApplyAsDriver =
    viewer.isSignedIn &&
    !viewer.isAdmin &&
    !viewer.isDriver &&
    !viewer.hasDriverApplication;

  return (
    <section id="drivers" className="px-3 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 rounded-[20px] border border-[rgba(201,168,76,0.2)] bg-[linear-gradient(135deg,var(--color-surface),var(--color-panel))] p-5 sm:p-8 lg:flex-row lg:items-center lg:p-10">
          <CarFront className="text-[var(--color-gold)]" size={56} aria-hidden="true" />

          <div className="max-w-3xl">
            <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
              Жолоочоор ажиллахыг хүсч байна уу?
            </h2>
            <p className="mt-3 text-sm leading-7 text-(--color-muted) sm:text-base">
              Эхлээд хэрэглэгчээр бүртгүүлэн, дараа нь профайлаасаа жолооч болох
              хүсэлт гаргаарай.
            </p>

            <div className="mt-6 grid gap-3">
              {driverSteps.map((step) => (
                <div
                  key={step}
                  className="flex items-start gap-3 text-sm text-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-(--color-gold)" />
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {viewer.isDriver ? (
                <Link
                  href="/driver/profile"
                  className="w-full rounded-lg bg-(--color-gold) px-5 py-3 text-center text-sm font-medium text-(--color-ink) transition hover:bg-(--color-gold-light) sm:w-auto"
                >
                  Жолоочийн профайл
                </Link>
              ) : viewer.hasDriverApplication ? (
                <Link
                  href="/driver/dashboard"
                  className="w-full rounded-lg bg-(--color-gold) px-5 py-3 text-center text-sm font-medium text-(--color-ink) transition hover:bg-(--color-gold-light) sm:w-auto"
                >
                  Хүсэлтийн төлөв
                </Link>
              ) : canApplyAsDriver ? (
                <DriverRegistrationDialog
                  label="Жолоочийн хүсэлт →"
                  className="w-full rounded-lg bg-(--color-gold) px-5 py-3 text-center text-sm font-medium text-(--color-ink) transition hover:bg-(--color-gold-light) sm:w-auto"
                  isSignedIn={viewer.isSignedIn}
                />
              ) : null}
              {!viewer.isSignedIn ? (
                <Link
                  href="/sign-in"
                  className="w-full rounded-lg border border-[rgba(201,168,76,0.4)] px-5 py-3 text-center text-sm text-(--color-gold) transition hover:bg-[rgba(201,168,76,0.1)] sm:w-auto"
                >
                  Нэвтрэх
                </Link>
              ) : (
                <Link
                  href={
                    viewer.isDriver ? "/driver/profile" : "/driver/dashboard"
                  }
                  className="w-full rounded-lg border border-[rgba(201,168,76,0.25)] px-5 py-3 text-center text-sm text-(--color-muted) transition hover:border-[rgba(201,168,76,0.4)] hover:text-foreground sm:w-auto"
                >
                  {viewer.isDriver ? "Dashboard" : "Хүсэлтийн самбар"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
