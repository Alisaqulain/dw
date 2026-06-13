import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import EmailSubscriber from "@/models/EmailSubscriber";
import {
  generateOrderNumber,
  calculateDiscount,
  getDeliveryCharge,
  validateEmail,
  validatePhone,
  validatePincode,
} from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { sendOrderConfirmationSMS } from "@/lib/sms";
import AbandonedCart from "@/models/AbandonedCart";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const {
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      items,
      paymentMethod,
      couponCode,
      marketingOptIn,
      sessionId,
    } = body;

    if (!customerName || !phone || !address || !city || !state || !pincode) {
      return NextResponse.json({ error: "Name, phone, address, city, state and pincode are required" }, { status: 400 });
    }
    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (!validatePhone(phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }
    if (!validatePincode(pincode)) {
      return NextResponse.json({ error: "Invalid pincode" }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.active) {
        return NextResponse.json({ error: `Product not available: ${item.name}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}. Only ${product.stock} left.` },
          { status: 400 }
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || "",
        color: item.color || "",
        size: item.size || "",
      });
      subtotal += product.price * item.quantity;
    }

    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      appliedCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });
      if (!appliedCoupon) {
        return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
      }
      if (appliedCoupon.expiresAt && new Date(appliedCoupon.expiresAt) < new Date()) {
        return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
      }
      if (appliedCoupon.maxUses > 0 && appliedCoupon.usedCount >= appliedCoupon.maxUses) {
        return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
      }
      if (subtotal < appliedCoupon.minOrderAmount) {
        return NextResponse.json(
          { error: `Minimum order amount ₹${appliedCoupon.minOrderAmount} required for this coupon` },
          { status: 400 }
        );
      }
      discount = calculateDiscount(subtotal, appliedCoupon);
    }

    const deliveryCharge = getDeliveryCharge(subtotal - discount);
    const total = subtotal - discount + deliveryCharge;
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerName,
      phone,
      email: email ? email.toLowerCase() : "",
      address,
      city,
      state,
      pincode,
      items: orderItems,
      subtotal,
      deliveryCharge,
      discount,
      couponCode: appliedCoupon?.code || "",
      total,
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "confirmed",
      marketingOptIn: !!marketingOptIn,
    });

    // Update stock and sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, salesCount: item.quantity },
      });
    }

    if (appliedCoupon) {
      await Coupon.findByIdAndUpdate(appliedCoupon._id, { $inc: { usedCount: 1 } });
    }

    // Email subscriber
    if (marketingOptIn && email) {
      await EmailSubscriber.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          email: email.toLowerCase(),
          name: customerName,
          marketingOptIn: true,
          unsubscribed: false,
          source: "checkout",
        },
        { upsert: true, new: true }
      );
    }

    // Send confirmation email/SMS (non-blocking)
    if (email) sendOrderConfirmation(order).catch(console.error);
    sendOrderConfirmationSMS(phone, order.orderNumber, order.total).catch(console.error);

    // Mark abandoned cart as converted
    if (sessionId) {
      AbandonedCart.findOneAndUpdate({ sessionId }, { converted: true }).catch(console.error);
    }

    // Shiprocket shipment is created manually by admin after COD confirmation

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: order.orderNumber,
        total: order.total,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber");
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number required" }, { status: 400 });
    }

    const query = { orderNumber };
    if (phone) query.phone = phone;
    if (email) query.email = email.toLowerCase();

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found. Check your order ID and phone/email." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
