"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import {
  Camera,
  Car,
  CheckCircle2,
  CreditCard,
  FileText,
  Image as PhotoIcon,
  Info,
  Send,
  User,
} from "lucide-react";

import {
  carPhotoSlots,
  documentPhotoSlots,
  personalFields,
} from "./driver-registration-data";
import {
  acceptedImageTypes,
  formatFileSize,
  mongolianRegisterLetters,
  personalFieldNames,
  sectionTitleClasses,
} from "./driver-registration-types";
import type {
  DriverRegistrationValues,
  UploadFieldName,
  UploadFiles,
} from "./driver-registration-types";

type StepSharedProps = {
  formValues: DriverRegistrationValues;
  uploadFiles: UploadFiles;
  onFieldChange: (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onUploadChange: (
    field: UploadFieldName,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
};

type PersonalStepProps = StepSharedProps & {
  onRegisterPrefixChange: (index: 0 | 1, letter: string) => void;
  onRegisterDigitsChange: (value: string) => void;
  onApplyDemo: () => void;
};

type StepProps = StepSharedProps & {
  onApplyDemo: () => void;
};

const DemoButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <div className="flex justify-start md:col-span-2 md:justify-end">
    <button
      type="button"
      onClick={onClick}
      className="btn-ripple-effect w-full rounded-full border border-[rgba(201,168,76,0.3)] px-4 py-2 text-xs font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)] sm:w-auto"
    >
      {label}
    </button>
  </div>
);

// date type-д float-label ажилладаггүй тул тусдаа label+input загвар
const DateField = ({
  id,
  label,
  required,
  value,
  onChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex flex-col gap-1.5 text-sm md:col-auto">
    <span className="text-xs font-medium text-[var(--color-muted)]">
      {label}{" "}
      {required ? <span className="text-[var(--color-gold)]">*</span> : null}
    </span>
    <input
      id={id}
      name={id}
      type="date"
      value={value}
      onChange={onChange}
      className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
    />
  </label>
);

export const PersonalInfoStep = ({
  formValues,
  uploadFiles,
  onFieldChange,
  onRegisterPrefixChange,
  onRegisterDigitsChange,
  onUploadChange,
  onApplyDemo,
}: PersonalStepProps) => {
  const registerPrefix = formValues.registerNumber.slice(0, 2).padEnd(2, "");
  const registerDigits = formValues.registerNumber
    .slice(2)
    .replace(/\D/g, "")
    .slice(0, 8);
  const [openRegisterPicker, setOpenRegisterPicker] = useState<0 | 1 | null>(
    null,
  );
  const activeRegisterPicker = openRegisterPicker ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DemoButton label="Demo мэдээлэл оруулах" onClick={onApplyDemo} />

      <div className={`${sectionTitleClasses} md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-[var(--color-gold)]">
          <User size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Хувийн мэдээлэл
        </div>
      </div>

      {personalFields.map((field) => {
        if (field.label === "Регистрийн дугаар") {
          return (
            <div
              key={field.label}
              className="flex flex-col gap-1.5 text-sm md:col-auto"
            >
              <span className="text-xs font-medium text-[var(--color-muted)]">
                {field.label}{" "}
                <span className="text-[var(--color-gold)]">*</span>
              </span>
              <div className="relative">
                <div className="grid grid-cols-[3.25rem_3.25rem_minmax(0,1fr)] gap-2 sm:grid-cols-[4.5rem_4.5rem_minmax(0,1fr)] sm:gap-3">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setOpenRegisterPicker((current) =>
                          current === index ? null : (index as 0 | 1),
                        )
                      }
                      className={`flex items-center justify-between rounded-xl border bg-[var(--color-panel)] px-3 py-3 outline-none transition ${
                        openRegisterPicker === index
                          ? "border-[rgba(201,168,76,0.45)]"
                          : "border-white/8"
                      }`}
                    >
                      <span className="text-sm font-semibold sm:text-base">
                        {registerPrefix[index] || "А"}
                      </span>
                      <span className="text-[10px] text-[var(--color-muted)] sm:text-sm">
                        ▾
                      </span>
                    </button>
                  ))}
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="12345678"
                    value={registerDigits}
                    onChange={(event) =>
                      onRegisterDigitsChange(event.target.value)
                    }
                    className="min-w-0 rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-3 text-sm outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:bg-[#22222E] sm:px-4"
                  />
                </div>

                {openRegisterPicker !== null ? (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-white/8 bg-[#191923] p-3 shadow-2xl">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
                      <span>Энэ тэмдэгтийг сонгоно уу</span>
                      <button
                        type="button"
                        onClick={() => setOpenRegisterPicker(null)}
                        className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
                      >
                        Хаах
                      </button>
                    </div>
                    <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto sm:grid-cols-8">
                      {mongolianRegisterLetters.map((letter) => (
                        <button
                          key={`${activeRegisterPicker}-${letter}`}
                          type="button"
                          onClick={() => {
                            onRegisterPrefixChange(activeRegisterPicker, letter);
                            setOpenRegisterPicker(null);
                          }}
                          className="rounded-xl border-2 border-[rgba(255,255,255,0.14)] bg-[var(--color-panel)] px-2 py-3 text-sm font-semibold transition hover:border-[rgba(201,168,76,0.55)] hover:text-[var(--color-gold)]"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <span className="text-[11px] text-[#5A5856]">
                Эхний 2 тэмдэгтийг Монгол үсгээр сонгоод, арын хэсэгт зөвхөн тоо
                оруулна.
              </span>
            </div>
          );
        }

        // type="date" бол float-label ашиглахгүй, тусдаа DateField ашиглана
        if (field.type === "date") {
          const fieldName = personalFieldNames[field.label] ?? "";
          return (
            <DateField
              key={field.label}
              id={fieldName}
              label={field.label}
              required={field.required}
              value={formValues[fieldName as keyof DriverRegistrationValues]}
              onChange={onFieldChange}
            />
          );
        }

        const fieldName = personalFieldNames[field.label] ?? "";

        return (
          <div key={field.label} className="float-label text-sm md:col-auto">
            <input
              id={fieldName}
              name={fieldName}
              type={field.type}
              placeholder=" "
              value={formValues[fieldName as keyof DriverRegistrationValues]}
              onChange={onFieldChange}
              className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition"
            />
            <label htmlFor={fieldName}>
              {field.label}
              {field.required ? (
                <span className="ml-0.5 text-[var(--color-gold)]">*</span>
              ) : null}
            </label>
            {field.hint ? (
              <p className="mt-1 text-[11px] text-[#5A5856]">{field.hint}</p>
            ) : null}
          </div>
        );
      })}

      <div className="float-label md:col-span-2">
        <input
          id="homeAddress"
          name="homeAddress"
          type="text"
          placeholder=" "
          value={formValues.homeAddress}
          onChange={onFieldChange}
          className="w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition"
        />
        <label htmlFor="homeAddress">Гэрийн хаяг</label>
      </div>

      <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-(--color-gold)">
          <Camera size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Профайл зураг
        </div>
      </div>

      <div className="md:col-span-2">
        <label
          htmlFor="profilePhoto"
          className="block cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.25)] bg-[var(--color-panel)] px-6 py-10 text-center transition hover:border-[rgba(201,168,76,0.5)] hover:bg-[#22222E]"
        >
          <div className="flex justify-center text-(--color-gold)">
            {uploadFiles.profilePhoto ? (
              <CheckCircle2 size={32} />
            ) : (
              <PhotoIcon size={32} />
            )}
          </div>
          <div className="mt-3 text-sm font-medium">
            {uploadFiles.profilePhoto
              ? uploadFiles.profilePhoto.name
              : "Өөрийн зургийг оруулах"}
          </div>
          <div className="mt-1 text-xs text-[var(--color-muted)]">
            {uploadFiles.profilePhoto
              ? `${formatFileSize(uploadFiles.profilePhoto.size)} · Хүсэлттэй хамт илгээгдэнэ`
              : "JPG, PNG, WEBP · Дээд тал 5MB · Нүүр тодорхой харагдах ёстой"}
          </div>
          <span className="mt-3 inline-block rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] px-3 py-1 text-[10px] text-[var(--color-gold)]">
            {uploadFiles.profilePhoto ? "Өөр зураг сонгох" : "Файл сонгох"}
          </span>
        </label>
        <input
          id="profilePhoto"
          type="file"
          accept={acceptedImageTypes}
          onChange={(event) => onUploadChange("profilePhoto", event)}
          className="sr-only"
        />
      </div>

      <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
        <Info size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
        <p className="leading-6 text-[var(--color-muted)]">
          <strong className="font-medium text-[var(--color-text)]">
            Анхааруулга:
          </strong>{" "}
          Хүсэлт илгээсний дараа таны бүртгэл шууд жолооч болохгүй. Эхлээд баг
          шалгаж баталгаажуулна.
        </p>
      </div>
    </div>
  );
};

export const DocumentInfoStep = ({
  formValues,
  uploadFiles,
  onFieldChange,
  onUploadChange,
  onApplyDemo,
}: StepProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DemoButton label="Demo баримт оруулах" onClick={onApplyDemo} />

      <div className={`${sectionTitleClasses} md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-(--color-gold)">
          <CreditCard size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Жолооны үнэмлэх
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Үнэмлэхийн дугаар <span className="text-[var(--color-gold)]">*</span>
        </span>
        <input
          name="licenseNumber"
          placeholder="MN-12345678"
          value={formValues.licenseNumber}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Ангилал <span className="text-[var(--color-gold)]">*</span>
        </span>
        <select
          name="licenseClass"
          value={formValues.licenseClass}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option value="">Сонгох...</option>
          <option>B ангилал</option>
          <option>C ангилал</option>
          <option>D ангилал</option>
        </select>
      </label>

      <DateField
        id="licenseIssuedAt"
        label="Олгосон огноо"
        required
        value={formValues.licenseIssuedAt}
        onChange={onFieldChange}
      />

      <DateField
        id="licenseExpiry"
        label="Дуусах огноо"
        required
        value={formValues.licenseExpiry}
        onChange={onFieldChange}
      />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Жолоодсон жил <span className="text-[var(--color-gold)]">*</span>
        </span>
        <select
          name="drivingExperience"
          value={formValues.drivingExperience}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option value="">Сонгох...</option>
          <option>1-2 жил</option>
          <option>3-5 жил</option>
          <option>6-10 жил</option>
          <option>10+ жил</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Осол гарч байсан уу?
        </span>
        <select
          name="accidentHistory"
          value={formValues.accidentHistory}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option>Үгүй</option>
          <option>Тийм (тайлбарлана)</option>
        </select>
      </label>

      <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-(--color-gold)">
          <FileText size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Үнэмлэхийн зураг
        </div>
      </div>

      <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
        {documentPhotoSlots.map((slot) => (
          <label
            htmlFor={slot.id}
            key={slot.title}
            className="cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.2)] bg-[var(--color-panel)] px-4 py-7 text-center transition hover:border-[rgba(201,168,76,0.45)] hover:bg-[#22222E] sm:py-8"
          >
            <div className="flex justify-center text-(--color-gold)">
              {uploadFiles[slot.id] ? <CheckCircle2 size={28} /> : slot.icon}
            </div>
            <div className="mt-2 text-sm font-medium">{slot.title}</div>
            <div className="mt-1 text-[11px] text-[var(--color-muted)]">
              {uploadFiles[slot.id]
                ? `${uploadFiles[slot.id]?.name} · ${formatFileSize(uploadFiles[slot.id]?.size ?? 0)}`
                : slot.subtitle}
            </div>
            <input
              id={slot.id}
              type="file"
              accept={acceptedImageTypes}
              onChange={(event) => onUploadChange(slot.id, event)}
              className="sr-only"
            />
          </label>
        ))}
      </div>

      <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
        <p className="leading-6 text-[var(--color-muted)]">
          <strong className="font-medium text-[var(--color-text)]">
            Шаардлага:
          </strong>{" "}
          Зургийн бүх текст тодорхой уншигдах ёстой. Баталгаажтал таны эрх
          жирийн хэрэглэгч хэвээр байна.
        </p>
      </div>
    </div>
  );
};

export const CarInfoStep = ({
  formValues,
  uploadFiles,
  onFieldChange,
  onUploadChange,
  onApplyDemo,
}: StepProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <DemoButton label="Demo машины мэдээлэл оруулах" onClick={onApplyDemo} />

      <div className={`${sectionTitleClasses} md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-(--color-gold)">
          <Car size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Машины мэдээлэл
        </div>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Машины марк <span className="text-[var(--color-gold)]">*</span>
        </span>
        <select
          name="carMake"
          value={formValues.carMake}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option value="">Сонгох...</option>
          <option>Toyota</option>
          <option>Lexus</option>
          <option>Hyundai</option>
          <option>Kia</option>
          <option>Mitsubishi</option>
          <option>Benz</option>
          <option>BMW</option>
          <option>Бусад</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Загвар <span className="text-[var(--color-gold)]">*</span>
        </span>
        <input
          name="carModel"
          placeholder="Alphard, Hiace, Prius..."
          value={formValues.carModel}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Он <span className="text-[var(--color-gold)]">*</span>
        </span>
        <select
          name="carYear"
          value={formValues.carYear}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option value="">Сонгох...</option>
          {[
            2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014,
            2013,
          ].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Өнгө
        </span>
        <input
          name="carColor"
          placeholder="Цагаан, Хар, Мөнгөлөг..."
          value={formValues.carColor}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Улсын дугаар <span className="text-[var(--color-gold)]">*</span>
        </span>
        <input
          name="plateNumber"
          placeholder="1234 УНА"
          value={formValues.plateNumber}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Суудлын тоо <span className="text-[var(--color-gold)]">*</span>
        </span>
        <select
          name="seatCount"
          value={formValues.seatCount}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option>4</option>
          <option>5</option>
          <option>7</option>
          <option>8</option>
          <option>10+</option>
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Өдрийн үнэ (₮) <span className="text-[var(--color-gold)]">*</span>
        </span>
        <input
          name="dailyRate"
          type="number"
          min="0"
          placeholder="180000"
          value={formValues.dailyRate}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Хурдны хайрцаг
        </span>
        <select
          name="transmission"
          value={formValues.transmission}
          onChange={onFieldChange}
          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none"
        >
          <option>Автомат</option>
          <option>Механик</option>
        </select>
      </label>

      <div className={`${sectionTitleClasses} mt-4 md:col-span-2`}>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-(--color-gold)">
          <Camera size={14} />
        </div>
        <div className="font-display text-sm font-bold text-[var(--color-gold)]">
          Машины зургууд
        </div>
      </div>

      <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
        {carPhotoSlots.map((slot) => (
          <label
            htmlFor={slot.id}
            key={slot.title}
            className="cursor-pointer rounded-[16px] border border-dashed border-[rgba(201,168,76,0.2)] bg-[var(--color-panel)] px-4 py-7 text-center transition hover:border-[rgba(201,168,76,0.45)] hover:bg-[#22222E] sm:py-8"
          >
            <div className="flex justify-center text-(--color-gold)">
              {uploadFiles[slot.id] ? <CheckCircle2 size={28} /> : slot.icon}
            </div>
            <div className="mt-2 text-sm font-medium">{slot.title}</div>
            <div className="mt-1 text-[11px] text-[var(--color-muted)]">
              {uploadFiles[slot.id]
                ? `${uploadFiles[slot.id]?.name} · ${formatFileSize(uploadFiles[slot.id]?.size ?? 0)}`
                : slot.subtitle}
            </div>
            <input
              id={slot.id}
              type="file"
              accept={acceptedImageTypes}
              onChange={(event) => onUploadChange(slot.id, event)}
              className="sr-only"
            />
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-1.5 md:col-span-2">
        <span className="text-xs font-medium text-[var(--color-muted)]">
          Нэмэлт тайлбар
        </span>
        <textarea
          name="carNotes"
          placeholder="Машины онцлог, тоноглол, нэмэлт мэдээлэл..."
          value={formValues.carNotes}
          onChange={onFieldChange}
          className="min-h-24 rounded-xl border border-white/8 bg-[var(--color-panel)] px-4 py-3 outline-none transition focus:border-[rgba(201,168,76,0.45)] focus:shadow-[0_0_0_3px_rgba(201,168,76,0.12)]"
        />
      </label>

      <div className="flex gap-3 rounded-[16px] border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.05)] p-4 text-sm md:col-span-2">
        <Send size={16} className="mt-0.5 shrink-0 text-(--color-gold)" />
        <p className="leading-6 text-[var(--color-muted)]">
          <strong className="font-medium text-[var(--color-text)]">
            Хүсэлт илгээсний дараа:
          </strong>{" "}
          Мэдээлэл эхлээд шалгагдана. Батлагдсаны дараа л жолоочийн dashboard
          бүрэн нээгдэнэ.
        </p>
      </div>
    </div>
  );
};
