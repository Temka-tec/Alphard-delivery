import "server-only";

import path from "node:path";

export const uploadsRootDir = path.join(process.cwd(), "storage", "uploads");

export const driverApplicationUploadRootDir = path.join(
  uploadsRootDir,
  "driver-applications",
);
