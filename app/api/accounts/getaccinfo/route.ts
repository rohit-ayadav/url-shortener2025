import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import Payment from "@/models/Payment";
import { connectDB } from "@/utils/db";
import { UserProfile } from "@/types/types";

await connectDB();

export async function POST(request: NextRequest) {
    const { email } = await request.json();
    if (!email) {
        return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });
        const profileResponse: UserProfile = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            subscription: {
                plan: user.subscriptionStatus,
                expiryDate: user.subscriptionExpiration || new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
                status: "active",
            },
            twoFactorEnabled: false,
            apiKey: "********",
            apiUsage: {
                total: 100,
                limit: 1000,
            }
        };
        const paymentsResponse = payments.map(payment => ({
            _id: payment._id.toString(),
            date: payment.createdAt,
            orderId: payment.orderId,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            description: payment.paymentMethod,
        }));
        return NextResponse.json({ profileResponse, paymentsResponse });
    }
    catch (error) {
        console.error(error);
        return null;
    }
}