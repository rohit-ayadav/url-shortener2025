import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import Product from "@/models/Product";
import Payment from "@/models/Payment";
import { getSessionAtHome } from "@/app/api/auth/[...nextauth]/options";

await connectDB();

export async function GET() {
    try {
        const session = await getSessionAtHome();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const email = session.user?.email;
        if (!email) {
            return NextResponse.json({ success: false, message: "Email not found" }, { status: 404 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const payments = (await Payment.find({ user: user._id })).filter((p) => p.paymentFor !== 'basic' && p.paymentFor !== 'pro' && p.paymentFor !== 'enterprise' && p.status === 'paid');
        if (!payments.length) {
            return NextResponse.json({ success: false, message: "No payments found" }, { status: 404 });
        }

        console.log("\nPayments:", payments);
        // const products = await Promise.all(
        //     payments.map(async (p) => await Product.findOne({ id: p.paymentFor }))
        // );

        // console.log("\nProducts:", products);
        // Remove null values (failed lookups)
        // const purchasedProducts = products.filter((p) => p !== null);


        const product = await Product.find({ id: 'recently-funded-startup-list-of-india' });
        console.log("\nProducts:", product);
        const purchasedProducts = product.map((p) => {
            const payment = payments.find((payment) => payment.paymentFor === p.id);
            return { ...p.toObject(), date: payment?.createdAt };
        });

        console.log("\nPurchased Products:", purchasedProducts);
        if (purchasedProducts.length === 0) {
            return NextResponse.json({ success: false, message: "No products found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, payments, purchasedProducts }, { status: 200 });
    } catch (error) {
        console.error("My Purchase Error:", error);
        return NextResponse.json({ success: false, message: "My Purchase failed" }, { status: 500 });
    }
}
