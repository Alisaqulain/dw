export async function sendOrderConfirmationSMS(phone, orderNumber, total) {
  const apiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
  if (!apiKey || !phone) {
    return { success: true, skipped: true };
  }

  const message = `TrustSilcon: Your COD order ${orderNumber} is confirmed. Total: Rs.${total}. Discreet delivery in 3-7 days. Track at trustsilcon.com/track-order`;

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        numbers: phone.replace(/\D/g, "").slice(-10),
      }),
    });
    const data = await res.json();
    return { success: data.return === true, data };
  } catch (error) {
    console.error("SMS send failed:", error.message);
    return { success: false, error: error.message };
  }
}
