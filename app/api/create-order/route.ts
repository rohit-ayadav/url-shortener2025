import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "",
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
    const { amount, currency, paymentMethod } = await request.json();
    try {
        const order = await razorpay.orders.create({
            amount,
            currency,
            receipt: "receipt#1",
            payment_capture: true,
        });
        console.log(order);
        return NextResponse.json({
            success: true,
            orderid: order.id,
            amount: order.amount,
        }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
