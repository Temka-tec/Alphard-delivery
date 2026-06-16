import "server-only";

import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const getCurrentViewer = async () => {
  const session = await getSession();

  if (!session.userId) {
    return {
      isSignedIn: false,
      isDriver: false,
      isAdmin: false,
      hasDriverApplication: false,
      user: null,
      driverProfile: null,
      latestDriverApplication: null,
      displayName: null,
      displayEmail: null,
    };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      driverProfile: {
        include: {
          car: true,
        },
      },
      driverApplications: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!dbUser) {
    return {
      isSignedIn: false,
      isDriver: false,
      isAdmin: false,
      hasDriverApplication: false,
      user: null,
      driverProfile: null,
      latestDriverApplication: null,
      displayName: null,
      displayEmail: null,
    };
  }

  const latestDriverApplication = dbUser.driverApplications[0] ?? null;
  const isDriver =
    dbUser.role === "DRIVER" || dbUser.driverProfile?.status === "APPROVED";
  const hasDriverApplication = Boolean(latestDriverApplication);

  const driverDisplayName = latestDriverApplication
    ? [latestDriverApplication.lastName, latestDriverApplication.firstName]
        .filter(Boolean)
        .join(" ")
        .trim() || null
    : null;

  const displayName =
    ((isDriver || hasDriverApplication) && driverDisplayName) ||
    dbUser.name ||
    null;

  const isAdmin = dbUser.role === "ADMIN" || isAdminEmail(dbUser.email);

  return {
    isSignedIn: true,
    isDriver,
    isAdmin,
    hasDriverApplication,
    user: dbUser,
    driverProfile: dbUser.driverProfile ?? null,
    latestDriverApplication,
    displayName,
    displayEmail: dbUser.email,
  };
};
