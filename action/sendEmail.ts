"use server";

import nodemailer from "nodemailer";

interface EmailParams {
    from: string;
    to: string;
    subject: string;
    message?: string;
    html: string;
}

const sendEmail = async ({ from, to, subject, message, html }: EmailParams) => {
    from = from || '"RUShort" <rohitkuyada@gmail.com>';

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (!smtpHost || !smtpUser || !smtpPassword) {
        return { message: "SMTP configuration is missing", error: "SMTP configuration is missing" };
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

    try {
        const uniqueId = Date.now();
        const info = await transporter.sendMail({
            from: '"RUShort" <rohitkuyada@gmail.com>',
            to: to,
            subject: subject,
            text: message,
            html: html,
            messageId: uniqueId.toString(),

            headers: {
                "X-Entity-Ref-ID": uniqueId.toString(),
                "X-Entity-Ref-Type": "email",
            },
            date: new Date(),
        });
        console.log(`\n\nInfo: ${JSON.stringify(info)}\n\n`);

    } catch (error) {
        console.error("Error sending email:", error);
        return { message: "Email sending failed", error: error };
    }

    return { message: "Email sent successfully", error: "" };
};

export default sendEmail;
export { sendEmail };