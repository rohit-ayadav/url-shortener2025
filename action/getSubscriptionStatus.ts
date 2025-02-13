// This function will be used for getting subscription information of the user.
"use server";
import { connectDB } from "@/utils/db"
import { User } from "@/models/User"
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function getSubscriptionStatus() {
    try {
        const session = await getSessionAtHome();
        const email = session?.user?.email;
        if (!email) return { message: "You must be logged in to get subscription status", success: false };
        const user = await User.findOne({ email });
        if (!user) return { message: "User not found", success: false };
        return { subscriptionStatus: user.subscriptionStatus, subscriptionExpiration: user.subscriptionExpiration, success: true };
    } catch (error: any) {
        return { message: error.message, success: false };
    }
}