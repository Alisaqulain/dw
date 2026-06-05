import { NextResponse } from "next/server";
import { removeAdminCookie, getAdminSession } from "@/lib/auth";

export async function POST() {
  await removeAdminCookie();
  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getAdminSession();
  return NextResponse.json({ authenticated: !!session, admin: session || null });
}
