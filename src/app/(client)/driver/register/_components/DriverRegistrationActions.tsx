import type { StepId } from "./driver-registration-types";

type DriverRegistrationActionsProps = {
  activeStep: StepId;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
};

export const DriverRegistrationActions = ({
  activeStep,
  isSubmitting,
  onBack,
  onNext,
}: DriverRegistrationActionsProps) => {
  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-xl border border-white/8 px-6 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)] sm:w-auto"
        >
          ← Буцах
        </button>
        <button
          type="button"
          className="text-sm text-[var(--color-muted)] underline underline-offset-4 transition hover:text-[var(--color-gold)] sm:text-left"
        >
          Ноорог хадгалах
        </button>
      </div>

      <button
        type={activeStep === 3 ? "submit" : "button"}
        onClick={activeStep === 3 ? undefined : onNext}
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[var(--color-gold)] px-8 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)] sm:w-auto"
      >
        {activeStep === 3
          ? isSubmitting
            ? "Илгээж байна..."
            : "Хүсэлт илгээх →"
          : "Дараагийн алхам →"}
      </button>
    </div>
  );
};
