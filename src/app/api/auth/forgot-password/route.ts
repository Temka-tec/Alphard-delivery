import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Alphard Rentals <onboarding@resend.dev>";

export async function POST(req: Request) {
  const body = (await req.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email) {
    return new Response("И-мэйл хаяг оруулна уу.", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether the user exists
    return Response.json({ success: true });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await prisma.passwordResetToken.create({
    data: { email, code, expiresAt },
  });

  if (resendApiKey) {
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Нууц үг сэргээх код — Alphard",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111827">
          <h2 style="margin:0 0 8px;font-size:22px;">Нууц үг сэргээх код</h2>
          <p style="margin:0 0 20px;color:#6B7280;">Доорх 6 оронтой кодыг ашиглан нууц үгээ шинэчилнэ үү.</p>
          <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:24px;text-align:center;margin:0 0 20px">
            <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#111827">${code}</span>
          </div>
          <p style="margin:0;font-size:13px;color:#9CA3AF;">Код 10 минутын дотор хүчинтэй. Хэрэв та энэ хүсэлтийг өөрөө явуулаагүй бол энэ и-мэйлийг үл тоомсорлоно уу.</p>
        </div>
      `,
    });
  }

  return Response.json({ success: true });
}
