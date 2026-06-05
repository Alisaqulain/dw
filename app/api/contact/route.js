import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ContactLead from "@/models/ContactLead";
import { requireAdmin } from "@/lib/auth";
import { sendContactReply } from "@/lib/email";
import { validateEmail } from "@/lib/utils";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const lead = await ContactLead.create({ name, email, phone, subject, message });
    sendContactReply(lead).catch(console.error);

    return NextResponse.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const leads = await ContactLead.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ leads });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, status } = await request.json();
    const lead = await ContactLead.findByIdAndUpdate(id, { status }, { new: true });
    return NextResponse.json({ lead });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
