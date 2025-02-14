"use server";
import { getSessionAtHome } from "@/app/api/auth/[...nextauth]/options";
import { User } from "@/models/User";
import Payment from "@/models/Payment";
import startupData from '@/app/api/products/startupList1.json';
import Product from "@/models/Product";
import { connectDB } from "@/utils/db";

await connectDB();

const isAlreadyPurchased = async (id: string) => {
    const session = await getSessionAtHome();
    if (!session) {
        return { success: false, message: "Unauthorized" };
    }
    if (id === 'basic' || id === 'pro' || id === 'enterprise') {
        return { success: false, message: "Product not found" };
    }

    const email = session.user?.email;
    const user = await User.findOne({ email });
    if (!user) {
        return { success: false, message: "User not found" };
    }

    const payments = (await Payment.find({ user: user._id })).filter((p) => p.paymentFor !== 'basic' && p.paymentFor !== 'pro' && p.paymentFor !== 'enterprise');
    if (!payments.length) {
        return { success: false, message: "No payments found" };
    }

    const payment = payments.find((p) => {
        p.paymentFor === id && p.status === 'paid' && p.user.toString() === user._id.toString();
    }
    );
    if (!payment) {
        return { success: false, message: "Product not purchased" };
    }

    return { success: true };
}

export default isAlreadyPurchased;