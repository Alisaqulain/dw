import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import AbandonedCart from "@/models/AbandonedCart";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const carts = await AbandonedCart.find({ converted: false })
      .sort({ lastActiveAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ carts: JSON.parse(JSON.stringify(carts)) });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await AbandonedCart.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
