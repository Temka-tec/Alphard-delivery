"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DriverRegistrationDialogProps = {
  className: string;
  label: string;
  isSignedIn: boolean;
};

export const DriverRegistrationDialog = ({
  className,
  label,
  isSignedIn,
}: DriverRegistrationDialogProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const driverRedirectUrl = "/driver/register";

  const handleTriggerClick = () => {
    if (isSignedIn) {
      router.push("/driver/register");
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <button type="button" onClick={handleTriggerClick} className={className}>
        {label}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 py-3 sm:items-center sm:px-4 sm:py-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="driver-registration-dialog-title"
        >
          <div className="max-h-[90svh] w-full max-w-md overflow-y-auto rounded-t-[28px] border border-white/10 bg-[linear-gradient(180deg,var(--color-surface),var(--color-panel))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:rounded-[28px] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
                  Жолоочийн хүсэлт
                </div>
                <h2
                  id="driver-registration-dialog-title"
                  className="mt-3 font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)] sm:mt-4 sm:text-2xl"
                >
                  Эхлээд хэрэглэгчээр нэвтэрч үргэлжлүүлнэ
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                aria-label="Хаах"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] sm:mt-4">
              Жолоочийн хүсэлт гаргахын өмнө хэрэглэгчийн бүртгэлтэй байх
              шаардлагатай. Доорх сонголтоос нэгийг хийгээд шууд хүсэлтийн форм
              руу орно.
            </p>

            <div className="mt-5 grid gap-3 sm:mt-6">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/sign-up?redirect_url=${encodeURIComponent(driverRedirectUrl)}`,
                  )
                }
                className="w-full rounded-xl bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
              >
                Бүртгүүлээд үргэлжлүүлэх
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/sign-in?redirect_url=${encodeURIComponent(driverRedirectUrl)}`,
                  )
                }
                className="w-full rounded-xl border border-[rgba(201,168,76,0.3)] px-5 py-3 text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
              >
                Нэвтрээд үргэлжлүүлэх
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
