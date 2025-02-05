import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Payment from "@/models/Payment";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

await connectDB();

export async function POST(request: NextRequest) {
    try {
        const { orderId, paymentId, signature, plan, email } = await request.json();

        if (!orderId || !paymentId || !signature || !email) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }
        if (!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ success: false, message: "Razorpay Key Secret not found" }, { status: 400 });

        // Fetch payment from DB
        const payment = await Payment.findOne({ orderId });
        const product = await Product.findOne({ id: plan });
        if (!payment) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        // Verify Razorpay Signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
        if (generatedSignature !== signature) {
            throw new Error("Invalid Signature");
        }

        // Update Payment Status in DB
        payment.paymentId = paymentId;
        payment.status = "paid";
        payment.razorpaySignature = signature;
        payment.date = new Date();
        payment.paymentFor = plan;
        payment.validity = (plan === 'basic' || plan === 'pro' || plan === 'enterprise') ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
        payment.paymentMethod = "Razorpay";
        await payment.save();

        // Upgrade User to Premium
        await User.findOneAndUpdate({ email }, {
            subscriptionStatus: plan,
            subscriptionExpiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            monthlyQuotaLimit: plan === "basic" ? 500 : 1000,
        });

        return NextResponse.json({
            success: true,
            message: "Payment Verified Successfully",
            plan,
            payment,
        }, { status: 200 });
    } catch (error) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({
            success: false,
            message: `Payment Verification Error, if you have paid and still seeing this error, please contact support`
        }, { status: 500 });
    }
}