import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { storeImage } from "@/lib/imageStorage";

export async function POST(request) {
  try {
    await requireAdmin();
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Image data required" }, { status: 400 });
    }

    const result = await storeImage(image);
    return NextResponse.json(result);
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
