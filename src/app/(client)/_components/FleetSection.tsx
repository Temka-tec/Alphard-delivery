import Image from "next/image";
import Link from "next/link";
import { getCurrentViewer } from "@/lib/current-viewer";
import { getAvailableCars } from "@/lib/car-data";
import { FleetCardClient } from "./FleetCardClient";

export const FleetSection = async () => {
  const viewer = await getCurrentViewer();
  const isSignedIn = viewer.isSignedIn;
  const cars = await getAvailableCars(6, viewer.user?.id ?? null);

  return (
    <section id="cars" className="px-3 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-text)] sm:text-3xl">
            Сул байгаа{" "}
            <span className="text-[var(--color-gold)]">машинууд</span>
          </div>
          <a
            href="/booking"
            className="nav-underline w-fit pb-0.5 text-sm text-[var(--color-gold)]"
          >
            Бүгдийг харах
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {cars.length === 0 ? (
            <div className="col-span-2 rounded-[20px] border border-[var(--color-text)]/8 bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)] xl:col-span-3">
              Одоогоор сул машин бүртгэгдээгүй байна.
            </div>
          ) : null}

          {cars.map((car, index) => (
            <FleetCardClient key={car.id ?? car.slug ?? `${car.name}-${index}`}>
              <article className="card-lift card-glow overflow-hidden rounded-[20px] border border-[var(--color-text)]/8 bg-[var(--color-surface)] transition hover:border-[rgba(201,168,76,0.25)]">
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
                  <div
                    className={`absolute right-3 top-3 rounded-md px-2.5 py-1 text-[10px] tracking-[0.04em] ${car.badgeClassName}`}
                  >
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
                          {car.price}
                          <span className="ml-1 font-sans text-xs font-normal text-[var(--color-muted)]">
                            /
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--color-muted)]">өдөр</p>
                      </div>
                      {!isSignedIn ? (
                        <Link
                          href="/sign-in"
                          className="btn-shine hidden rounded-lg bg-[var(--color-gold)] px-4 py-2 text-center text-sm font-medium text-[var(--color-ink)] sm:block"
                        >
                          Нэвтрэх
                        </Link>
                      ) : (
                        <Link
                          href="/booking"
                          className="btn-shine hidden rounded-lg bg-[var(--color-gold)] px-4 py-2 text-center text-sm font-medium text-[var(--color-ink)] sm:block"
                        >
                          Захиалах
                        </Link>
                      )}
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
            </FleetCardClient>
          ))}
        </div>
      </div>
    </section>
  );
};
