import "server-only";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { isDriverApplicationUploadUrl } from "@/lib/driver-application-assets";

export type CarListItem = {
  id: string;
  slug: string;
  ownerId: string | null;
  icon: string;
  photos: string[];
  heroImage: string | null;
  badge: string;
  badgeClassName: string;
  name: string;
  detail: string;
  tags: string[];
  price: string;
  priceValue: number;
  year: string;
  color: string;
  transmission: string;
  rating: number;
  reviewCount: number;
  location: string;
  engine: string;
  insurance: string;
  driver: {
    id: string | null;
    initial: string;
    name: string;
    detail: string;
    rating: string;
    trips: number;
    phone: string;
    photoUrl: string | null;
  };
};

export type CarDetailsItem = CarListItem & {
  gallery: string[];
  features: Array<{
    label: string;
    value: string;
  }>;
  reviews: Array<{
    initial: string;
    name: string;
    date: string;
    rating: string;
    text: string;
  }>;
};

const formatPriceLabel = (value: number) => `₮${value.toLocaleString()}`;

const isStoredImagePath = (value: string | null | undefined): value is string =>
  isDriverApplicationUploadUrl(value);

const titleCase = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const initialsFromName = (value: string) =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "AL";

const ratingStars = (value: number) => {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return `${"★".repeat(filled)}${"☆".repeat(5 - filled)}`;
};

const summarizeFeatures = (car: {
  seats: number;
  features: string[];
}) => {
  const tags = [`${car.seats} суудал`, ...car.features].slice(0, 3);

  return tags.length > 0 ? tags : ["Тохиргоо удахгүй"];
};

const formatFeatureGrid = (car: {
  seats: number;
  transmission: string;
  enginePower: string | null;
  features: string[];
}) => {
  const coreFeatures = [
    { label: "Суудал", value: `${car.seats} суудал` },
    { label: "Хурдны хайрцаг", value: car.transmission },
    {
      label: "Хөдөлгүүр",
      value: car.enginePower || "Мэдээлэлгүй",
    },
  ];

  const extraFeatures = car.features.slice(0, 2).map((feature) => ({
    label: "Нэмэлт",
    value: feature,
  }));

  return [...coreFeatures, ...extraFeatures];
};

const mapCarRecord = (car: Awaited<ReturnType<typeof getCarsRaw>>[number]): CarListItem => {
  const reviews = car.bookings.flatMap((booking) =>
    booking.review ? [booking.review] : [],
  );
  const reviewCount = reviews.length;
  const rating =
    reviewCount > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;
  const latestApplication = car.driver?.user.driverApplications[0] ?? null;
  const driverName =
    car.driver?.user.name ||
    [latestApplication?.lastName, latestApplication?.firstName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Жолооч удахгүй";
  const driverPhone =
    car.driver?.user.phone || latestApplication?.phone || "Утас удахгүй";
  const driverPhotoUrl =
    car.driver?.photoUrl || latestApplication?.profilePhotoName || null;
  const driverExperience = car.driver?.experience || "Туршлага удахгүй";
  const driverClass = car.driver?.licenseClass || "Ангилал удахгүй";
  const shortCode = titleCase(car.model).slice(0, 3).toUpperCase() || "CAR";
  const badge = car.status === "AVAILABLE" ? "Сул" : "Захиалгатай";

  return {
    id: car.id,
    slug: car.slug,
    ownerId: car.driver?.user.id || null,
    icon: shortCode,
    photos: car.photos.filter(isStoredImagePath),
    heroImage: car.photos.find(isStoredImagePath) || null,
    badge,
    badgeClassName:
      car.status === "AVAILABLE"
        ? "border border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.15)] text-[var(--color-gold)]"
        : "border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.14)] text-[#FCA5A5]",
    name: `${car.make} ${car.model}`,
    detail: `${car.year} · ${car.color || "Өнгө тодорхойгүй"} · ${car.transmission}`,
    tags: summarizeFeatures(car),
    price: formatPriceLabel(car.dailyRate),
    priceValue: car.dailyRate,
    year: String(car.year),
    color: car.color || "Өнгө тодорхойгүй",
    transmission: car.transmission,
    rating,
    reviewCount,
    location: car.location || "Байршил удахгүй",
    engine: car.enginePower || "Мэдээлэлгүй",
    insurance: car.insurance || "Мэдээлэлгүй",
    driver: {
      id: car.driver?.id || null,
      initial: initialsFromName(driverName),
      name: driverName,
      detail: `${driverClass} · ${driverExperience}`,
      rating: reviewCount > 0 ? `${rating.toFixed(1)}★` : "Шинэ",
      trips: car.bookings.length,
      phone: driverPhone,
      photoUrl: driverPhotoUrl,
    },
  };
};

const formatReviewDate = (value: Date) =>
  new Intl.DateTimeFormat("mn-MN", {
    month: "numeric",
    day: "numeric",
  }).format(value);

async function getCarsRaw(options?: {
  limit?: number;
  slug?: string;
  excludeUserId?: string | null;
}) {
  try {
    return await prisma.car.findMany({
      where: {
        ...(options?.slug ? { slug: options.slug } : {}),
        ...(options?.slug ? {} : { status: "AVAILABLE" }),
        ...(options?.excludeUserId
          ? {
              NOT: {
                driver: {
                  user: {
                    id: options.excludeUserId,
                  },
                },
              },
            }
          : {}),
      },
      take: options?.limit,
      orderBy: [{ createdAt: "desc" }],
      include: {
        driver: {
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
          },
        },
        bookings: {
          include: {
            review: true,
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      console.warn(
        "Prisma table is missing. Run `npx prisma db push` or apply your migrations.",
      );
      return [];
    }

    throw error;
  }
}

export async function getAvailableCars(limit?: number, excludeUserId?: string | null) {
  const cars = await getCarsRaw({ limit, excludeUserId });
  return cars.map(mapCarRecord);
}

export async function getCarDetailsBySlug(slug: string): Promise<CarDetailsItem | null> {
  const [car] = await getCarsRaw({ slug });

  if (!car) {
    return null;
  }

  const base = mapCarRecord(car);
  const reviews = car.bookings
    .filter((booking) => booking.review)
    .map((booking) => ({
      initial: initialsFromName(booking.user.name || booking.user.email),
      name: booking.user.name || booking.user.email,
      date: formatReviewDate(booking.review!.createdAt),
      rating: ratingStars(booking.review!.rating),
      text: booking.review!.comment || "Сэтгэгдэл үлдээгээгүй байна.",
    }));

  return {
    ...base,
    gallery:
      base.photos.length > 0
        ? base.photos.slice(0, 4)
        : [base.icon, base.year, `${car.seats} суудал`, base.location],
    features: formatFeatureGrid(car),
    reviews,
  };
}
