import bcrypt from "bcryptjs";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password?.trim();

  if (!email || !password) {
    return new Response("И-мэйл болон нууц үгээ оруулна уу.", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return new Response("И-мэйл эсвэл нууц үг буруу байна.", { status: 401 });
  }

  // promote to admin if email matches
  if (isAdminEmail(email) && user.role !== "ADMIN") {
    await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  }

  const session = await getSession();
  session.userId = user.id;
  await session.save();

  return Response.json({ success: true });
}
