import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { eventType, sessionId, productId, productSlug, productName, cartValue, orderNumber, page } = body;

    if (!eventType) {
      return NextResponse.json({ error: "eventType required" }, { status: 400 });
    }

    await AnalyticsEvent.create({
      eventType,
      sessionId: sessionId || "",
      productId: productId || undefined,
      productSlug: productSlug || "",
      productName: productName || "",
      cartValue: Number(cartValue) || 0,
      orderNumber: orderNumber || "",
      page: page || "",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
