import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/Payment";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";

await connectDB();

export async function POST(request: NextRequest) {
    try {
        const { orderId, paymentId, signature, plan, email } = await request.json();

        console.log(`Payment Verification: 
            Order ID: ${orderId}
            Payment ID: ${paymentId}
            Signature: ${signature}
            Plan: ${plan}
            Email: ${email}
        `);

        if (!orderId || !paymentId || !signature || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }
        if (!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ success: false, message: "Razorpay Key Secret not found" }, { status: 400 });

        // Fetch payment from DB
        const payment = await Payment.findOne({ orderId });
        if (!payment) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        // Verify Razorpay Signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (generatedSignature !== signature) {
            return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
        }

        // Update Payment Status in DB
        payment.paymentId = paymentId;
        payment.status = "paid";
        payment.razorpaySignature = signature;
        payment.date = new Date();
        await payment.save();

        // Upgrade User to Premium
        await User.findOneAndUpdate({ email }, {
            subscriptionStatus: plan,
            subscriptionExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            monthlyQuotaLimit: plan === "basic" ? 500 : 1000,
        });

        return NextResponse.redirect("/dashboard");
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({
            success: false,
            message: `Payment Verification Error, if you have paid and still seeing this error, please contact support`
        }, { status: 500 });
    }
}
