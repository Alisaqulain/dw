import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET() {
  const session = await getAdminSession();
  const result = {
    ok: true,
    timestamp: new Date().toISOString(),
    admin: {
      connected: !!session,
      email: session?.email || null,
      id: session?.id || null,
    },
    database: {
      connected: false,
      adminAccounts: 0,
      error: null,
    },
  };

  try {
    await connectDB();
    result.database.connected = true;
    result.database.adminAccounts = await Admin.countDocuments();
  } catch (error) {
    result.ok = false;
    result.database.error = error.message;
  }

  if (!result.admin.connected && !result.database.connected) {
    result.ok = false;
  }

  return NextResponse.json(result, {
    status: result.ok ? 200 : 503,
  });
}
