import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const approvedParam = searchParams.get("approved");
    const query = {};
    if (approvedParam === "all") {
      // no filter
    } else if (approvedParam === "false") {
      query.approved = false;
    } else {
      query.approved = true;
    }
    if (productId) query.productId = productId;

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

    let avgRating = 0;
    if (productId && reviews.length > 0) {
      avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    }

    return NextResponse.json({
      reviews: JSON.parse(JSON.stringify(reviews)),
      avgRating: Math.round(avgRating * 10) / 10,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, rating, review, productId, orderNumber } = await request.json();

    if (!name || !rating || !review) {
      return NextResponse.json({ error: "Name, rating, and review are required" }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const newReview = await Review.create({
      name,
      rating,
      review,
      productId: productId || null,
      orderNumber: orderNumber || "",
      approved: false,
      verifiedBuyer: false,
    });

    if (orderNumber) {
      const order = await Order.findOne({ orderNumber, orderStatus: "delivered" });
      if (order) {
        await Review.findByIdAndUpdate(newReview._id, { verifiedBuyer: true });
        newReview.verifiedBuyer = true;
      }
    }

    return NextResponse.json({ review: newReview, message: "Review submitted for approval" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await requireAdmin();
    await connectDB();
    const { id, approved } = await request.json();

    const review = await Review.findById(id);
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    const updates = { approved };
    if (approved && review.orderNumber) {
      const order = await Order.findOne({ orderNumber: review.orderNumber });
      if (order) updates.verifiedBuyer = true;
    }

    const updated = await Review.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ review: updated });
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
    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
