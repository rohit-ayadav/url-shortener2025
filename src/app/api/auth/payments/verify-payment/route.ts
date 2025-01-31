import { NextRequest, NextResponse } from "next/server";
import Payment from "@/models/Payment";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";

interface Payment {
    orderId: string;
    paymentId: string;
    signature: string;
    plan: string;
}

await connectDB();

export async function POST(request: NextRequest) {
    const { orderId, paymentId, signature, plan } = await request.json() as Payment;
    try {
        const payment = new Payment({ orderId, paymentId, signature, plan });
        await payment.save();
        return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}