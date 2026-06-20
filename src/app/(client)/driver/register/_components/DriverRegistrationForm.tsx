"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

import { DriverRegistrationActions } from "./DriverRegistrationActions";
import { DriverRegistrationScaffold } from "./DriverRegistrationScaffold";
import {
  CarInfoStep,
  DocumentInfoStep,
  PersonalInfoStep,
} from "./DriverRegistrationStepPanels";
import { DriverRegistrationTabs } from "./DriverRegistrationTabs";
import {
  demoTextFile,
  initialFormValues,
  initialUploadFiles,
  uploadFieldLabels,
} from "./driver-registration-types";
import type {
  DriverRegistrationValues,
  StepId,
  UploadFieldName,
  UploadFiles,
} from "./driver-registration-types";

export const DriverRegistrationForm = () => {
  const [activeStep, setActiveStep] = useState<StepId>(1);
  const [formValues, setFormValues] =
    useState<DriverRegistrationValues>(initialFormValues);
  const [uploadFiles, setUploadFiles] = useState<UploadFiles>(initialUploadFiles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const applyPersonalDemo = () => {
    setSubmitError(null);
    setFormValues((current) => ({
      ...current,
      lastName: "Батболд",
      firstName: "Тэмүүлэн",
      phone: "99112233",
      email: "temuulen.driver@example.com",
      registerNumber: "УБ00112233",
      birthDate: "1994-05-12",
      homeAddress: "Улаанбаатар, Хан-Уул дүүрэг, 15-р хороо, River Garden",
    }));
    setUploadFiles((current) => ({
      ...current,
      profilePhoto: demoTextFile("demo-profile.jpg"),
    }));
  };

  const applyDocumentDemo = () => {
    setSubmitError(null);
    setFormValues((current) => ({
      ...current,
      licenseNumber: "MN-98765432",
      licenseClass: "B ангилал",
      licenseIssuedAt: "2018-04-10",
      licenseExpiry: "2028-04-10",
      drivingExperience: "6-10 жил",
      accidentHistory: "Үгүй",
    }));
    setUploadFiles((current) => ({
      ...current,
      licenseFront: demoTextFile("demo-license-front.jpg"),
      licenseBack: demoTextFile("demo-license-back.jpg"),
      licenseSelfie: demoTextFile("demo-license-selfie.jpg"),
    }));
  };

  const applyCarDemo = () => {
    setSubmitError(null);
    setFormValues((current) => ({
      ...current,
      carMake: "Toyota",
      carModel: "Alphard",
      carYear: "2022",
      carColor: "Цагаан",
      plateNumber: "1234 УНА",
      seatCount: "7",
      transmission: "Автомат",
      dailyRate: "250000",
      carNotes:
        "Арьсан салон, 2 люк, халаагууртай суудал, хот болон хөдөө чиглэлд явах боломжтой.",
    }));
    setUploadFiles((current) => ({
      ...current,
      carFront: demoTextFile("demo-car-front.jpg"),
      carBack: demoTextFile("demo-car-back.jpg"),
      carInterior: demoTextFile("demo-car-interior.jpg"),
    }));
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleRegisterPrefixChange = (index: 0 | 1, letter: string) => {
    setFormValues((current) => {
      const prefix = current.registerNumber
        .slice(0, 2)
        .padEnd(2, "")
        .split("");
      const digits = current.registerNumber.slice(2).replace(/\D/g, "").slice(0, 8);

      prefix[index] = letter;

      return {
        ...current,
        registerNumber: `${prefix.join("")}${digits}`,
      };
    });
  };

  const handleRegisterDigitsChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    setFormValues((current) => {
      const prefix = current.registerNumber.slice(0, 2);

      return {
        ...current,
        registerNumber: `${prefix}${digits}`,
      };
    });
  };

  const handleUploadChange = (
    field: UploadFieldName,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    setUploadFiles((current) => ({
      ...current,
      [field]: file,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeStep !== 3 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const missingUpload = (Object.entries(uploadFiles) as Array<
        [UploadFieldName, File | null]
      >).find(([, file]) => !file);

      if (missingUpload) {
        setSubmitError(`${uploadFieldLabels[missingUpload[0]]} дутуу байна.`);
        return;
      }

      const formData = new FormData();

      for (const [key, value] of Object.entries(formValues)) {
        formData.append(key, value);
      }

      for (const [key, file] of Object.entries(uploadFiles) as Array<
        [UploadFieldName, File]
      >) {
        formData.append(key, file);
      }

      const response = await fetch("/api/driver-applications", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        setSubmitError(message || "Хүсэлт илгээх үед алдаа гарлаа.");
        return;
      }

      router.push("/driver/dashboard?application=submitted");
    } catch {
      setSubmitError("Хүсэлт илгээх үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-5 text-[var(--color-text)] sm:px-8 sm:py-8 lg:px-10">
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl">
        <DriverRegistrationScaffold activeStep={activeStep}>
          <DriverRegistrationTabs
            activeStep={activeStep}
            onSelect={(step) => {
              setSubmitError(null);
              setActiveStep(step);
            }}
          />

          {activeStep === 1 ? (
            <PersonalInfoStep
              formValues={formValues}
              uploadFiles={uploadFiles}
              onFieldChange={handleFieldChange}
              onRegisterPrefixChange={handleRegisterPrefixChange}
              onRegisterDigitsChange={handleRegisterDigitsChange}
              onUploadChange={handleUploadChange}
              onApplyDemo={applyPersonalDemo}
            />
          ) : null}

          {activeStep === 2 ? (
            <DocumentInfoStep
              formValues={formValues}
              uploadFiles={uploadFiles}
              onFieldChange={handleFieldChange}
              onUploadChange={handleUploadChange}
              onApplyDemo={applyDocumentDemo}
            />
          ) : null}

          {activeStep === 3 ? (
            <CarInfoStep
              formValues={formValues}
              uploadFiles={uploadFiles}
              onFieldChange={handleFieldChange}
              onUploadChange={handleUploadChange}
              onApplyDemo={applyCarDemo}
            />
          ) : null}

          <DriverRegistrationActions
            activeStep={activeStep}
            isSubmitting={isSubmitting}
            onBack={() =>
              setActiveStep((current) => {
                setSubmitError(null);
                return current === 1 ? 1 : ((current - 1) as StepId);
              })
            }
            onNext={() => {
              setSubmitError(null);
              setActiveStep((current) => ((current + 1) as StepId));
            }}
          />

          {submitError ? (
            <div className="mt-4 rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-[#F87171]">
              {submitError}
            </div>
          ) : null}
        </DriverRegistrationScaffold>
      </form>
    </main>
  );
};
