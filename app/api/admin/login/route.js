import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { createAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    // Auto-create admin from env if none exists
    let admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      const envEmail = process.env.ADMIN_EMAIL;
      const envPassword = process.env.ADMIN_PASSWORD;
      if (envEmail && envPassword && email.toLowerCase() === envEmail.toLowerCase() && password === envPassword) {
        admin = await Admin.create({ email: envEmail.toLowerCase(), password: envPassword, name: "Admin" });
      } else {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    } else {
      const isValid = await admin.comparePassword(password);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }

    const token = await createAdminToken({ id: admin._id.toString(), email: admin.email });
    await setAdminCookie(token);

    return NextResponse.json({ success: true, admin: { email: admin.email, name: admin.name } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
