import Image from "next/image";
import Link from "next/link";
import { getCurrentViewer } from "@/lib/current-viewer";
import { getAvailableCars } from "@/lib/car-data";
import { FleetCardClient } from "./FleetCardClient";

const iconShellClasses =
  "flex items-center justify-center bg-[linear-gradient(135deg,var(--color-panel),var(--color-surface))]";

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

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {cars.length === 0 ? (
            <div className="col-span-2 rounded-[20px] border border-[var(--color-text)]/8 bg-[var(--color-surface)] p-8 text-sm text-[var(--color-muted)] md:col-span-2 xl:col-span-3">
              Одоогоор сул машин бүртгэгдээгүй байна.
            </div>
          ) : null}

          {cars.map((car, index) => (
            <FleetCardClient key={car.id ?? car.slug ?? `${car.name}-${index}`}>
              <article className="card-lift card-glow relative aspect-[1.04] overflow-hidden rounded-[18px] border border-[var(--color-text)]/8 bg-[var(--color-surface)] hover:border-[rgba(201,168,76,0.25)] sm:aspect-auto">
                <div className={`${iconShellClasses} absolute inset-0 sm:relative sm:aspect-[16/10]`}>
                  {car.heroImage ? (
                    <Image
                      src={car.heroImage}
                      alt={car.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="font-display text-3xl font-extrabold tracking-[0.12em] text-white/80 sm:text-4xl">
                      {car.icon}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                  <div
                    className={`absolute right-2 top-2 rounded-md px-2 py-1 text-[9px] tracking-[0.04em] sm:right-3 sm:top-3 sm:px-2.5 sm:text-[10px] ${car.badgeClassName}`}
                  >
                    {car.badge}
                  </div>

                  <div className="absolute inset-x-0 top-0 flex justify-center px-3 pt-10 sm:hidden">
                    <h3 className="max-w-full truncate font-display text-lg font-bold tracking-[-0.03em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                      {car.name}
                    </h3>
                  </div>

                  <div className="absolute bottom-2 right-2 h-5 w-5 rounded-br-[12px] border-b-4 border-r-4 border-[rgba(32,32,32,0.92)] sm:hidden" />
                </div>

                <div className="hidden p-5 sm:block">
                  <h3 className="font-display text-lg font-bold text-[var(--color-text)]">
                    {car.name}
                  </h3>

                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {car.detail}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {car.tags.map((tag, tagIndex) => (
                      <span
                        key={`${tag}-${tagIndex}`}
                        className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[var(--color-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-display text-xl font-bold text-[var(--color-gold)]">
                      {car.price}

                      <span className="ml-1 font-sans text-xs font-normal text-[var(--color-muted)]">
                        / өдөр
                      </span>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
                      <Link
                        href={`/cars/${car.slug}`}
                        className="rounded-lg border border-[rgba(201,168,76,0.28)] px-4 py-2 text-center text-sm font-medium text-[var(--color-gold)] transition hover:bg-[rgba(201,168,76,0.08)]"
                      >
                        Дэлгэрэнгүй
                      </Link>

                      {!isSignedIn ? (
                        <Link
                          href="/sign-in"
                          className="btn-shine rounded-lg bg-[var(--color-gold)] px-4 py-2 text-center text-sm font-medium text-[var(--color-ink)]"
                        >
                          Нэвтрэх
                        </Link>
                      ) : (
                        <Link
                          href="/booking"
                          className="btn-shine rounded-lg bg-[var(--color-gold)] px-4 py-2 text-center text-sm font-medium text-[var(--color-ink)]"
                        >
                          Захиалах
                        </Link>
                      )}
                    </div>
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
