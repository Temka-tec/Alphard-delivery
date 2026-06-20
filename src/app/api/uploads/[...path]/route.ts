import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { driverApplicationUploadRootDir } from "@/lib/driver-application-assets";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  _req: Request,
  { params }: RouteContext<"/api/uploads/[...path]">,
) {
  const segments = (await params).path;

  if (!segments?.length) {
    return new Response("Файл олдсонгүй.", { status: 404 });
  }

  const requestedPath = path.resolve(driverApplicationUploadRootDir, ...segments);
  const baseDir = path.resolve(driverApplicationUploadRootDir);

  if (
    requestedPath !== baseDir &&
    !requestedPath.startsWith(`${baseDir}${path.sep}`)
  ) {
    return new Response("Хандах эрхгүй.", { status: 403 });
  }

  try {
    const fileStat = await stat(requestedPath);

    if (!fileStat.isFile()) {
      return new Response("Файл олдсонгүй.", { status: 404 });
    }

    const file = await readFile(requestedPath);
    const ext = path.extname(requestedPath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Файл олдсонгүй.", { status: 404 });
  }
}
