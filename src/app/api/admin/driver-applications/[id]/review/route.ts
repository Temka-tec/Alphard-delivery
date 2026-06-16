import { Role } from "@/generated/prisma/client";
import { slugify } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const approvalSchema = ["APPROVED", "REJECTED"] as const;
type ApprovalStatus = (typeof approvalSchema)[number];

const buildCarSlug = (
  make: string,
  model: string,
  plateNumber: string,
  applicationId: string,
) => {
  const parts = [make, model, plateNumber].filter(Boolean).join(" ");
  return `${slugify(parts)}-${applicationId.slice(-6)}`;
};

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session.userId) {
    return new Response("Нэвтрэх шаардлагатай.", { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  if (adminUser?.role !== Role.ADMIN) {
    return new Response("Энэ үйлдэлд зөвшөөрөлгүй байна.", { status: 403 });
  }

  const { id } = await context.params;
  const payload = (await req.json()) as { status?: string };
  const status = payload.status as ApprovalStatus | undefined;

  if (!status || !approvalSchema.includes(status)) {
    return new Response("Төлөв буруу байна.", { status: 400 });
  }

  const application = await prisma.driverApplication.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!application) {
    return new Response("Хүсэлт олдсонгүй.", { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.driverApplication.update({
      where: { id: application.id },
      data: { status },
    });

    if (!application.userId) {
      return;
    }

    if (status === "APPROVED") {
      await tx.user.update({
        where: { id: application.userId },
        data: {
          role: Role.DRIVER,
          name:
            [application.lastName, application.firstName]
              .filter(Boolean)
              .join(" ")
              .trim() || null,
          phone: application.phone || null,
        },
      });

      const driverProfile = await tx.driverProfile.upsert({
        where: { userId: application.userId },
        update: {
          licenseNumber: application.licenseNumber,
          licenseClass: application.licenseClass,
          licenseExpiry: application.licenseExpiry,
          experience: application.drivingExperience,
          status: "APPROVED",
          photoUrl: application.profilePhotoName,
          licensePhotoF: application.licenseFrontName,
          licensePhotoB: application.licenseBackName,
          selfiePhoto: application.licenseSelfieName,
        },
        create: {
          userId: application.userId,
          licenseNumber: application.licenseNumber,
          licenseClass: application.licenseClass,
          licenseExpiry: application.licenseExpiry,
          experience: application.drivingExperience,
          status: "APPROVED",
          photoUrl: application.profilePhotoName,
          licensePhotoF: application.licenseFrontName,
          licensePhotoB: application.licenseBackName,
          selfiePhoto: application.licenseSelfieName,
        },
      });

      const existingCarByDriver = await tx.car.findFirst({
        where: { driverId: driverProfile.id },
      });
      const existingCarByPlate = await tx.car.findUnique({
        where: { plate: application.plateNumber },
      });

      const carData = {
        make: application.carMake,
        model: application.carModel,
        year: application.carYear,
        color: application.carColor,
        plate: application.plateNumber,
        seats: Number(application.seatCount.replace(/\D/g, "")) || 4,
        transmission: application.transmission || "Автомат",
        enginePower: application.enginePower,
        status: "AVAILABLE" as const,
        dailyRate: application.dailyRate,
        photos: [
          application.carFrontName,
          application.carBackName,
          application.carInteriorName,
        ].filter((value): value is string => Boolean(value)),
        features: [],
        driverId: driverProfile.id,
      };

      if (existingCarByDriver) {
        await tx.car.update({
          where: { id: existingCarByDriver.id },
          data: {
            ...carData,
            slug: existingCarByDriver.slug,
          },
        });
      } else if (existingCarByPlate) {
        await tx.car.update({
          where: { id: existingCarByPlate.id },
          data: {
            ...carData,
            slug: existingCarByPlate.slug,
          },
        });
      } else {
        await tx.car.create({
          data: {
            ...carData,
            slug: buildCarSlug(
              application.carMake,
              application.carModel,
              application.plateNumber,
              application.id,
            ),
          },
        });
      }
    }

    if (status === "REJECTED") {
      await tx.user.update({
        where: { id: application.userId },
        data: { role: Role.USER },
      });

      await tx.driverProfile.updateMany({
        where: { userId: application.userId },
        data: { status: "REJECTED" },
      });
    }
  });

  return Response.json({ success: true });
}
