import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import Product from "@/models/Product";
import Payment from "@/models/Payment";
import { getSessionAtHome } from "@/auth";
import startupData from '@/app/api/products/startupList1.json';

await connectDB();

export async function GET(request: NextRequest) {
    // get product id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    if (!id) {
        return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }
    try {
        const session = await getSessionAtHome();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const email = session.user?.email;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const payments = (await Payment.find({ user: user._id })).filter((p) => p.paymentFor !== 'basic' && p.paymentFor !== 'pro' && p.paymentFor !== 'enterprise');
        if (!payments.length) {
            return NextResponse.json({ success: false, message: "No payments found" }, { status: 404 });
        }

        const product = await Product.findOne({ id });
        // if (!product) {
        //     return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        // }

        const payment = payments.find((p) => {
            p.paymentFor === id && p.status === 'paid' && p.user.toString() === user._id.toString();
        }
        );
        if (!payment) {
            return NextResponse.json({ success: false, message: "Product not purchased" }, { status: 404 });
        }
        if (id === 'basic' || id === 'pro' || id === 'enterprise') {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        if (id === 'recently-funded-startup-list-of-india') {
            const data = startupData["recently-funded-startup-list-of-india"];
            return NextResponse.json({ success: true, data }, { status: 200 });
        }
        return NextResponse.json({ success: true, product }, { status: 200 });
    }
    catch (error) {
        console.error("My Purchase Error:", error);
        return NextResponse.json({ success: false, message: "My Purchase failed" }, { status: 500 });
    }
}