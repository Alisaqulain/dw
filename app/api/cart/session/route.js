import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AbandonedCart from "@/models/AbandonedCart";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { sessionId, items, cartValue, phone, email, customerName, checkoutStarted } = body;

    if (!sessionId || !items?.length) {
      return NextResponse.json({ error: "sessionId and items required" }, { status: 400 });
    }

    const update = {
      items,
      cartValue: Number(cartValue) || 0,
      lastActiveAt: new Date(),
    };

    if (phone) update.phone = phone;
    if (email) update.email = email.toLowerCase();
    if (customerName) update.customerName = customerName;
    if (checkoutStarted) update.checkoutStarted = true;

    const cart = await AbandonedCart.findOneAndUpdate(
      { sessionId, converted: false },
      { $set: update, $setOnInsert: { sessionId } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, id: cart._id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    await connectDB();
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }
    await AbandonedCart.findOneAndUpdate({ sessionId }, { converted: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
