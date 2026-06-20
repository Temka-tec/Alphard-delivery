import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { SignOutAction } from "@/components/sign-out-action";
import { getCurrentViewer } from "@/lib/current-viewer";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);

const applicationStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  REVIEWING: "Шалгаж байна",
  APPROVED: "Зөвшөөрөгдсөн",
  REJECTED: "Татгалзсан",
};

const driverStatusLabel: Record<string, string> = {
  PENDING: "Хүлээгдэж байна",
  APPROVED: "Идэвхтэй",
  REJECTED: "Татгалзсан",
};

export default async function DriverProfilePage() {
  const viewer = await getCurrentViewer();

  if (!viewer.isSignedIn) {
    redirect("/sign-in?redirect_url=/driver/profile");
  }

  const displayName = viewer.displayName || "Хэрэглэгч";
  const application = viewer.latestDriverApplication;
  const car = viewer.driverProfile?.car;
  const profilePhoto =
    viewer.driverProfile?.photoUrl || application?.profilePhotoName || null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-6 py-8 text-[var(--color-text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-display text-3xl font-extrabold tracking-[-0.04em]">
              Жолоочийн профайл
            </div>
            <div className="mt-2 text-sm text-[var(--color-muted)]">
              Таны хүсэлт, үнэмлэх, машины мэдээлэл
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/driver/dashboard"
              className="rounded-xl border border-white/8 px-5 py-3 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
            >
              ← Dashboard
            </Link>
            <SignOutAction className="rounded-xl border border-[rgba(248,113,113,0.25)] bg-[rgba(248,113,113,0.08)] px-5 py-3 text-sm text-[#F87171] transition hover:bg-[rgba(248,113,113,0.14)]" />
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
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
              <div className="mt-4 font-display text-2xl font-bold">{displayName}</div>
              <div className="mt-1 text-sm text-[var(--color-muted)]">
                {viewer.displayEmail || "И-мэйл байхгүй"}
              </div>
              <div className="mt-3 rounded-full border border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.08)] px-3 py-1 text-xs text-[var(--color-gold)]">
                {viewer.driverProfile
                  ? driverStatusLabel[viewer.driverProfile.status]
                  : application
                    ? applicationStatusLabel[application.status]
                    : "Хүсэлт илгээгээгүй"}
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Хувийн мэдээлэл</div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Нэр", value: displayName },
                  {
                    label: "Утас",
                    value: viewer.user?.phone || application?.phone || "Оруулаагүй",
                  },
                  {
                    label: "И-мэйл",
                    value: viewer.displayEmail || application?.email || "Оруулаагүй",
                  },
                  {
                    label: "Гэрийн хаяг",
                    value: application?.homeAddress || "Оруулаагүй",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="text-xs text-[var(--color-muted)]">{field.label}</div>
                    <div className="mt-2 text-sm font-medium">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Жолооны үнэмлэх</div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Үнэмлэхийн дугаар",
                    value:
                      viewer.driverProfile?.licenseNumber ||
                      application?.licenseNumber ||
                      "Оруулаагүй",
                  },
                  {
                    label: "Ангилал",
                    value:
                      viewer.driverProfile?.licenseClass ||
                      application?.licenseClass ||
                      "Оруулаагүй",
                  },
                  {
                    label: "Дуусах огноо",
                    value: viewer.driverProfile?.licenseExpiry
                      ? formatDate(viewer.driverProfile.licenseExpiry)
                      : application?.licenseExpiry
                        ? formatDate(application.licenseExpiry)
                        : "Оруулаагүй",
                  },
                  {
                    label: "Туршлага",
                    value:
                      viewer.driverProfile?.experience ||
                      application?.drivingExperience ||
                      "Оруулаагүй",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="text-xs text-[var(--color-muted)]">{field.label}</div>
                    <div className="mt-2 text-sm font-medium">{field.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-[var(--color-surface)] p-5">
              <div className="mb-4 font-display text-lg font-bold">Машины мэдээлэл</div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    label: "Машин",
                    value: car
                      ? `${car.make} ${car.model}`
                      : application
                        ? `${application.carMake} ${application.carModel}`
                        : "Оруулаагүй",
                  },
                  {
                    label: "Улсын дугаар",
                    value: car?.plate || application?.plateNumber || "Оруулаагүй",
                  },
                  {
                    label: "Өдрийн үнэ",
                    value: application?.dailyRate
                      ? `${application.dailyRate.toLocaleString("mn-MN")}₮`
                      : car?.dailyRate
                        ? `${car.dailyRate.toLocaleString("mn-MN")}₮`
                        : "Оруулаагүй",
                  },
                  {
                    label: "Төлөв",
                    value: car?.status || "Холбогдоогүй",
                  },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="rounded-xl border border-white/8 bg-[var(--color-panel)] p-4"
                  >
                    <div className="text-xs text-[var(--color-muted)]">{field.label}</div>
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
