"use server";
import { PaymentHistory } from "@/types/types";
import { connectDB } from "@/utils/db";
import Payment from "@/models/Payment";
import { User } from "@/models/User";

await connectDB();

const getPaymentHistory = async (email: string): Promise<PaymentHistory[]> => {
    try {
        if (!email) {
            console.log(`\n\nEmail is required\n\n`);
            return [];
        }
        // console.log("\n\nEmail:", email);
        const user = await User.findOne({ email });
        // console.log("\n\nUser ID:", user);
        const payments = await Payment.find({ user: user._id }).sort({ date: -1 });
        // console.log("\n\nPayment History:", payments);
        return payments.map((payment) => ({
            id: payment._id.toString(),
            date: payment.date.toISOString(),
            amount: payment.amount,
            status: payment.status,
            description: payment.paymentMethod,
        }));
    } catch (error) {
        console.error("Error fetching payment history:", error);
        return [];
    }
}

export { getPaymentHistory };