import "server-only";

import path from "node:path";

export const driverApplicationUploadRootDir = path.join(
  process.cwd(),
  "storage",
  "uploads",
  "driver-applications",
);
