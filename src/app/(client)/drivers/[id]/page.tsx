import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);

export const dynamic = "force-dynamic";

export default async function PublicDriverProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const driver = await prisma.driverProfile.findUnique({
    where: { id },
    include: {
      user: {
        include: {
          driverApplications: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      },
      car: true,
      bookings: {
        include: {
          review: true,
        },
      },
    },
  });

  if (!driver) {
    notFound();
  }

  const ratings = driver.bookings
    .map((booking) => booking.review?.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  const latestApplication = driver.user.driverApplications[0] ?? null;
  const displayName =
    driver.user.name ||
    [latestApplication?.lastName, latestApplication?.firstName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    driver.user.email ||
    "Жолооч";
  const phoneNumber =
    driver.user.phone || latestApplication?.phone || "Утас оруулаагүй";
  const profilePhoto =
    driver.photoUrl || latestApplication?.profilePhotoName || null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/booking"
          className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-gold)]"
        >
          ← Буцах
        </Link>

        <div className="mt-6 grid gap-4 lg:grid-cols-[320px_1fr]">
          <aside className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.12)]">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt={displayName}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="font-display text-2xl font-bold text-[var(--color-gold)]">
                    {displayName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="mt-4 font-display text-2xl font-bold">
                {displayName}
              </div>
              <a
                href={
                  phoneNumber === "Утас оруулаагүй"
                    ? undefined
                    : `tel:${phoneNumber.replaceAll(" ", "")}`
                }
                className="mt-2 text-sm text-[#3ECF8E] transition hover:underline"
              >
                {phoneNumber}
              </a>
              <div className="mt-3 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
                {driver.status === "APPROVED" ? "Идэвхтэй жолооч" : "Жолооч"}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">
                Жолоочийн мэдээлэл
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Нэр", value: displayName },
                  { label: "Утас", value: phoneNumber },
                  { label: "Ангилал", value: driver.licenseClass },
                  { label: "Туршлага", value: driver.experience },
                  {
                    label: "Үнэлгээ",
                    value:
                      ratings.length > 0
                        ? `${averageRating.toFixed(1)} / 5`
                        : "Шинэ жолооч",
                  },
                  { label: "Аяллын тоо", value: String(driver.bookings.length) },
                  {
                    label: "Үнэмлэхийн хугацаа",
                    value: formatDate(driver.licenseExpiry),
                  },
                  {
                    label: "Машин",
                    value: driver.car
                      ? `${driver.car.make} ${driver.car.model}`
                      : "Одоогоор холбогдоогүй",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="text-xs text-[var(--color-muted)]">
                      {field.label}
                    </div>
                    <div className="mt-2 text-sm font-medium">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
