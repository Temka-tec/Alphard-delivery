import { NextResponse } from "next/server";
import { getCarDetailsBySlug } from "@/lib/car-data";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const car = await getCarDetailsBySlug(slug);

  if (!car) {
    return NextResponse.json(
      { error: "Машин олдсонгүй." },
      { status: 404 },
    );
  }

  return NextResponse.json(car);
}
