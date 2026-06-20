"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isDriverApplicationUploadUrl } from "@/lib/driver-application-assets";

type GalleryImage = {
  key: string;
  label: string;
  value: string;
};

type AdminApplicationGalleryProps = {
  carMake: string;
  carModel: string;
  driverName: string;
  driverPhone: string;
  images: GalleryImage[];
};

const isStoredImagePath = (value: string | null | undefined) =>
  isDriverApplicationUploadUrl(value);

export const AdminApplicationGallery = ({
  carMake,
  carModel,
  driverName,
  driverPhone,
  images,
}: AdminApplicationGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (images.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? 0 : (current - 1 + images.length) % images.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  const openImage = (index: number) => {
    if (!isStoredImagePath(images[index]?.value)) {
      return;
    }

    setActiveIndex(index);
  };

  const moveImage = (direction: "prev" | "next") => {
    if (images.length <= 1 || activeIndex === null) {
      return;
    }

    setActiveIndex(
      direction === "next"
        ? (activeIndex + 1) % images.length
        : (activeIndex - 1 + images.length) % images.length,
    );
  };

  const activeImage =
    activeIndex === null ? null : (images[activeIndex] ?? null);
  const coverImage = images[0] ?? null;
  const coverImageIsStored = isStoredImagePath(coverImage?.value);

  return (
    <>
      <div className="rounded-[24px] border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(145deg,rgba(201,168,76,0.14),rgba(255,255,255,0.02))] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-[var(--color-gold)]">
              Машины зургууд
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.04em]">
              {carMake} {carModel}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Зураг дээр дарвал томруулж үзэх ба суман товчоор дараагийн зураг
              руу шилжинэ.
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-[var(--color-muted)]">
            {images.length} зураг
          </div>
        </div>

        <button
          type="button"
          onClick={() => openImage(0)}
          disabled={!coverImageIsStored}
          className="mt-5 block w-full overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(201,168,76,0.16),rgba(10,10,15,0.8))] text-left transition enabled:cursor-zoom-in enabled:hover:border-[rgba(201,168,76,0.35)] disabled:cursor-default"
        >
          {coverImage && coverImageIsStored ? (
            <div className="relative h-72 w-full">
              <Image
                src={coverImage.value}
                alt={`${carMake} ${carModel} ${coverImage.label}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="text-xs text-[var(--color-gold)]">
                  {coverImage.label}
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {carMake} {carModel}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-52 flex-col justify-between gap-6 p-6">
              <div className="text-6xl leading-none">🚘</div>
              <div>
                <div className="text-xs text-[var(--color-gold)]">
                  {coverImage?.label || "Машины үндсэн зураг"}
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {coverImage?.value || "Зураг оруулаагүй"}
                </div>
                <div className="mt-2 text-sm text-[var(--color-muted)]">
                  {coverImage
                    ? "Энэ бичлэг хуучин filename хадгалсан тул preview гарахгүй байна. Шинэ upload-ууд зураг болж харагдана."
                    : "Энэ хүсэлт дээр машинтай холбоотой зураг хавсаргагдаагүй байна."}
                </div>
              </div>
            </div>
          )}
        </button>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              key: "carFrontName",
              label: "Урд зураг",
              value:
                images.find((image) => image.key === "carFrontName")?.value ||
                null,
              icon: "↗",
            },
            {
              key: "carBackName",
              label: "Ар зураг",
              value:
                images.find((image) => image.key === "carBackName")?.value ||
                null,
              icon: "↘",
            },
            {
              key: "carInteriorName",
              label: "Дотор зураг",
              value:
                images.find((image) => image.key === "carInteriorName")
                  ?.value || null,
              icon: "▣",
            },
          ].map((item) => {
            const canPreview = isStoredImagePath(item.value);
            const previewIndex = images.findIndex(
              (image) => image.key === item.key,
            );

            return (
              <button
                key={`${carMake}-${carModel}-${item.label}`}
                type="button"
                onClick={() => {
                  if (previewIndex >= 0) {
                    openImage(previewIndex);
                  }
                }}
                disabled={!canPreview || previewIndex < 0}
                className="overflow-hidden rounded-2xl border border-white/8 bg-[var(--color-panel)] text-left transition enabled:cursor-pointer enabled:hover:border-[rgba(201,168,76,0.35)] disabled:cursor-default"
              >
                {canPreview && item.value ? (
                  <div className="relative h-40 w-full">
                    <Image
                      src={item.value}
                      alt={`${carMake} ${carModel} ${item.label}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-[linear-gradient(145deg,rgba(201,168,76,0.12),rgba(255,255,255,0.02))] text-3xl text-[var(--color-gold)]">
                    {item.icon}
                  </div>
                )}
                <div className="p-4">
                  <div className="text-xs text-[var(--color-muted)]">
                    {item.label}
                  </div>
                  <div className="mt-1 break-all text-sm font-medium">
                    {item.value || "Оруулаагүй"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
          <div className="text-xs text-[var(--color-muted)]">
            Жолоочийн мэдээлэл
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-[var(--color-muted)]">Нэр</div>
              <div className="mt-1 text-base font-semibold">{driverName}</div>
            </div>
            <div>
              <div className="text-sm text-[var(--color-muted)]">Утас</div>
              <a
                href={`tel:${driverPhone.replaceAll(" ", "")}`}
                className="mt-1 inline-block text-base font-semibold text-[var(--color-gold)] transition hover:underline"
              >
                {driverPhone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {activeImage && isStoredImagePath(activeImage.value) ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-[#090A0F] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div>
                <div className="text-xs uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  {activeImage.label}
                </div>
                <div className="mt-1 text-sm text-white/80">
                  {carMake} {carModel}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 transition hover:text-white"
              >
                Хаах
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="relative min-h-[320px] bg-black sm:min-h-[560px]">
                <Image
                  src={activeImage.value}
                  alt={`${carMake} ${carModel} ${activeImage.label}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain"
                  unoptimized
                />

                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => moveImage("prev")}
                      className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                      aria-label="Өмнөх зураг"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage("next")}
                      className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                      aria-label="Дараагийн зураг"
                    >
                      ›
                    </button>
                  </>
                ) : null}
              </div>

              <div className="border-t border-white/10 bg-[var(--color-surface)] p-5 lg:border-t-0 lg:border-l">
                <div className="text-xs text-[var(--color-muted)]">Жолооч</div>
                <div className="mt-1 text-lg font-semibold">{driverName}</div>

                <div className="mt-5 text-xs text-[var(--color-muted)]">
                  Утасны дугаар
                </div>
                <a
                  href={`tel:${driverPhone.replaceAll(" ", "")}`}
                  className="mt-1 inline-block text-base font-semibold text-[var(--color-gold)] transition hover:underline"
                >
                  {driverPhone}
                </a>

                <div className="mt-5 text-xs text-[var(--color-muted)]">
                  Зургийн дугаар
                </div>
                <div className="mt-1 text-sm font-medium">
                  {(activeIndex ?? 0) + 1} / {images.length}
                </div>

                <div className="mt-5 text-xs text-[var(--color-muted)]">
                  Тайлбар
                </div>
                <div className="mt-1 text-sm font-medium">
                  {activeImage.label}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
