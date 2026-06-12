import { NextResponse } from "next/server";
import { bootstrapAdminFromEnv } from "@/lib/bootstrapAdmin";

export async function POST(request) {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET?.trim();
    const authHeader = request.headers.get("authorization");

    if (!setupSecret) {
      return NextResponse.json(
        { error: "Admin setup is disabled. Set ADMIN_SETUP_SECRET or log in at /admin/login." },
        { status: 403 }
      );
    }

    if (authHeader !== `Bearer ${setupSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await bootstrapAdminFromEnv();
    if (result.created) {
      return NextResponse.json({
        success: true,
        message: "Admin account created from environment variables",
        email: result.email,
      });
    }
    return NextResponse.json({ error: result.error, adminCount: result.adminCount }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
