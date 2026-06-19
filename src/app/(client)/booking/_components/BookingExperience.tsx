"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CarListItem } from "@/lib/car-data";
import {
  defaultLocationSelection,
  departureOptions,
  mongoliaLocations,
  parseLocationSelection,
} from "@/lib/mongolia-locations";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/toast";
import { searchDefaults } from "./booking-data";

type BookingCar = Omit<CarListItem, "price"> & {
  selected: boolean;
  premium: boolean;
  meta: string;
  features: string[];
  driver: CarListItem["driver"] & { stats: string };
  price: number;
  ratingCount: string;
};

type RecentBooking = {
  id: string;
  status: string;
  startDate: string;
  endDate: string;
  destination: string;
  notes: string;
  totalPrice: number;
  review: {
    rating: number;
    comment: string;
  } | null;
  car: {
    name: string;
    slug: string;
    heroImage: string | null;
  };
  driver: {
    name: string;
  };
};

const bookingStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  CONFIRMED: "Баталгаажсан",
  ACTIVE: "Явж байна",
  COMPLETED: "Дууссан",
  CANCELLED: "Цуцлагдсан",
};

const bookingStatusTone: Record<string, string> = {
  PENDING: "text-[#FBBF24] bg-[rgba(251,191,36,0.12)]",
  CONFIRMED: "text-[#60A5FA] bg-[rgba(96,165,250,0.12)]",
  ACTIVE: "text-[var(--color-gold)] bg-[rgba(201,168,76,0.12)]",
  COMPLETED: "text-[#3ECF8E] bg-[rgba(62,207,142,0.12)]",
  CANCELLED: "text-[#F87171] bg-[rgba(248,113,113,0.12)]",
};

const formatPrice = (value: number) => `₮${value.toLocaleString()}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const mapBookingCars = (cars: CarListItem[]): BookingCar[] =>
  cars.map((car, index) => ({
    ...car,
    meta: `${car.color} · ${car.transmission} · ${car.engine} · ${car.tags[0] ?? "Мэдээлэлгүй"}`,
    features: car.tags.map((tag) => `• ${tag}`),
    driver: {
      ...car.driver,
      stats: `${car.driver.rating} · ${car.driver.trips} аялал`,
    },
    price: car.priceValue,
    ratingCount: String(car.reviewCount),
    selected: index === 0,
    premium: car.badge !== "Сул",
  }));

const getSeatCount = (car: BookingCar) => {
  const seatTag = car.tags.find((tag) => tag.includes("суудал")) || "";
  const matched = seatTag.match(/\d+/);
  return matched ? Number(matched[0]) : 0;
};

const getSeatBucket = (car: BookingCar) => {
  const seatCount = getSeatCount(car);

  if (seatCount >= 10) {
    return "10+ суудал";
  }

  if (seatCount >= 7) {
    return "7-8 суудал";
  }

  return "4-5 суудал";
};

type FilterContentProps = {
  availableMakes: string[];
  availableSeatBuckets: string[];
  availableTransmissions: string[];
  bookingCars: BookingCar[];
  selectedMakes: string[];
  selectedSeatBuckets: string[];
  selectedTransmissions: string[];
  priceMax: number;
  toggleValue: (current: string[], next: string, update: (v: string[]) => void) => void;
  setSelectedMakes: (v: string[]) => void;
  setSelectedSeatBuckets: (v: string[]) => void;
  setSelectedTransmissions: (v: string[]) => void;
  setPriceMax: (v: number) => void;
};

const FilterContent = ({
  availableMakes,
  availableSeatBuckets,
  availableTransmissions,
  bookingCars,
  selectedMakes,
  selectedSeatBuckets,
  selectedTransmissions,
  priceMax,
  toggleValue,
  setSelectedMakes,
  setSelectedSeatBuckets,
  setSelectedTransmissions,
  setPriceMax,
}: FilterContentProps) => (
  <div className="space-y-5">
    <div>
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Марк</p>
      <div className="space-y-2.5">
        {availableMakes.map((make) => {
          const count = bookingCars.filter((car) => (car.name.split(" ")[0] || car.name) === make).length;
          return (
            <label key={make} className="flex cursor-pointer items-center gap-2">
              <input checked={selectedMakes.includes(make)} onChange={() => toggleValue(selectedMakes, make, setSelectedMakes)} type="checkbox" className="h-4 w-4 accent-[var(--color-gold)]" />
              <span className="text-sm text-[var(--color-muted)]">{make}</span>
              <span className="ml-auto rounded-full border border-white/8 bg-[var(--color-panel)] px-2 py-0.5 text-[11px] text-[#5A5856]">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
    <div className="border-t border-white/8 pt-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Суудлын тоо</p>
      <div className="space-y-2.5">
        {availableSeatBuckets.map((bucket) => {
          const count = bookingCars.filter((car) => getSeatBucket(car) === bucket).length;
          return (
            <label key={bucket} className="flex cursor-pointer items-center gap-2">
              <input checked={selectedSeatBuckets.includes(bucket)} onChange={() => toggleValue(selectedSeatBuckets, bucket, setSelectedSeatBuckets)} type="checkbox" className="h-4 w-4 accent-[var(--color-gold)]" />
              <span className="text-sm text-[var(--color-muted)]">{bucket}</span>
              <span className="ml-auto rounded-full border border-white/8 bg-[var(--color-panel)] px-2 py-0.5 text-[11px] text-[#5A5856]">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
    <div className="border-t border-white/8 pt-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Хурдны хайрцаг</p>
      <div className="space-y-2.5">
        {availableTransmissions.map((item) => {
          const count = bookingCars.filter((car) => car.transmission === item).length;
          return (
            <label key={item} className="flex cursor-pointer items-center gap-2">
              <input checked={selectedTransmissions.includes(item)} onChange={() => toggleValue(selectedTransmissions, item, setSelectedTransmissions)} type="checkbox" className="h-4 w-4 accent-[var(--color-gold)]" />
              <span className="text-sm text-[var(--color-muted)]">{item}</span>
              <span className="ml-auto rounded-full border border-white/8 bg-[var(--color-panel)] px-2 py-0.5 text-[11px] text-[#5A5856]">{count}</span>
            </label>
          );
        })}
      </div>
    </div>
    <div className="border-t border-white/8 pt-5">
      <p className="mb-3 text-[11px] uppercase tracking-[0.08em] text-[var(--color-muted)]">Өдрийн үнэ (₮)</p>
      <input type="range" min="50000" max="500000" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[var(--color-gold)]" />
      <div className="mt-1 flex justify-between text-[11px] text-[var(--color-muted)]">
        <span>₮50,000</span>
        <span>{formatPrice(priceMax)}</span>
      </div>
    </div>
  </div>
);

const buildInitialReviewDrafts = (bookings: RecentBooking[]) =>
  Object.fromEntries(
    bookings.map((booking) => [
      booking.id,
      {
        rating: booking.review?.rating ?? 5,
        comment: booking.review?.comment ?? "",
      },
    ]),
  ) as Record<string, { rating: number; comment: string }>;

export const BookingExperience = ({
  initialCars,
  initialBookings,
  viewerDisplayName,
  useDriverDisplayName,
}: {
  initialCars: CarListItem[];
  initialBookings: RecentBooking[];
  viewerDisplayName: string | null;
  useDriverDisplayName: boolean;
}) => {
  const bookingCars = useMemo(() => mapBookingCars(initialCars), [initialCars]);
  const [recentBookings, setRecentBookings] = useState(initialBookings);
  const [selectedCar, setSelectedCar] = useState<BookingCar | null>(null);
  const [priceMax, setPriceMax] = useState(searchDefaults.priceMax);
  const [searchStart, setSearchStart] = useState(searchDefaults.startDate);
  const [searchEnd, setSearchEnd] = useState(searchDefaults.endDate);
  const [routeQuery, setRouteQuery] = useState(searchDefaults.direction);
  const [seatFilter, setSeatFilter] = useState("Бүгд");
  const [sortOrder, setSortOrder] = useState("Үнэ: бага → их");
  const [selectedMakes, setSelectedMakes] = useState<string[]>([]);
  const [selectedSeatBuckets, setSelectedSeatBuckets] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    [],
  );
  const [modalStart, setModalStart] = useState(searchDefaults.startDate);
  const [modalEnd, setModalEnd] = useState(searchDefaults.endDate);
  const [selectedAimag, setSelectedAimag] = useState<string>(
    defaultLocationSelection.aimag,
  );
  const [selectedDestination, setSelectedDestination] = useState<string>(
    defaultLocationSelection.destination,
  );
  const [routeDetails, setRouteDetails] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageViewerIndex, setImageViewerIndex] = useState<number | null>(null);
  const [reviewDrafts, setReviewDrafts] = useState(
    buildInitialReviewDrafts(initialBookings),
  );
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [reviewSubmittingId, setReviewSubmittingId] = useState<string | null>(
    null,
  );

  const availableMakes = Array.from(
    new Set(bookingCars.map((car) => car.name.split(" ")[0] || car.name)),
  );
  const availableSeatBuckets = ["4-5 суудал", "7-8 суудал", "10+ суудал"];
  const availableTransmissions = Array.from(
    new Set(bookingCars.map((car) => car.transmission)),
  );

  const filteredCars = useMemo(() => {
    const normalizedQuery = routeQuery.trim().toLowerCase();
    const nextCars = bookingCars.filter((car) => {
      const matchesMake =
        selectedMakes.length === 0 ||
        selectedMakes.includes(car.name.split(" ")[0] || car.name);
      const matchesSeatBucket =
        selectedSeatBuckets.length === 0 ||
        selectedSeatBuckets.includes(getSeatBucket(car));
      const matchesTransmission =
        selectedTransmissions.length === 0 ||
        selectedTransmissions.includes(car.transmission);
      const matchesSeatSelect =
        seatFilter === "Бүгд" || getSeatBucket(car) === seatFilter;
      const matchesPrice = car.price <= priceMax;
      const haystack = [car.name, car.location, car.meta, ...car.tags]
        .join(" ")
        .toLowerCase();
      const matchesRoute =
        !normalizedQuery || haystack.includes(normalizedQuery);

      return (
        matchesMake &&
        matchesSeatBucket &&
        matchesTransmission &&
        matchesSeatSelect &&
        matchesPrice &&
        matchesRoute
      );
    });

    return nextCars.sort((left, right) => {
      if (sortOrder === "Үнэ: их → бага") {
        return right.price - left.price;
      }

      if (sortOrder === "Үнэлгээгээр") {
        return right.rating - left.rating;
      }

      if (sortOrder === "Шинэ нэмэгдсэн") {
        return right.year.localeCompare(left.year);
      }

      return left.price - right.price;
    });
  }, [
    bookingCars,
    priceMax,
    routeQuery,
    seatFilter,
    selectedMakes,
    selectedSeatBuckets,
    selectedTransmissions,
    sortOrder,
  ]);

  const activeCar = selectedCar ?? filteredCars[0] ?? bookingCars[0] ?? null;
  const activeCarImages = selectedCar?.photos.length
    ? selectedCar.photos
    : selectedCar?.heroImage
      ? [selectedCar.heroImage]
      : [];
  const activeViewerImage =
    imageViewerIndex === null
      ? null
      : (activeCarImages[imageViewerIndex] ?? null);
  const displayName = viewerDisplayName || "Хэрэглэгч";

  useEffect(() => {
    if (imageViewerIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImageViewerIndex(null);
      }

      if (activeCarImages.length <= 1) {
        return;
      }

      if (event.key === "ArrowRight") {
        setImageViewerIndex((current) =>
          current === null ? 0 : (current + 1) % activeCarImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setImageViewerIndex((current) =>
          current === null
            ? 0
            : (current - 1 + activeCarImages.length) % activeCarImages.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeCarImages.length, imageViewerIndex]);

  if (!activeCar) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="font-display text-3xl font-bold">Сул машин алга</h1>
          <p className="mt-3 text-sm text-[var(--color-muted)]">
            Одоогоор захиалах боломжтой машин бүртгэгдээгүй байна.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)]"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>
      </main>
    );
  }

  const startDate = new Date(modalStart);
  const endDate = new Date(modalEnd);
  const diffDays = Math.round(
    (endDate.getTime() - startDate.getTime()) / 86400000,
  );
  const bookingDays = Number.isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  const subtotal = activeCar.price * bookingDays;
  const serviceFee = Math.round(subtotal * 0.05);
  const total = subtotal + serviceFee;

  const toggleValue = (
    currentValues: string[],
    nextValue: string,
    update: (value: string[]) => void,
  ) => {
    update(
      currentValues.includes(nextValue)
        ? currentValues.filter((value) => value !== nextValue)
        : [...currentValues, nextValue],
    );
  };

  const resetFilters = () => {
    setPriceMax(searchDefaults.priceMax);
    setSearchStart(searchDefaults.startDate);
    setSearchEnd(searchDefaults.endDate);
    setRouteQuery(searchDefaults.direction);
    setSeatFilter("Бүгд");
    setSortOrder("Үнэ: бага → их");
    setSelectedMakes([]);
    setSelectedSeatBuckets([]);
    setSelectedTransmissions([]);
  };

  const openBooking = (car: BookingCar) => {
    const parsedLocation = parseLocationSelection(routeQuery || car.location);

    setSelectedCar(car);
    setModalStart(searchStart);
    setModalEnd(searchEnd);
    setSelectedAimag(parsedLocation.aimag);
    setSelectedDestination(parsedLocation.destination);
    setRouteDetails("");
    setSuccess(false);
    setBookingCode("");
    setBookingError(null);
  };

  const closeBooking = () => {
    setSelectedCar(null);
    setImageViewerIndex(null);
    setSuccess(false);
    setBookingCode("");
    setBookingError(null);
    setIsSubmitting(false);
    setModalStart(searchStart);
    setModalEnd(searchEnd);
    setSelectedAimag(defaultLocationSelection.aimag);
    setSelectedDestination(defaultLocationSelection.destination);
    setRouteDetails("");
  };

  const submitBooking = async () => {
    if (!selectedCar || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carId: selectedCar.id,
          startDate: modalStart,
          endDate: modalEnd,
          destination: selectedDestination,
          notes: routeDetails,
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        setBookingError(message || "Захиалга илгээх үед алдаа гарлаа.");
        toast.error(message || "Захиалга илгээх үед алдаа гарлаа.");
        return;
      }

      const data = (await response.json()) as { bookingCode?: string };
      setBookingCode(data.bookingCode || "");
      setSuccess(true);
      toast.success("Захиалга амжилттай илгээгдлээ!");
    } catch {
      setBookingError("Захиалга илгээх үед алдаа гарлаа. Дахин оролдоно уу.");
      toast.error("Захиалга илгээх үед алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitReview = async (bookingId: string) => {
    const draft = reviewDrafts[bookingId];

    if (!draft || reviewSubmittingId) {
      return;
    }

    setReviewSubmittingId(bookingId);
    setReviewError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      if (!response.ok) {
        const message = await response.text();
        setReviewError(message || "Сэтгэгдэл хадгалах үед алдаа гарлаа.");
        toast.error(message || "Сэтгэгдэл хадгалах үед алдаа гарлаа.");
        return;
      }

      setRecentBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                review: {
                  rating: draft.rating,
                  comment: draft.comment,
                },
              }
            : booking,
        ),
      );
      toast.success("Сэтгэгдэл амжилттай хадгалагдлаа!");
    } catch {
      setReviewError("Сэтгэгдэл хадгалах үед алдаа гарлаа.");
      toast.error("Сэтгэгдэл хадгалах үед алдаа гарлаа.");
    } finally {
      setReviewSubmittingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-white/8 px-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-white/8 px-4 py-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              ← Нүүр хуудас
            </Link>
            <Link
              href="/"
              className="font-display text-2xl font-extrabold tracking-[-0.04em]"
            >
              ALPHARD<span className="text-[var(--color-gold)]">.</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <ThemeToggle />
            <span className="text-sm text-[var(--color-muted)]">
              Сайн байна уу, {displayName}
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] text-sm font-semibold text-[var(--color-gold)]">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
          </div>
        </header>

        <section className="border-b border-white/8 bg-[var(--color-surface)] px-2 py-6 sm:px-4">
          <p className="mb-3 text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
            Машин хайх
          </p>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.2fr_1fr_auto] lg:items-end">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Эхлэх огноо
              </span>
              <input
                type="date"
                value={searchStart}
                onChange={(event) => setSearchStart(event.target.value)}
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Дуусах огноо
              </span>
              <input
                type="date"
                value={searchEnd}
                onChange={(event) => setSearchEnd(event.target.value)}
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Чиглэл / байршил
              </span>
              <input
                value={routeQuery}
                onChange={(event) => setRouteQuery(event.target.value)}
                type="text"
                placeholder="Жишээ: Хоргын тогоо, Хатгал, Дархан..."
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-[var(--color-muted)]">
                Суудлын тоо
              </span>
              <select
                value={seatFilter}
                onChange={(event) => setSeatFilter(event.target.value)}
                className="rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none transition focus:border-[rgba(201,168,76,0.25)]"
              >
                <option>Бүгд</option>
                {availableSeatBuckets.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="h-11 rounded-lg bg-[var(--color-gold)] px-6 text-sm font-medium text-[var(--color-ink)]"
            >
              {filteredCars.length} машин
            </button>
          </div>
        </section>

        <section className="grid min-h-[680px] lg:grid-cols-[280px_1fr]">
          {/* Mobile filter toggle bar */}
          <div className="flex items-center justify-between border-b border-white/8 bg-[var(--color-surface)] px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[var(--color-panel)] px-3 py-2 text-sm text-[var(--color-text)]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
              Шүүлт
              {(selectedMakes.length + selectedSeatBuckets.length + selectedTransmissions.length) > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-gold)] text-[10px] font-bold text-[var(--color-ink)]">
                  {selectedMakes.length + selectedSeatBuckets.length + selectedTransmissions.length}
                </span>
              )}
            </button>
            <span className="text-xs text-[var(--color-muted)]">{filteredCars.length} машин</span>
          </div>

          {/* Mobile filter drawer overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <div
                className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-[24px] border-t border-white/8 bg-[var(--color-surface)] p-5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-1 flex justify-center"><div className="h-1 w-10 rounded-full bg-white/20" /></div>
                <div className="mb-5 mt-3 flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold">Шүүлт</h2>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={resetFilters} className="text-xs text-[var(--color-gold)]">Цэвэрлэх</button>
                    <button type="button" onClick={() => setMobileFiltersOpen(false)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[var(--color-muted)]">Хаах</button>
                  </div>
                </div>
                <FilterContent
                  availableMakes={availableMakes}
                  availableSeatBuckets={availableSeatBuckets}
                  availableTransmissions={availableTransmissions}
                  bookingCars={bookingCars}
                  selectedMakes={selectedMakes}
                  selectedSeatBuckets={selectedSeatBuckets}
                  selectedTransmissions={selectedTransmissions}
                  priceMax={priceMax}
                  toggleValue={toggleValue}
                  setSelectedMakes={setSelectedMakes}
                  setSelectedSeatBuckets={setSelectedSeatBuckets}
                  setSelectedTransmissions={setSelectedTransmissions}
                  setPriceMax={setPriceMax}
                />
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="mt-5 w-full rounded-xl bg-[var(--color-gold)] py-3 text-sm font-medium text-[var(--color-ink)]"
                >
                  {filteredCars.length} машин харах
                </button>
              </div>
            </div>
          )}

          <aside className="hidden border-r border-white/8 bg-[var(--color-surface)] p-6 lg:block">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold">Шүүлт</h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[var(--color-gold)]"
              >
                Цэвэрлэх
              </button>
            </div>

            <FilterContent
              availableMakes={availableMakes}
              availableSeatBuckets={availableSeatBuckets}
              availableTransmissions={availableTransmissions}
              bookingCars={bookingCars}
              selectedMakes={selectedMakes}
              selectedSeatBuckets={selectedSeatBuckets}
              selectedTransmissions={selectedTransmissions}
              priceMax={priceMax}
              toggleValue={toggleValue}
              setSelectedMakes={setSelectedMakes}
              setSelectedSeatBuckets={setSelectedSeatBuckets}
              setSelectedTransmissions={setSelectedTransmissions}
              setPriceMax={setPriceMax}
            />
          </aside>

          <div className="p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-muted)]">
                <strong className="font-medium text-[var(--color-text)]">
                  {filteredCars.length}
                </strong>{" "}
                машин олдлоо
                {searchStart && searchEnd
                  ? ` · ${searchStart} → ${searchEnd}`
                  : ""}
              </p>
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-fit rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2 text-xs text-[var(--color-muted)] outline-none"
              >
                <option>Үнэ: бага → их</option>
                <option>Үнэ: их → бага</option>
                <option>Үнэлгээгээр</option>
                <option>Шинэ нэмэгдсэн</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredCars.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--color-panel)] p-8 text-sm text-[var(--color-muted)]">
                  Энэ шүүлтээр машин олдсонгүй. Шүүлтээ багасгаад дахин оролдоно
                  уу.
                </div>
              ) : null}

              {filteredCars.map((car) => {
                const isSelected = selectedCar
                  ? selectedCar.id === car.id
                  : car.selected;

                return (
                  <article
                    key={car.id}
                    className={`grid items-start overflow-hidden rounded-2xl border bg-[var(--color-panel)] transition hover:-translate-y-0.5 hover:border-[rgba(201,168,76,0.25)] xl:grid-cols-[220px_1fr_180px] ${
                      isSelected
                        ? "border-[var(--color-gold)] bg-[rgba(201,168,76,0.04)]"
                        : "border-white/8"
                    }`}
                  >
                    <div className="relative flex min-h-36 items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--color-panel),#1E1E2C)] text-6xl sm:min-h-44">
                      {car.heroImage ? (
                        <Image
                          src={car.heroImage}
                          alt={car.name}
                          fill
                          sizes="(max-width: 1280px) 100vw, 220px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        car.icon
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                      <div
                        className={`absolute left-3 top-3 rounded-md border px-2 py-1 text-[10px] ${
                          car.premium
                            ? "border-[rgba(180,140,255,0.35)] bg-[rgba(100,60,200,0.2)] text-[#BB99FF]"
                            : "border-[rgba(45,200,100,0.3)] bg-[rgba(45,106,79,0.25)] text-[#5DE89A]"
                        }`}
                      >
                        {car.badge}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-5">
                      <div>
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <h3 className="font-display text-lg font-bold">
                            {car.name}
                          </h3>
                          <span className="rounded-md border border-white/8 bg-[#22222E] px-2 py-1 text-[11px] text-[var(--color-muted)]">
                            {car.year}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--color-muted)]">
                          {car.meta}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {car.features.map((feature) => (
                            <span
                              key={feature}
                              className="rounded-md border border-white/8 bg-white/4 px-2 py-1 text-[11px] text-[var(--color-muted)]"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] text-[10px] font-semibold text-[var(--color-gold)]">
                          {car.driver.initial}
                        </div>
                        <div className="text-xs">
                          <strong className="block text-sm font-medium text-[var(--color-text)]">
                            {car.driver.name}
                          </strong>
                          <span className="text-[var(--color-muted)]">
                            {car.driver.stats}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between border-t border-white/8 p-4 xl:border-l xl:border-t-0 xl:p-5">
                      {/* Mobile: price + buttons in one compact row */}
                      <div className="flex items-center justify-between gap-3 xl:block">
                        <div>
                          <div className="flex items-center gap-1 text-xs xl:justify-end">
                            <span className="text-[var(--color-gold)]">★</span>
                            <span className="font-medium">{car.rating.toFixed(1)}</span>
                            <span className="text-[var(--color-muted)]">({car.ratingCount})</span>
                          </div>
                          <div className="font-display text-xl font-bold text-[var(--color-gold)] xl:text-right xl:text-2xl">
                            {formatPrice(car.price)}
                          </div>
                          <p className="text-xs text-[var(--color-muted)] xl:text-right">/ өдөр</p>
                        </div>
                        {/* Mobile inline buttons */}
                        <div className="flex flex-col gap-2 xl:hidden">
                          <button
                            type="button"
                            onClick={() => openBooking(car)}
                            className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                          >
                            Захиалах
                          </button>
                          <Link
                            href={`/cars/${car.slug}`}
                            className="rounded-lg border border-white/8 px-4 py-2 text-center text-sm text-[var(--color-muted)] transition hover:border-[rgba(201,168,76,0.25)] hover:text-[var(--color-text)]"
                          >
                            Дэлгэрэнгүй
                          </Link>
                        </div>
                      </div>

                      <div className="mt-4 hidden space-y-2 xl:block">
                        <button
                          type="button"
                          onClick={() => openBooking(car)}
                          className="w-full rounded-lg bg-[var(--color-gold)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-gold-light)]"
                        >
                          Захиалах
                        </button>
                        <Link
                          href={`/cars/${car.slug}`}
                          className="block w-full rounded-lg border border-white/8 px-4 py-2 text-center text-sm text-[var(--color-muted)] transition hover:border-[rgba(201,168,76,0.25)] hover:text-[var(--color-text)]"
                        >
                          Дэлгэрэнгүй
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <section className="mt-10 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <div className="font-display text-lg font-bold">
                    Миний захиалгууд
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">
                    Дууссан захиалган дээр сэтгэгдэл үлдээж болно.
                  </div>
                </div>
                <div className="text-sm text-[var(--color-muted)]">
                  {recentBookings.length} захиалга
                </div>
              </div>

              {reviewError ? (
                <div className="mb-4 rounded-lg border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-[#F87171]">
                  {reviewError}
                </div>
              ) : null}

              {recentBookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--color-panel)] p-6 text-sm text-[var(--color-muted)]">
                  Таны хийсэн захиалга одоогоор алга байна.
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => {
                    const draft = reviewDrafts[booking.id] || {
                      rating: 5,
                      comment: "",
                    };

                    return (
                      <div
                        key={booking.id}
                        className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-white/8 bg-[linear-gradient(135deg,var(--color-panel),#1E1E2C)]">
                              {booking.car.heroImage ? (
                                <Image
                                  src={booking.car.heroImage}
                                  alt={booking.car.name}
                                  fill
                                  sizes="112px"
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : null}
                            </div>
                            <div>
                              <Link
                                href={`/cars/${booking.car.slug}`}
                                className="text-base font-semibold transition hover:text-[var(--color-gold)]"
                              >
                                {booking.car.name}
                              </Link>
                              <div className="mt-1 text-sm text-[var(--color-muted)]">
                                Жолооч: {booking.driver.name}
                              </div>
                              <div className="mt-2 text-xs text-[var(--color-muted)]">
                                {formatDate(booking.startDate)} -{" "}
                                {formatDate(booking.endDate)}
                              </div>
                              <div className="mt-2 text-sm text-[var(--color-muted)]">
                                Чиглэл: {booking.destination || "Оруулаагүй"}
                              </div>
                              <div className="mt-1 text-sm text-[var(--color-muted)]">
                                Дэлгэрэнгүй: {booking.notes || "Оруулаагүй"}
                              </div>
                            </div>
                          </div>

                          <div className="lg:text-right">
                            <div
                              className={`inline-flex rounded-full px-3 py-1 text-xs ${bookingStatusTone[booking.status] || "bg-white/10 text-white/70"}`}
                            >
                              {bookingStatusLabel[booking.status] ||
                                booking.status}
                            </div>
                            <div className="mt-3 font-display text-xl font-bold text-[var(--color-gold)]">
                              {formatPrice(booking.totalPrice)}
                            </div>
                          </div>
                        </div>

                        {booking.review ? (
                          <div className="mt-4 rounded-xl border border-[rgba(201,168,76,0.18)] bg-[rgba(201,168,76,0.06)] p-4">
                            <div className="text-sm font-medium">
                              Таны үнэлгээ: {"★".repeat(booking.review.rating)}
                            </div>
                            <div className="mt-2 text-sm text-[var(--color-muted)]">
                              {booking.review.comment || "Сэтгэгдэл бичээгүй."}
                            </div>
                          </div>
                        ) : booking.status === "COMPLETED" ? (
                          <div className="mt-4 rounded-xl border border-white/8 bg-[var(--color-surface)] p-4">
                            <div className="text-sm font-medium">
                              Сэтгэгдэл үлдээх
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={`${booking.id}-${star}`}
                                  type="button"
                                  onClick={() =>
                                    setReviewDrafts((current) => ({
                                      ...current,
                                      [booking.id]: {
                                        ...draft,
                                        rating: star,
                                      },
                                    }))
                                  }
                                  className={`rounded-lg px-3 py-2 text-sm ${
                                    draft.rating >= star
                                      ? "bg-[var(--color-gold)] text-[var(--color-ink)]"
                                      : "border border-white/8 bg-[var(--color-panel)] text-[var(--color-muted)]"
                                  }`}
                                >
                                  ★ {star}
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={draft.comment}
                              onChange={(event) =>
                                setReviewDrafts((current) => ({
                                  ...current,
                                  [booking.id]: {
                                    ...draft,
                                    comment: event.target.value,
                                  },
                                }))
                              }
                              placeholder="Жолооч, машин, үйлчилгээний талаар сэтгэгдлээ бичнэ үү..."
                              className="mt-3 min-h-24 w-full rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                            />
                            <div className="mt-3 flex justify-end">
                              <button
                                type="button"
                                onClick={() => submitReview(booking.id)}
                                disabled={reviewSubmittingId === booking.id}
                                className="rounded-lg bg-[var(--color-gold)] px-4 py-2.5 text-sm font-medium text-[var(--color-ink)]"
                              >
                                {reviewSubmittingId === booking.id
                                  ? "Хадгалж байна..."
                                  : "Сэтгэгдэл хадгалах"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 text-sm text-[var(--color-muted)]">
                            Энэ захиалга дууссаны дараа сэтгэгдэл үлдээх
                            боломжтой.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      {selectedCar ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeBooking();
            }
          }}
        >
          <div className="w-full max-w-3xl overflow-y-auto rounded-[24px] border border-[rgba(201,168,76,0.25)] bg-[var(--color-surface)] max-h-[95dvh] sm:max-h-[90vh]">
            {success ? (
              <div className="p-8 text-center">
                <div className="text-5xl">✅</div>
                <h3 className="mt-4 font-display text-2xl font-bold">
                  Захиалга илгээгдлээ!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-muted)]">
                  Жолооч таны чиглэл болон дэлгэрэнгүй байршлын мэдээллийг
                  хүлээн авлаа. Удахгүй холбогдоно.
                </p>

                <div className="mt-6 rounded-xl border border-white/8 bg-[var(--color-panel)] p-4 text-left text-sm">
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">Машин</span>
                    <span className="font-medium">{selectedCar.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">Огноо</span>
                    <span className="font-medium">
                      {modalStart || "Сонгоогүй"} → {modalEnd || "Сонгоогүй"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">Чиглэл</span>
                    <span className="font-medium">{selectedDestination}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/8 py-2">
                    <span className="text-[var(--color-muted)]">
                      Дэлгэрэнгүй
                    </span>
                    <span className="max-w-[60%] text-right font-medium">
                      {routeDetails || "Оруулаагүй"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[var(--color-muted)]">
                      Захиалгын №
                    </span>
                    <span className="font-medium">
                      #{bookingCode || "ALR-PENDING"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeBooking}
                  className="mt-6 w-full rounded-lg bg-[var(--color-gold)] px-5 py-3 text-sm font-medium text-[var(--color-ink)]"
                >
                  Ойлголоо
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      Захиалга баталгаажуулах
                    </h3>
                    <div className="mt-1 text-sm text-[var(--color-muted)]">
                      Машины detail page-тэй ижил байдлаар чиглэлээ тодорхой
                      оруулна уу.
                    </div>
                  </div>
                  <button
                    onClick={closeBooking}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-white/8 bg-[var(--color-panel)] text-[var(--color-muted)]"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="border-b border-white/8 p-6 lg:border-b-0 lg:border-r">
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-white/8 bg-[var(--color-panel)] p-4">
                      <button
                        type="button"
                        onClick={() => {
                          if (activeCarImages.length > 0) {
                            setImageViewerIndex(0);
                          }
                        }}
                        disabled={activeCarImages.length === 0}
                        className="relative h-20 w-28 overflow-hidden rounded-lg border border-white/8 bg-[linear-gradient(135deg,var(--color-panel),#1E1E2C)] text-left transition enabled:cursor-zoom-in enabled:hover:border-[rgba(201,168,76,0.35)] disabled:cursor-default"
                      >
                        {selectedCar.heroImage ? (
                          <Image
                            src={selectedCar.heroImage}
                            alt={selectedCar.name}
                            fill
                            sizes="112px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl">
                            {selectedCar.icon}
                          </div>
                        )}
                      </button>
                      <div>
                        <strong className="block text-sm font-medium">
                          {selectedCar.name}
                        </strong>
                        <span className="text-xs text-[var(--color-muted)]">
                          {selectedCar.year} · {selectedCar.transmission}
                        </span>
                        <div className="mt-1 text-[11px] text-[var(--color-gold)]">
                          Зураг дээр дарж томруулна
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[rgba(96,165,250,0.22)] bg-[rgba(96,165,250,0.08)] p-4 text-sm leading-6 text-[var(--color-muted)]">
                      <div className="mb-1 font-medium text-[#60A5FA]">
                        Байршлын тайлбар
                      </div>
                      Энд сум, хороо, амралтын газар, уулзах цэгээ тодорхой
                      бичвэл жолооч дээр яг тэр мэдээлэл очно.
                    </div>

                    <div className="mt-4 grid gap-3">
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
                          onChange={(event) =>
                            setSelectedDestination(event.target.value)
                          }
                          className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                        >
                          {mongoliaLocations.map((location) => (
                            <optgroup
                              key={location.aimag}
                              label={location.aimag}
                            >
                              {departureOptions
                                .filter(
                                  (option) => option.aimag === location.aimag,
                                )
                                .map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.value}
                                  </option>
                                ))}
                            </optgroup>
                          ))}
                        </select>
                      </label>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                          Эхлэх огноо
                          <input
                            value={modalStart}
                            onChange={(event) =>
                              setModalStart(event.target.value)
                            }
                            type="date"
                            className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                          Дуусах огноо
                          <input
                            value={modalEnd}
                            onChange={(event) =>
                              setModalEnd(event.target.value)
                            }
                            type="date"
                            className="rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-[var(--color-text)] outline-none"
                          />
                        </label>
                      </div>

                      <label className="flex flex-col gap-1.5 text-sm text-[var(--color-muted)]">
                        Дэлгэрэнгүй байршил / тосох цэг
                        <textarea
                          value={routeDetails}
                          onChange={(event) =>
                            setRouteDetails(event.target.value)
                          }
                          placeholder="Жишээ: Архангай, Тариат сум, Хоргын тогоо амралтын газрын үүдэнд тосоод явна уу."
                          className="min-h-28 rounded-xl border border-white/8 bg-[var(--color-panel)] px-3 py-2.5 text-sm outline-none"
                        />
                      </label>
                    </div>

                    {bookingError ? (
                      <div className="mt-4 rounded-lg border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-4 py-3 text-sm text-[#F87171]">
                        {bookingError}
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6">
                    <div className="rounded-2xl border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.06)] p-4 text-sm">
                      <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
                        <span>
                          {formatPrice(selectedCar.price)} × {bookingDays} өдөр
                        </span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="mb-2 flex items-center justify-between text-[var(--color-muted)]">
                        <span>Үйлчилгээний хөлс (5%)</span>
                        <span>{formatPrice(serviceFee)}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-[rgba(201,168,76,0.18)] pt-3 font-medium">
                        <span>Нийт</span>
                        <span className="font-display text-xl text-[var(--color-gold)]">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4">
                      <div className="text-xs uppercase tracking-[0.08em] text-[var(--color-muted)]">
                        Захиалгад очих мэдээлэл
                      </div>
                      <div className="mt-3 space-y-3 text-sm">
                        <div>
                          <div className="text-[var(--color-muted)]">
                            Чиглэл
                          </div>
                          <div className="mt-1 font-medium">
                            {selectedDestination}
                          </div>
                        </div>
                        <div>
                          <div className="text-[var(--color-muted)]">
                            Дэлгэрэнгүй
                          </div>
                          <div className="mt-1 font-medium">
                            {routeDetails || "Одоогоор оруулаагүй"}
                          </div>
                        </div>
                        <div>
                          <div className="text-[var(--color-muted)]">
                            Жолооч
                          </div>
                          <div className="mt-1 font-medium">
                            {selectedCar.driver.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-5 text-[#5A5856]">
                      <strong className="text-[var(--color-muted)]">
                        Анхааруулга:
                      </strong>{" "}
                      Аяллаа эхлэхээс өмнө жолооч таны оруулсан сум, хороо,
                      тосох цэгийн тайлбарыг шууд харна.
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={closeBooking}
                        className="flex-1 rounded-lg border border-white/8 px-4 py-3 text-sm text-[var(--color-muted)]"
                      >
                        Болих
                      </button>
                      <button
                        type="button"
                        onClick={submitBooking}
                        disabled={isSubmitting}
                        className="flex-[2] rounded-lg bg-[var(--color-gold)] px-4 py-3 text-sm font-medium text-[var(--color-ink)]"
                      >
                        {isSubmitting ? "Илгээж байна..." : "Захиалга илгээх →"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {selectedCar && activeViewerImage ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setImageViewerIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-[24px] border border-white/10 bg-[#090A0F] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
              <div>
                <div className="text-sm font-semibold text-white">
                  {selectedCar.name}
                </div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">
                  {(imageViewerIndex ?? 0) + 1} / {activeCarImages.length}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setImageViewerIndex(null)}
                className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 transition hover:text-white"
              >
                Хаах
              </button>
            </div>

            <div className="relative min-h-[320px] bg-black sm:min-h-[560px]">
              <Image
                src={activeViewerImage}
                alt={selectedCar.name}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                unoptimized
              />

              {activeCarImages.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setImageViewerIndex((current) =>
                        current === null
                          ? 0
                          : (current - 1 + activeCarImages.length) %
                            activeCarImages.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                    aria-label="Өмнөх зураг"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageViewerIndex((current) =>
                        current === null
                          ? 0
                          : (current + 1) % activeCarImages.length,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/55 text-xl text-white transition hover:bg-black/75"
                    aria-label="Дараагийн зураг"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};
