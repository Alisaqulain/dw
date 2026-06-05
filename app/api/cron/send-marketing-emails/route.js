import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import EmailSubscriber from "@/models/EmailSubscriber";
import { sendMarketingEmail } from "@/lib/email";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const fifteenDaysAgo = new Date(Date.now() - FIFTEEN_DAYS_MS);

    const subscribers = await EmailSubscriber.find({
      marketingOptIn: true,
      unsubscribed: false,
      $or: [
        { lastMarketingEmailAt: null },
        { lastMarketingEmailAt: { $lt: fifteenDaysAgo } },
      ],
    }).limit(50);

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const result = await sendMarketingEmail(subscriber);
      if (result.success && !result.skipped) {
        await EmailSubscriber.findByIdAndUpdate(subscriber._id, {
          lastMarketingEmailAt: new Date(),
        });
        sent++;
      } else {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: subscribers.length,
      sent,
      failed,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
