import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";

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

        const { amount, currency, paymentMethod, email } = await request.json();
        if (!amount || !currency || !paymentMethod || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const userId = await User.findOne({ email }).select("_id");
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency,
            receipt: `receipt_${Date.now()}`,
            payment_capture: true,
        });

        const payment = new Payment({
            user: userId,
            orderId: order.id,
            amount,
            currency,
            paymentMethod,
            status: "pending",
        });
        console.log("Payment:", payment);
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