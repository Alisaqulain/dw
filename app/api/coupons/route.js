import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/auth";
import { calculateDiscount } from "@/lib/utils";

export async function POST(request) {
  try {
    await connectDB();
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }
    if (subtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { error: `Minimum order ₹${coupon.minOrderAmount} required` },
        { status: 400 }
      );
    }

    const discount = calculateDiscount(subtotal, coupon);
    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
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
    const body = await request.json();
    const { id, ...updates } = body;

    const coupon = await Coupon.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ coupon });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Admin create coupon
export async function PATCH(request) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await request.json();
    const coupon = await Coupon.create({ ...body, code: body.code.toUpperCase() });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
