import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();

  if (!session.userId) {
    return new Response("Нэвтрэх шаардлагатай.", { status: 401 });
  }

  const { id } = await params;
  const payload = (await req.json()) as {
    rating?: number;
    comment?: string;
  };

  const rating = Number(payload.rating);
  const comment = payload.comment?.trim() || null;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return new Response("Үнэлгээ 1-5 хооронд байх ёстой.", { status: 400 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
      review: true,
    },
  });

  if (!booking) {
    return new Response("Захиалга олдсонгүй.", { status: 404 });
  }

  if (booking.user.id !== session.userId) {
    return new Response("Энэ захиалгад сэтгэгдэл үлдээх эрхгүй байна.", {
      status: 403,
    });
  }

  if (booking.status !== "COMPLETED") {
    return new Response("Зөвхөн дууссан захиалгад сэтгэгдэл үлдээнэ.", {
      status: 400,
    });
  }

  if (booking.review) {
    return new Response("Энэ захиалгад аль хэдийн сэтгэгдэл үлдээсэн байна.", {
      status: 409,
    });
  }

  const review = await prisma.review.create({
    data: {
      bookingId: booking.id,
      rating,
      comment,
    },
  });

  return Response.json({
    success: true,
    reviewId: review.id,
  });
}
