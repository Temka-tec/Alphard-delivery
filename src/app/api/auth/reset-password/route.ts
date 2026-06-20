import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    code?: string;
    newPassword?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const code = body.code?.trim();
  const newPassword = body.newPassword?.trim();

  if (!email || !code || !newPassword) {
    return new Response("Бүх талбарыг бөглөнө үү.", { status: 400 });
  }

  if (newPassword.length < 6) {
    return new Response("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.", {
      status: 400,
    });
  }

  const token = await prisma.passwordResetToken.findFirst({
    where: {
      email,
      code,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!token) {
    return new Response("Код буруу эсвэл хугацаа дууссан байна.", {
      status: 400,
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return Response.json({ success: true });
}
