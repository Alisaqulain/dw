import { handleShiprocketWebhook } from "@/lib/shiprocket-webhook";

export async function POST(request) {
  try {
    return await handleShiprocketWebhook(request);
  } catch (error) {
    console.error("[Shiprocket Webhook] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
