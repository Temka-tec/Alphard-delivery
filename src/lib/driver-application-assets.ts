import path from "node:path";

export const driverApplicationUploadUrlPrefix =
  "/api/uploads/driver-applications";

export const legacyDriverApplicationUploadUrlPrefix =
  "/uploads/driver-applications";

export const driverApplicationUploadRootDir = path.join(
  process.cwd(),
  "storage",
  "uploads",
  "driver-applications",
);

export const isDriverApplicationUploadUrl = (
  value: string | null | undefined,
): value is string =>
  Boolean(
    value?.startsWith(driverApplicationUploadUrlPrefix) ||
      value?.startsWith(legacyDriverApplicationUploadUrlPrefix),
  );

export const getDriverApplicationUploadUrl = (
  batchDir: string,
  storedFileName: string,
) => `${driverApplicationUploadUrlPrefix}/${batchDir}/${storedFileName}`;
