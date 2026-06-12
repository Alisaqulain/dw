import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "trustsilcon-dev-secret-change-in-production"
);

const DEV_FALLBACK_SECRET = "trustsilcon-dev-secret-change-in-production";

async function verifyAdminCookie(request) {
  const token = request.cookies.get("trustsilcon_admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    pathname.startsWith("/api/admin/") && pathname !== "/api/admin/login";

  if (isAdminPage || isAdminApi) {
    if (
      process.env.NODE_ENV === "production" &&
      (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEV_FALLBACK_SECRET)
    ) {
      return NextResponse.json(
        { error: "Server misconfigured: set a strong JWT_SECRET" },
        { status: 503 }
      );
    }

    const ok = await verifyAdminCookie(request);
    if (!ok) {
      if (isAdminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
