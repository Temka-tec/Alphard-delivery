import Link from "next/link";
import { notFound } from "next/navigation";
import { Cog, Fuel, Sparkles, Users } from "lucide-react";
import { getCurrentViewer } from "@/lib/current-viewer";
import { getCarDetailsBySlug } from "@/lib/car-data";
import { parseLocationSelection } from "@/lib/mongolia-locations";
import { CarImageGallery } from "./_components/CarImageGallery";
import { CarDetailSidebar } from "./_components/CarDetailSidebar";

const featureIcon = (label: string) => {
  const cls = "text-[var(--color-gold)]";
  if (label === "Суудал") return <Users size={20} className={cls} />;
  if (label === "Хурдны хайрцаг") return <Cog size={20} className={cls} />;
  if (label === "Хөдөлгүүр") return <Fuel size={20} className={cls} />;
  return <Sparkles size={20} className={cls} />;
};

export const dynamic = "force-dynamic";

const formatPrice = (value: number) => `₮${value.toLocaleString()}`;

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const viewer = await getCurrentViewer();
  const { slug } = await params;
  const car = await getCarDetailsBySlug(slug);

  if (!car) {
    notFound();
  }

  const isOwnCar = Boolean(viewer.user?.id && car.ownerId && viewer.user.id === car.ownerId);
  const locationSelection = parseLocationSelection(car.location);

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 pb-24 pt-6 text-[var(--color-text)] sm:px-6 sm:pb-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
          >
            ← Буцах
          </Link>
          <div
            className={`rounded-md px-3 py-1 text-xs tracking-[0.04em] ${car.badgeClassName}`}
          >
            {car.badge}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_420px]">
          <section>
            <CarImageGallery
              carName={car.name}
              carYear={car.year}
              carColor={car.color}
              heroImage={car.heroImage}
              icon={car.icon}
              gallery={car.gallery}
            />

            <div className="mt-7">
              <h1 className="font-display text-3xl font-extrabold tracking-[-0.04em]">
                {car.name} {car.year}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                <span className="text-[var(--color-gold)]">
                  {"★".repeat(Math.round(car.rating))}
                </span>
                <span>{car.rating.toFixed(1)}</span>
                <span>· {car.reviewCount} үнэлгээ</span>
                <span>
                  · {car.color} · {car.transmission}
                </span>
                <span>· {car.location}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {car.features.map((feature) => (
                <div
                  key={`${car.slug}-${feature.label}`}
                  className="rounded-[18px] border border-white/8 bg-[var(--color-surface)] p-4"
                >
                  {featureIcon(feature.label)}
                  <div className="mt-3 text-xs text-[var(--color-muted)]">
                    {feature.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                    {feature.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Жолооч
              </div>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.15)] font-semibold text-[var(--color-gold)]">
                    {car.driver.initial}
                  </div>
                  <div>
                    {car.driver.id ? (
                      <Link
                        href={`/drivers/${car.driver.id}`}
                        className="text-base font-semibold transition hover:text-[var(--color-gold)]"
                      >
                        {car.driver.name}
                      </Link>
                    ) : (
                      <div className="text-base font-semibold">{car.driver.name}</div>
                    )}
                    <div className="text-sm text-[var(--color-muted)]">
                      {car.driver.detail}
                    </div>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <div className="font-display text-lg text-[var(--color-gold)]">
                      {car.driver.rating}
                    </div>
                    <div className="text-[var(--color-muted)]">Үнэлгээ</div>
                  </div>
                  <div>
                    <div className="font-display text-lg text-[var(--color-gold)]">
                      {car.driver.trips}
                    </div>
                    <div className="text-[var(--color-muted)]">Аялал</div>
                  </div>
                  <div>
                    <a
                      href={`tel:${car.driver.phone.replaceAll(" ", "")}`}
                      className="font-display text-lg text-[var(--color-gold)] transition hover:underline"
                    >
                      {car.driver.phone}
                    </a>
                    <div className="text-[var(--color-muted)]">Утас</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Машины ерөнхий мэдээлэл
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Байршил", value: car.location },
                  { label: "Хөдөлгүүр", value: car.engine },
                  { label: "Өдрийн үнэ", value: formatPrice(car.priceValue) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/8 bg-[var(--color-panel)] px-4 py-3"
                  >
                    <div className="text-xs text-[var(--color-muted)]">
                      {item.label}
                    </div>
                    <div className="mt-1 text-sm font-medium text-[var(--color-text)]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 text-sm font-semibold text-[var(--color-text)]">
                Үнэлгээ, сэтгэгдэл
              </div>
              <div className="space-y-4">
                {car.reviews.length === 0 ? (
                  <div className="rounded-2xl border border-white/8 bg-[var(--color-panel)] p-4 text-sm text-[var(--color-muted)]">
                    Одоогоор энэ машинд сэтгэгдэл бүртгэгдээгүй байна.
                  </div>
                ) : null}
                {car.reviews.map((review) => (
                  <div
                    key={`${car.slug}-${review.name}-${review.date}`}
                    className="border-b border-white/6 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/8 bg-[var(--color-panel)] text-xs text-[var(--color-muted)]">
                        {review.initial}
                      </div>
                      <div className="text-sm font-medium">{review.name}</div>
                      <div className="text-xs text-[var(--color-gold)]">
                        {review.rating}
                      </div>
                      <div className="ml-auto text-xs text-[var(--color-muted)]">
                        {review.date}
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div id="booking-sidebar">
            <CarDetailSidebar
              car={car}
              initialAimag={locationSelection.aimag}
              initialDestination={locationSelection.destination}
              isOwnCar={isOwnCar}
              userId={viewer.user?.id ?? null}
            />
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/8 bg-[var(--color-surface)]/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-display text-xl font-bold text-[var(--color-gold)]">
              {formatPrice(car.priceValue)}
            </div>
            <div className="text-xs text-[var(--color-muted)]">/ өдөр</div>
          </div>
          <a
            href="#booking-sidebar"
            className="flex-1 rounded-xl bg-[var(--color-gold)] py-3 text-center text-sm font-medium text-[var(--color-ink)]"
          >
            Захиалах
          </a>
        </div>
      </div>
    </main>
  );
}
