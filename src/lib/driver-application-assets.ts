export const driverApplicationUploadUrlPrefix =
  "/uploads/driver-applications";

export const legacyDriverApplicationUploadUrlPrefix =
  "/api/uploads/driver-applications";

export const isDriverApplicationUploadUrl = (
  value: string | null | undefined,
): value is string =>
  Boolean(
    value?.startsWith(driverApplicationUploadUrlPrefix) ||
      value?.startsWith(legacyDriverApplicationUploadUrlPrefix) ||
      value?.includes("blob.vercel-storage.com"),
  );

export const getDriverApplicationUploadUrl = (
  batchDir: string,
  storedFileName: string,
) => `${driverApplicationUploadUrlPrefix}/${batchDir}/${storedFileName}`;
