"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  defaultLocationSelection,
  departureOptions,
  mongoliaLocations,
} from "@/lib/mongolia-locations";

const formatPrice = (value: number) => `₮${value.toLocaleString()}`;

type CarDetailSidebarProps = {
  car: {
    id: string;
    price: string;
    priceValue: number;
    rating: number;
    reviewCount: number;
    badge: string;
    driver: {
      id: string | null;
      name: string;
      photoUrl: string | null;
      phone: string;
    };
  };
  initialAimag: string;
  initialDestination: string;
  isOwnCar: boolean;
  userId: string | null;
};

export function CarDetailSidebar({
  car,
  initialAimag,
  initialDestination,
  isOwnCar,
  userId,
}: CarDetailSidebarProps) {
  const [selectedAimag, setSelectedAimag] = useState(initialAimag);
  const [selectedDestination, setSelectedDestination] =
    useState(initialDestination);
  const serviceFee = Math.round(car.priceValue * 0.05);
  const total = car.priceValue + serviceFee;

  return (
    <aside className="h-fit rounded-[24px] border border-white/8 bg-[var(--color-surface)]">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-display text-3xl font-bold text-[var(--color-gold)]">
              {car.price}
            </span>
            <span className="ml-1 text-sm text-[var(--color-muted)]">/ өдөр</span>
          </div>
          <div className="text-sm text-[var(--color-muted)]">
            ★ {car.rating.toFixed(1)} · {car.reviewCount}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-2xl border border-[rgba(96,165,250,0.22)] bg-[rgba(96,165,250,0.08)] p-4 text-sm leading-6 text-[var(--color-muted)]">
          <div className="mb-1 font-medium text-[#60A5FA]">Байршил</div>
          Явах цэг болон очих байршлаа жагсаалтаас сонгоод жолоочтой урьдчилан
          тохиролцоорой.
        </div>

        <div className="grid gap-3">
          <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
            Хаанаас
            <select
              value={selectedAimag}
              onChange={(event) => {
                const nextAimag = event.target.value;
                const nextLocation = mongoliaLocations.find(
                  (item) => item.aimag === nextAimag,
                );
                setSelectedAimag(nextAimag);
                setSelectedDestination(
                  nextLocation?.departures[0] ||
                    defaultLocationSelection.destination,
                );
              }}
              className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
            >
              {mongoliaLocations.map((location) => (
                <option key={location.aimag} value={location.aimag}>
                  {location.aimag}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
            Хаашаа явах
            <select
              value={selectedDestination}
              onChange={(event) => setSelectedDestination(event.target.value)}
              className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
            >
              {mongoliaLocations.map((location) => (
                <optgroup key={location.aimag} label={location.aimag}>
                  {departureOptions
                    .filter((option) => option.aimag === location.aimag)
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
            Эхлэх огноо
            <input
              type="date"
              className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
            Дуусах огноо
            <input
              type="date"
              className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
          Зорчигчийн тоо
          <select className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none">
            <option>1-2 хүн</option>
            <option>3-4 хүн</option>
            <option>5-6 хүн</option>
            <option>7+ хүн</option>
          </select>
        </label>

        <div className="rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-4 text-sm">
          <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
            <span>{formatPrice(car.priceValue)} × 1 өдөр</span>
            <span>{formatPrice(car.priceValue)}</span>
          </div>
          <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
            <span>Үйлчилгээний хөлс (5%)</span>
            <span>{formatPrice(serviceFee)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.18)] pt-2 font-medium">
            <span>Нийт</span>
            <span className="font-display text-xl text-[var(--color-gold)]">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
          <div className="mb-2 text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Дэлгэрэнгүй
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.12)]">
              {car.driver.photoUrl ? (
                <Image
                  src={car.driver.photoUrl}
                  alt={car.driver.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-[var(--color-gold)]">
                  {car.driver.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">
                Жолооч
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-[var(--color-text)]">
                {car.driver.name}
              </div>
              {car.driver.phone === "Утас удахгүй" ? (
                <div className="mt-1 text-sm text-[var(--color-muted)]">
                  {car.driver.phone}
                </div>
              ) : (
                <a
                  href={`tel:${car.driver.phone.replaceAll(" ", "")}`}
                  className="mt-1 inline-flex text-sm font-medium text-[#3ECF8E] transition hover:underline"
                >
                  {car.driver.phone}
                </a>
              )}
            </div>
            {car.driver.phone === "Утас удахгүй" ? null : (
              <a
                href={`tel:${car.driver.phone.replaceAll(" ", "")}`}
                className="shrink-0 rounded-lg border border-[rgba(62,207,142,0.35)] bg-[rgba(62,207,142,0.12)] px-3 py-2 text-sm text-[#3ECF8E]"
              >
                Залгах
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          {isOwnCar ? (
            <div className="rounded-xl border border-[rgba(248,113,113,0.22)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-center text-sm font-medium text-[#FCA5A5]">
              Өөрийн нэмсэн машиныг өөрөө захиалах боломжгүй.
            </div>
          ) : (
            <Link
              href="/booking"
              className="rounded-xl bg-[var(--color-gold)] px-4 py-3 text-center text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
            >
              Захиалга илгээх
            </Link>
          )}
          {!userId ? (
            <Link
              href="/sign-in"
              className="rounded-xl border border-[rgba(201,168,76,0.28)] px-4 py-3 text-center text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
            >
              Нэвтэрч үргэлжлүүлэх
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
