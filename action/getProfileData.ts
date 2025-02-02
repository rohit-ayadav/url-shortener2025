"use server";
import { User } from "@/models/User";
import Payment from "@/models/Payment";
import { connectDB } from "@/utils/db";
import { UserProfile } from "@/types/types";

await connectDB();

export default async function getProfileData(email: string) {
    try {
        const user = await User.findOne({ email });
        const payments = await Payment.find({ user: user._id }).sort({ createdAt: -1 });
        const profile: UserProfile = {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            subscription: {
                plan: user.subscriptionStatus,
                expiryDate: user.subscriptionExpiration,
                status: "active",
            },
            twoFactorEnabled: false,
            apiKey: "********",
            apiUsage: {
                total: 100,
                limit: 0,
            }
        };
        return JSON.stringify({ profile, payments });
    }
    catch (error) {
        console.error(error);
        return null;
    }
}
