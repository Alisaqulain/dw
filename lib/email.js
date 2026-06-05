import nodemailer from "nodemailer";
import EmailLog from "@/models/EmailLog";
import { connectDB } from "@/lib/mongodb";
import { getSiteUrl, generateUnsubscribeToken } from "@/lib/utils";

function getTransporter() {
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
}

function emailLayout(content, preheader = "") {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TrustSilcon</title>
</head>
<body style="margin:0;padding:0;background:#f0f9ff;font-family:Arial,sans-serif;">
  <span style="display:none;font-size:1px;color:#f0f9ff;">${preheader}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f9ff;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(14,165,233,0.1);">
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9,#38bdf8);padding:28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;letter-spacing:1px;">TrustSilcon</h1>
              <p style="margin:8px 0 0;color:#e0f2fe;font-size:13px;">Premium Wellness · Discreet Care</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px;color:#334155;font-size:15px;line-height:1.6;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px;background:#f8fafc;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                TrustSilcon · Body-safe silicone wellness products<br>
                Discreet packaging · Secure checkout
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function logEmail(to, subject, type, status, error = null) {
  try {
    await connectDB();
    await EmailLog.create({ to, subject, type, status, error });
  } catch (e) {
    console.error("Email log failed:", e.message);
  }
}

export async function sendEmail({ to, subject, html, type = "transactional" }) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || "TrustSilcon <noreply@trustsilcon.com>";

  if (!transporter) {
    console.log(`[Email skipped - no config] To: ${to}, Subject: ${subject}`);
    await logEmail(to, subject, type, "skipped", "No email config");
    return { success: true, skipped: true };
  }

  try {
    await transporter.sendMail({ from, to, subject, html });
    await logEmail(to, subject, type, "sent");
    return { success: true };
  } catch (error) {
    await logEmail(to, subject, type, "failed", error.message);
    console.error("Email send failed:", error.message);
    return { success: false, error: error.message };
  }
}

export async function sendOrderConfirmation(order) {
  const siteUrl = getSiteUrl();
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">Your order is confirmed</h2>
    <p>Hi ${order.customerName},</p>
    <p>Thank you for choosing TrustSilcon. Your wellness order has been received and is being prepared with discreet packaging.</p>
    <table width="100%" style="margin:20px 0;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#64748b;">Order ID</td><td style="padding:8px 0;font-weight:600;text-align:right;">${order.orderNumber}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Total</td><td style="padding:8px 0;font-weight:600;text-align:right;">₹${order.total}</td></tr>
      <tr><td style="padding:8px 0;color:#64748b;">Payment</td><td style="padding:8px 0;text-align:right;">${order.paymentMethod}</td></tr>
    </table>
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/track-order?order=${order.orderNumber}" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Track Your Order</a>
    </p>
    <p style="color:#64748b;font-size:13px;">Your package will arrive in plain, unmarked packaging for complete privacy.</p>
  `, "Your TrustSilcon order is confirmed");

  return sendEmail({
    to: order.email,
    subject: "Your TrustSilcon order is confirmed",
    html,
    type: "order_confirmation",
  });
}

export async function sendOrderShipped(order) {
  const siteUrl = getSiteUrl();
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">Your order has been shipped</h2>
    <p>Hi ${order.customerName},</p>
    <p>Great news! Your TrustSilcon order is on its way in discreet packaging.</p>
    ${order.courierName ? `<p><strong>Courier:</strong> ${order.courierName}</p>` : ""}
    ${order.awbCode ? `<p><strong>Tracking:</strong> ${order.awbCode}</p>` : ""}
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/track-order?order=${order.orderNumber}" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Track Shipment</a>
    </p>
  `, "Your order has been shipped");

  return sendEmail({
    to: order.email,
    subject: "Your order has been shipped",
    html,
    type: "order_shipped",
  });
}

export async function sendOutForDelivery(order) {
  const siteUrl = getSiteUrl();
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">Your package is out for delivery</h2>
    <p>Hi ${order.customerName},</p>
    <p>Your TrustSilcon order is out for delivery today. Please ensure someone is available to receive the package.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/track-order?order=${order.orderNumber}" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Track Delivery</a>
    </p>
  `, "Your package is out for delivery");

  return sendEmail({
    to: order.email,
    subject: "Your package is out for delivery",
    html,
    type: "out_for_delivery",
  });
}

export async function sendOrderDelivered(order) {
  const siteUrl = getSiteUrl();
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">Thank you for shopping with TrustSilcon</h2>
    <p>Hi ${order.customerName},</p>
    <p>Your order has been delivered. We hope you enjoy your premium wellness products.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/reviews?order=${order.orderNumber}" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Share Your Experience</a>
    </p>
  `, "Thank you for shopping with TrustSilcon");

  return sendEmail({
    to: order.email,
    subject: "Thank you for shopping with TrustSilcon",
    html,
    type: "order_delivered",
  });
}

export async function sendReviewRequest(order) {
  const siteUrl = getSiteUrl();
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">How was your experience?</h2>
    <p>Hi ${order.customerName},</p>
    <p>We'd love to hear about your TrustSilcon experience. Your feedback helps us improve our wellness products and service.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/reviews?order=${order.orderNumber}" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Leave a Review</a>
    </p>
  `, "Share your TrustSilcon experience");

  return sendEmail({
    to: order.email,
    subject: "How was your TrustSilcon experience?",
    html,
    type: "review_request",
  });
}

export async function sendMarketingEmail(subscriber) {
  const siteUrl = getSiteUrl();
  const token = generateUnsubscribeToken(subscriber.email);
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}&token=${token}`;

  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">New wellness arrivals from TrustSilcon</h2>
    <p>Hi${subscriber.name ? ` ${subscriber.name}` : ""},</p>
    <p>Discover our latest body-safe silicone wellness products — crafted for comfort, safety, and discreet delivery.</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${siteUrl}/shop" style="background:#0ea5e9;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Shop New Arrivals</a>
    </p>
    <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:24px;">
      <a href="${unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe from marketing emails</a>
    </p>
  `, "New wellness arrivals from TrustSilcon");

  return sendEmail({
    to: subscriber.email,
    subject: "New wellness arrivals from TrustSilcon",
    html,
    type: "marketing",
  });
}

export async function sendContactReply(lead) {
  const html = emailLayout(`
    <h2 style="color:#0ea5e9;margin:0 0 16px;">We received your message</h2>
    <p>Hi ${lead.name},</p>
    <p>Thank you for contacting TrustSilcon. Our team has received your message and will respond within 24–48 hours.</p>
    <p style="color:#64748b;font-size:13px;">Your message: "${lead.message.substring(0, 200)}${lead.message.length > 200 ? "..." : ""}"</p>
  `, "We received your message");

  return sendEmail({
    to: lead.email,
    subject: "We received your message — TrustSilcon",
    html,
    type: "contact_reply",
  });
}
