import type { StepId } from "./driver-registration-types";
import { stepTabs } from "./driver-registration-types";

type DriverRegistrationTabsProps = {
  activeStep: StepId;
  onSelect: (step: StepId) => void;
};

export const DriverRegistrationTabs = ({
  activeStep,
  onSelect,
}: DriverRegistrationTabsProps) => {
  return (
    <div className="mb-8 grid grid-cols-3 gap-1 rounded-xl border border-white/8 bg-[var(--color-surface)] p-1">
      {stepTabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`rounded-lg px-2 py-2 text-[11px] leading-tight transition sm:px-4 sm:py-2.5 sm:text-sm ${
            activeStep === tab.id
              ? "border border-white/8 bg-[var(--color-panel)] text-[var(--color-text)]"
              : "text-[var(--color-muted)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
