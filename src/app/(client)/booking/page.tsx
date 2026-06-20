import { getAvailableCars } from "@/lib/car-data";
import { isDriverApplicationUploadUrl } from "@/lib/driver-application-assets";
import { getCurrentViewer } from "@/lib/current-viewer";
import { prisma } from "@/lib/prisma";
import { BookingExperience } from "./_components/BookingExperience";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const viewer = await getCurrentViewer();
  const [cars, recentBookings] = await Promise.all([
    getAvailableCars(undefined, viewer.user?.id ?? null),
    viewer.user
      ? prisma.booking.findMany({
          where: {
            userId: viewer.user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 6,
          include: {
            car: true,
            review: true,
            driver: {
              include: {
                user: true,
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  return (
    <BookingExperience
      initialCars={cars}
      initialBookings={recentBookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        destination: booking.destination || "",
        notes: booking.notes || "",
        totalPrice: booking.totalPrice || 0,
        review: booking.review
          ? {
              rating: booking.review.rating,
              comment: booking.review.comment || "",
            }
          : null,
        car: {
          name: `${booking.car.make} ${booking.car.model}`,
          slug: booking.car.slug,
          heroImage:
            booking.car.photos.find((photo) =>
              isDriverApplicationUploadUrl(photo),
            ) || null,
        },
        driver: {
          name: booking.driver.user.name || "Жолооч",
        },
      }))}
      viewerDisplayName={viewer.displayName}
      useDriverDisplayName={viewer.isDriver || viewer.hasDriverApplication}
    />
  );
}
