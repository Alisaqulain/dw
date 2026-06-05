import { NextResponse } from "next/server";
import { bootstrapAdminFromEnv } from "@/lib/bootstrapAdmin";

export async function POST() {
  try {
    const result = await bootstrapAdminFromEnv();
    if (result.created) {
      return NextResponse.json({
        success: true,
        message: "Admin account created from .env.local",
        email: result.email,
      });
    }
    return NextResponse.json({ error: result.error, adminCount: result.adminCount }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
