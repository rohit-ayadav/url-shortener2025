import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import SendOtp from "@/models/SendOtp";
import bcrypt from "bcrypt";
import sendEmail from "@/action/sendEmail";
import { generateEmailTemplate } from "@/lib/EmailTemplate";

connectDB();

export async function POST(req: NextRequest) {
    if (!req.body) {
        return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const { email, password, name, otp } = await req.json();
    if (!email || !password || !name || !otp) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }
        const userOtp = await SendOtp.findOne({ email });
        if (!userOtp || userOtp.isUsed) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }
        const now = new Date();
        if (now > userOtp.expiredAt) {
            return NextResponse.json({ message: "OTP expired" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(otp, userOtp.otp);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }
        userOtp.isUsed = true;
        await userOtp.save();
        const user = new User({ email, password, name, provider: "credentials" });
        await user.save();
        sendEmail({
            from: "RUShort <rohitkuyada@gmail.com>",
            to: user.email,
            subject: "Welcome to RUShort",
            message: "Welcome to RUShort",
            html: generateEmailTemplate("welcome", { name: user.name }),
        });

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
