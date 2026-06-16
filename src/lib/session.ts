import "server-only";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";

export type SessionData = {
  userId?: string;
};

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "alphard_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
