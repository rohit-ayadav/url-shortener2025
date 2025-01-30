import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";

connectDB();

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        const user = new User({ email, password, name, provider: "credentials" });
        await user.save();
        return NextResponse.json({
            message: "Account created",
            user: {
                email: user.email,
                name: user.name,
            },
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
