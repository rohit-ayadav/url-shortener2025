import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Please provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local file");
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession();
        const email = session?.user?.email;
        const { amount, currency, paymentMethod, paymentFor } = await request.json();
        if (!amount) return NextResponse.json({ success: false, message: "Amount is required" }, { status: 400 });
        if (!currency) return NextResponse.json({ success: false, message: "Currency is required" }, { status: 400 });
        if (!paymentMethod) return NextResponse.json({ success: false, message: "Payment Method is required" }, { status: 400 });
        if (!email) return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        if (!paymentFor) return NextResponse.json({ success: false, message: "Payment For is required" }, { status: 400 });

        const userId = await User.findOne({ email }).select("_id");
        if (!userId) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        // if order is not for subscription, check if user has active subscription
        if (paymentFor !== "basic" && paymentFor !== "pro" && paymentFor !== "enterprise") {
            const activeSubscription = await Payment.findOne({ user: userId, paymentFor, status: "paid" });
            if (activeSubscription) {
                return NextResponse.json({ success: false, message: "You already have been bought this product" }, { status: 400 });
            }
        }
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: true,
        });

        // delete the older order if not paid and greater than 90 minutes
        const oldOrder = await Payment.find({ user: userId, status: "pending" }).sort({ createdAt: 1 });
        if (oldOrder && oldOrder.length) {
            const oldOrderTime = oldOrder[0].createdAt.getTime();
            const currentTime = new Date().getTime();
            if (currentTime - oldOrderTime > 90 * 60 * 1000) {
                await Payment.deleteMany({ user: userId, status: "pending" });
            }
        }

        const payment = new Payment({
            user: userId,
            orderId: order.id,
            amount,
            paymentFor,
            currency,
            paymentMethod,
            status: "pending",
        });

        await payment.save();

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
        }, { status: 200 });

    } catch (error) {
        console.error("Payment Order Error:", error);
        return NextResponse.json({ success: false, message: "Payment order creation failed" }, { status: 500 });
    }
}