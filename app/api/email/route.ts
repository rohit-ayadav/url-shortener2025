import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";


const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

if (!smtpHost || !smtpUser || !smtpPassword) {
    throw new Error("Missing required SMTP environment variables");
}

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    auth: {
        user: smtpUser,
        pass: smtpPassword,
    },
});

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message } = await request.json();


        if (!to || !subject || !message) {
            return new Response("Missing required fields", { status: 400 });
        }


        const info = await transporter.sendMail({
            from: '"Rohit Kumar" <rohitkuyada@gmail.com>',
            to: to,
            subject: "Hello ✔",
            text: "Hello world?",
            html: "<b>Hello world?</b>",
        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log(info);
        console.log("Message sent: %s", info.messageId);


        return NextResponse.json({ success: true });
    } catch (error) {

        console.error("Error sending email:", error);


        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
