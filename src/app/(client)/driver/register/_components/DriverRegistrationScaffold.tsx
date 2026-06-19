import Link from "next/link";

import type { StepId } from "./driver-registration-types";

type DriverRegistrationScaffoldProps = {
  activeStep: StepId;
  children: React.ReactNode;
};

export const DriverRegistrationScaffold = ({
  activeStep,
  children,
}: DriverRegistrationScaffoldProps) => {
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-2xl font-extrabold tracking-[-0.04em]"
        >
          ALPHARD<span className="text-[var(--color-gold)]">.</span>
        </Link>
        <Link
          href="/"
          className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
        >
          ← Нүүр рүү буцах
        </Link>
      </div>

      <div className="mb-12 grid grid-cols-4 gap-1.5 sm:gap-3">
        {[
          { label: "Хэрэглэгч", status: "done", mark: "✓" },
          {
            label: "Жолооч",
            status:
              activeStep === 1 ? "active" : activeStep > 1 ? "done" : "idle",
            mark: activeStep > 1 ? "✓" : "2",
          },
          {
            label: "Баримт",
            status:
              activeStep === 2 ? "active" : activeStep > 2 ? "done" : "idle",
            mark: activeStep > 2 ? "✓" : "3",
          },
          {
            label: "Илгээх",
            status: activeStep === 3 ? "active" : "idle",
            mark: "4",
          },
        ].map((step, index) => (
          <div key={step.label} className="relative flex flex-col items-center">
            {index < 3 ? (
              <div
                className={`absolute left-1/2 top-[18px] h-px w-full ${
                  step.status === "done"
                    ? "bg-[var(--color-gold-dark)]"
                    : "bg-white/8"
                }`}
              />
            ) : null}
            <div
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold sm:h-9 sm:w-9 sm:text-sm ${
                step.status === "done"
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-ink)]"
                  : step.status === "active"
                    ? "border-[var(--color-gold)] text-[var(--color-gold)] shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
                    : "border-white/8 bg-[var(--color-surface)] text-[var(--color-muted)]"
              }`}
            >
              {step.mark}
            </div>
            <span
              className={`mt-1.5 text-center text-[10px] sm:mt-2 sm:text-[11px] ${
                step.status === "active"
                  ? "text-[var(--color-gold)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
          <span>👨‍✈️</span>
          <span>Алхам {activeStep + 1} / 4</span>
        </div>
        <h1 className="font-display text-4xl font-extrabold tracking-[-0.04em]">
          {activeStep === 1
            ? "Жолоочийн "
            : activeStep === 2
              ? "Баримт "
              : "Машины "}
          <span className="text-[var(--color-gold)]">
            {activeStep === 1
              ? "мэдээлэл"
              : activeStep === 2
                ? "бичиг"
                : "мэдээлэл"}
          </span>
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
          Та доорх мэдээллийг үнэн зөв бөглөнө үү. Хүсэлт батлагдсаны дараа л
          жолоочийн эрх идэвхжинэ.
        </p>
      </div>

      {children}
    </>
  );
};
