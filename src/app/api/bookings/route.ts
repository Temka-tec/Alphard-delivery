import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const MS_IN_DAY = 86_400_000;

export async function POST(req: Request) {
  const session = await getSession();

  if (!session.userId) {
    return new Response("Нэвтрэх шаардлагатай.", { status: 401 });
  }

  const payload = (await req.json()) as {
    carId?: string;
    startDate?: string;
    endDate?: string;
    destination?: string;
    notes?: string;
  };

  const carId = payload.carId?.trim();
  const destination = payload.destination?.trim();
  const notes = payload.notes?.trim() || null;
  const startDate = payload.startDate ? new Date(payload.startDate) : null;
  const endDate = payload.endDate ? new Date(payload.endDate) : null;

  if (!carId || !destination || !startDate || !endDate) {
    return new Response("Захиалгын мэдээллээ бүрэн оруулна уу.", { status: 400 });
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return new Response("Огноо буруу байна.", { status: 400 });
  }

  if (endDate <= startDate) {
    return new Response("Дуусах огноо эхлэх огнооноос хойш байх ёстой.", {
      status: 400,
    });
  }

  const bookingDays = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / MS_IN_DAY),
  );

  const dbUser = await prisma.user.findUnique({ where: { id: session.userId } });

  if (!dbUser) {
    return new Response("Хэрэглэгч олдсонгүй.", { status: 401 });
  }

  const car = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      driver: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!car || !car.driverId) {
    return new Response("Сонгосон машин олдсонгүй.", { status: 404 });
  }

  if (car.driver?.user?.id === session.userId) {
    return new Response("Өөрийн машиныг өөрөө захиалах боломжгүй.", {
      status: 400,
    });
  }

  const overlappingBooking = await prisma.booking.findFirst({
    where: {
      carId,
      status: {
        in: ["PENDING", "CONFIRMED", "ACTIVE"],
      },
      startDate: {
        lt: endDate,
      },
      endDate: {
        gt: startDate,
      },
    },
    select: {
      id: true,
    },
  });

  if (overlappingBooking) {
    return new Response("Энэ хугацаанд тухайн машин аль хэдийн захиалгатай байна.", {
      status: 409,
    });
  }

  const subtotal = car.dailyRate * bookingDays;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + serviceFee;

  const booking = await prisma.booking.create({
    data: {
      userId: dbUser.id,
      carId,
      driverId: car.driverId,
      startDate,
      endDate,
      destination,
      notes,
      totalPrice,
      status: "PENDING",
    },
  });

  return Response.json({
    success: true,
    bookingId: booking.id,
    bookingCode: `ALR-${booking.id.slice(-8).toUpperCase()}`,
  });
}
