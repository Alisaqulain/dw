export function verifyCronRequest(request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, error: "Cron secret not configured" };
    }
    return { ok: true };
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  return { ok: true };
}
