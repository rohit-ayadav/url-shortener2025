import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import bcrypt from "bcrypt";
import { User } from "@/models/User";
import sendEmail from "@/action/sendEmail";
import SendOtp from "@/models/SendOtp";
import crypto from "crypto";
import { generateEmailTemplate } from "@/lib/EmailTemplate";

await connectDB();

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { email, name } = await request.json();
        if (!email || !name) return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });

        if (await User.findOne({ email })) {
            return NextResponse.json({ message: 'Email already exists, please login' }, { status: 400 });
        }

        const otpCode = crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 6);
        const hashedOtp = await bcrypt.hash(otpCode, 10);

        const existingOtp = await SendOtp.findOne({ email });
        if (existingOtp && !existingOtp.isUsed) {
            await SendOtp.updateOne({ email }, { otp: hashedOtp, isUsed: false, expiredAt: new Date(Date.now() + 5 * 60 * 1000) });
        }

        // Send OTP to email
        await sendEmail({
            from: "`RUShort OTP <rohitkuyada@gmail.com>`",
            to: email,
            subject: 'OTP for signup on RUShort',
            message: `Your OTP for signup on RUShort is ${otpCode}. This code will expire in 5 minutes.`,
            html: generateEmailTemplate('otp', { otp: otpCode })
        })
        await new SendOtp({ email, otp: hashedOtp }).save();

        return NextResponse.json({ message: 'OTP sent successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong. Please try again' }, { status: 500 });
    }
}
