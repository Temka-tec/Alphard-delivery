import bcrypt from "bcryptjs";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
    name?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();
  const name = body.name?.trim() || null;

  if (!email || !password) {
    return new Response("И-мэйл болон нууц үгээ оруулна уу.", { status: 400 });
  }

  if (password.length < 6) {
    return new Response("Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.", { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return new Response("Энэ и-мэйл хаяг аль хэдийн бүртгэлтэй байна.", { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const role = isAdminEmail(email) ? "ADMIN" : "USER";

  const user = await prisma.user.create({
    data: { email, passwordHash, name, role },
  });

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return Response.json({ success: true });
}
