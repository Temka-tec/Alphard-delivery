export default function BookingLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-white/8 px-2 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-28 rounded-lg" />
            <div className="skeleton h-7 w-32 rounded-lg" />
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="skeleton h-8 w-8 rounded-lg" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-9 w-9 rounded-full" />
          </div>
        </header>

        {/* Sort bar */}
        <section className="border-b border-white/8 bg-[var(--color-surface)] px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-9 w-full rounded-lg sm:w-44" />
          </div>
        </section>

        {/* Car list */}
        <section className="p-4 sm:p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="grid items-start overflow-hidden rounded-2xl border border-white/8 bg-(--color-panel) xl:grid-cols-[220px_1fr_180px]"
              >
                <div className="skeleton min-h-36 rounded-none sm:min-h-44" />
                <div className="flex flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="skeleton h-5 w-2/5 rounded-lg" />
                      <div className="skeleton h-6 w-12 rounded-md" />
                    </div>
                    <div className="skeleton h-3.5 w-3/5 rounded" />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="skeleton h-6 w-16 rounded-md" />
                      <div className="skeleton h-6 w-20 rounded-md" />
                      <div className="skeleton h-6 w-14 rounded-md" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="skeleton h-7 w-7 rounded-full" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3.5 w-24 rounded" />
                      <div className="skeleton h-3 w-32 rounded" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between border-t border-white/8 p-4 xl:border-l xl:border-t-0 xl:p-5">
                  <div className="flex items-center justify-between gap-3 xl:block">
                    <div>
                      <div className="skeleton mb-1 ml-auto h-3.5 w-16 rounded" />
                      <div className="skeleton h-7 w-28 rounded-lg" />
                      <div className="skeleton mt-1 h-3 w-10 rounded" />
                    </div>
                    <div className="flex flex-col gap-2 xl:hidden">
                      <div className="skeleton h-9 w-24 rounded-lg" />
                      <div className="skeleton h-9 w-24 rounded-lg" />
                    </div>
                  </div>
                  <div className="mt-4 hidden space-y-2 xl:block">
                    <div className="skeleton h-10 w-full rounded-lg" />
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <section className="mt-10 rounded-[24px] border border-white/8 bg-(--color-surface) p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="skeleton h-5 w-36 rounded-lg" />
                <div className="skeleton h-3.5 w-52 rounded" />
              </div>
              <div className="skeleton h-4 w-16 rounded" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/8 bg-(--color-panel) p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="skeleton h-20 w-28 rounded-xl" />
                      <div className="space-y-2">
                        <div className="skeleton h-4 w-36 rounded" />
                        <div className="skeleton h-3.5 w-28 rounded" />
                        <div className="skeleton h-3 w-40 rounded" />
                        <div className="skeleton h-3 w-32 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2 lg:text-right">
                      <div className="skeleton h-6 w-24 rounded-full" />
                      <div className="skeleton h-7 w-28 rounded-lg lg:ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
