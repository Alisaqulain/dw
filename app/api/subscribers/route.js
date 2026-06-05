import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import EmailSubscriber from "@/models/EmailSubscriber";
import { requireAdmin } from "@/lib/auth";
import { verifyUnsubscribeToken } from "@/lib/utils";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
    }

    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 403 });
    }

    await connectDB();
    await EmailSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { unsubscribed: true, marketingOptIn: false },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Successfully unsubscribed" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const { email, name, marketingOptIn, source } = await request.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const subscriber = await EmailSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        email: email.toLowerCase(),
        name: name || "",
        marketingOptIn: marketingOptIn !== false,
        unsubscribed: false,
        source: source || "popup",
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, subscriber });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await requireAdmin();
    await connectDB();
    const subscribers = await EmailSubscriber.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ subscribers });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
