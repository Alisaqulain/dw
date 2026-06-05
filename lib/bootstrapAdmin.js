import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function bootstrapAdminFromEnv() {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envEmail || !envPassword) {
    return { created: false, error: "Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local" };
  }

  await connectDB();
  const count = await Admin.countDocuments();
  if (count > 0) {
    return { created: false, error: "Admin account already exists", adminCount: count };
  }

  const admin = await Admin.create({
    email: envEmail,
    password: envPassword,
    name: "Admin",
  });

  return { created: true, email: admin.email, adminCount: 1 };
}
