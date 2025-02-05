import { NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import Payment from "@/models/Payment";

await connectDB();

export async function GET() {
    try {
        // await Payment.deleteMany({});
        // await Product.deleteMany({});
        // console.log("Deleted Products");
        // const productDocs = await Product.insertMany(products);
        // console.log("Inserted Products:", productDocs);
        // return NextResponse.json({ success: true, products: productDocs });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false });
    }
}

const products = [
    {
        id: "basic",
        name: "Basic Plan",
        description: "Basic subscription for RUShort with essential features.",
        price: 99,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "pro",
        name: "Pro Plan",
        description: "Pro subscription with advanced features.",
        price: 299,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "enterprise",
        name: "Enterprise Plan",
        description: "Enterprise-level subscription with all features unlocked.",
        price: 999,
        currency: "INR",
        visibility: "paid",
    },
    {
        id: "recently-funded-startup-list-of-india",
        name: "Recently Funded Startup List of India",
        description: "A curated list of recently funded startups in India.",
        price: 499,
        currency: "INR",
        visibility: "paid",
    },
];
