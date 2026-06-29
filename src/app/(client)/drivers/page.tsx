import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const drivers = await prisma.driverProfile.findMany({
    where: { status: "APPROVED" },
    include: {
      user: {
        include: {
          driverApplications: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      },
      car: true,
      bookings: {
        include: { review: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[var(--color-text)] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Жолоочид
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {drivers.length} идэвхтэй жолооч
            </p>
          </div>

          <Link
            href="/"
            className="btn-shine inline-flex items-center justify-center rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:brightness-105 sm:self-start"
          >
            Нүүр хуудас руу буцах
          </Link>
        </div>

        {drivers.length === 0 ? (
          <div className="mt-20 text-center text-[var(--color-muted)]">
            Одоогоор жолооч байхгүй байна.
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {drivers.map((driver) => {
              const app = driver.user.driverApplications[0] ?? null;
              const displayName =
                driver.user.name ||
                [app?.lastName, app?.firstName].filter(Boolean).join(" ").trim() ||
                driver.user.email ||
                "Жолооч";
              const photo = driver.photoUrl || app?.profilePhotoName || null;
              const phone = driver.user.phone || app?.phone || null;
              const ratings = driver.bookings
                .map((b) => b.review?.rating)
                .filter((r): r is number => typeof r === "number");
              const avg =
                ratings.length > 0
                  ? ratings.reduce((s, r) => s + r, 0) / ratings.length
                  : null;

              return (
                <Link
                  key={driver.id}
                  href={`/drivers/${driver.id}`}
                  className="group flex flex-col rounded-[20px] border border-[var(--color-text)]/8 bg-[var(--color-surface)] p-5 transition hover:border-[rgba(201,168,76,0.35)] hover:shadow-[0_8px_32px_rgba(201,168,76,0.08)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)]">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={displayName}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="font-display text-xl font-bold text-[var(--color-gold)]">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate font-semibold">{displayName}</div>
                      {phone ? (
                        <div className="truncate text-xs text-[#3ECF8E]">{phone}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-[var(--color-panel)] px-3 py-2">
                      <div className="text-[var(--color-muted)]">Ангилал</div>
                      <div className="mt-0.5 font-medium">{driver.licenseClass}</div>
                    </div>
                    <div className="rounded-lg bg-[var(--color-panel)] px-3 py-2">
                      <div className="text-[var(--color-muted)]">Туршлага</div>
                      <div className="mt-0.5 font-medium">{driver.experience}</div>
                    </div>
                    {driver.car ? (
                      <div className="col-span-2 rounded-lg bg-[var(--color-panel)] px-3 py-2">
                        <div className="text-[var(--color-muted)]">Машин</div>
                        <div className="mt-0.5 font-medium">
                          {driver.car.make} {driver.car.model} · {driver.car.year}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    {avg !== null ? (
                      <span className="text-sm font-medium text-[var(--color-gold)]">
                        ★ {avg.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--color-muted)]">Шинэ жолооч</span>
                    )}
                    <span className="text-xs text-[var(--color-muted)] transition group-hover:text-[var(--color-gold)]">
                      Дэлгэрэнгүй →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
