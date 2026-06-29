"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, X } from "lucide-react";
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
}: {
  initialCars: CarListItem[];
  initialBookings: RecentBooking[];
  viewerDisplayName: string | null;
}) => {
  const bookingCars = useMemo(() => mapBookingCars(initialCars), [initialCars]);
  const [recentBookings, setRecentBookings] = useState(initialBookings);
  const [selectedCar, setSelectedCar] = useState<BookingCar | null>(null);
  const [sortOrder, setSortOrder] = useState("Үнэ: бага → их");
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
  const [reviewSubmittingId, setReviewSubmittingId] = useState<string | null>(
    null,
  );

  const filteredCars = useMemo(() => {
    const nextCars = [...bookingCars];
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
    sortOrder,
  ]);

  const activeCar = selectedCar ?? bookingCars[0] ?? null;
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

  const openBooking = (car: BookingCar) => {
    const parsedLocation = parseLocationSelection(car.location);

    setSelectedCar(car);
    setModalStart(searchDefaults.startDate);
    setModalEnd(searchDefaults.endDate);
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
    setModalStart(searchDefaults.startDate);
    setModalEnd(searchDefaults.endDate);
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
        <header className="border-b border-white/8 px-4 py-4 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <Link
              href="/"
              className="w-fit rounded-lg border border-white/10 px-3 py-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              ← Нүүр хуудас
            </Link>
            <Link
              href="/"
              className="font-display text-xl font-extrabold tracking-[-0.04em] text-[var(--color-text)] sm:text-2xl"
            >
              ALPHARD<span className="text-[var(--color-gold)]">.</span>
            </Link>
            <div className="flex items-center justify-end gap-3">
              <ThemeToggle />
              <span className="hidden text-sm text-[var(--color-muted)] sm:block">
                Сайн байна уу, {displayName}
              </span>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] text-sm font-semibold text-[var(--color-gold)]">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <section className="border-b border-white/8 bg-[var(--color-surface)] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-muted)]">
              <strong className="font-medium text-[var(--color-text)]">
                {filteredCars.length}
              </strong>{" "}
              машин байна
            </p>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
              className="w-full rounded-lg border border-white/8 bg-[var(--color-panel)] px-3 py-2 text-xs text-[var(--color-muted)] outline-none sm:w-fit"
            >
              <option>Үнэ: бага → их</option>
              <option>Үнэ: их → бага</option>
              <option>Үнэлгээгээр</option>
              <option>Шинэ нэмэгдсэн</option>
            </select>
          </div>
        </section>

        <section className="p-4 sm:p-6">
          {filteredCars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[var(--color-panel)] p-8 text-sm text-[var(--color-muted)]">
              Энэ шүүлтээр машин олдсонгүй. Шүүлтээ багасгаад дахин оролдоно уу.
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {filteredCars.map((car) => {
              const isSelected = selectedCar
                ? selectedCar.id === car.id
                : car.selected;

              return (
                <article
                  key={car.id}
                  className={`card-lift card-glow overflow-hidden rounded-[20px] border bg-[var(--color-surface)] transition hover:border-[rgba(201,168,76,0.25)] ${
                    isSelected
                      ? "border-[var(--color-gold)] bg-[rgba(201,168,76,0.04)]"
                      : "border-[var(--color-text)]/8"
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] flex items-center justify-center bg-[linear-gradient(135deg,var(--color-panel),var(--color-surface))]">
                    {car.heroImage ? (
                      <Image
                        src={car.heroImage}
                        alt={car.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="font-display text-4xl font-extrabold tracking-[0.12em] text-white/80">
                        {car.icon}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <div className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] tracking-[0.04em] ${car.badgeClassName}`}>
                      {car.badge}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 sm:p-5">
                    <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                      {car.name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">
                      {car.year} · {car.color} · {car.transmission}
                    </p>

                    <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                      {car.tags.map((tag, tagIndex) => (
                        <span
                          key={`${tag}-${tagIndex}`}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-display text-xl font-bold text-[var(--color-gold)]">
                            {formatPrice(car.price)}
                            <span className="ml-1 font-sans text-xs font-normal text-[var(--color-muted)]">
                              /
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-[var(--color-muted)]">өдөр</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => openBooking(car)}
                          className="btn-shine hidden rounded-lg bg-[var(--color-gold)] px-4 py-2 text-center text-sm font-medium text-[var(--color-ink)] sm:block"
                        >
                          Захиалах
                        </button>
                      </div>
                      <Link
                        href={`/cars/${car.slug}`}
                        className="mt-3 block rounded-lg border border-[rgba(201,168,76,0.4)] px-4 py-2 text-center text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
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
                <CheckCircle2
                  size={56}
                  className="mx-auto text-[#3ECF8E]"
                  aria-hidden="true"
                />
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
                    <X size={14} aria-hidden="true" />
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
