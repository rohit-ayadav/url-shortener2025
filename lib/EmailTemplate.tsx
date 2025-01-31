import { format } from 'date-fns';

interface EmailData {
    name?: string;
    email?: string;
    otp?: string;
    datetime?: string;
    device?: string;
    location?: string;
    ip?: string;
    verifyUrl?: string;
    resetUrl?: string;
    secureUrl?: string;
}

interface TemplateConfig {
    subject: string;
    title: string;
    subtitle: string;
}

const templates: Record<string, TemplateConfig> = {
    welcome: {
        subject: "Welcome to RUShort! 🚀",
        title: "Welcome to RUShort",
        subtitle: "Your Ultimate URL Shortening Solution"
    },
    otp: {
        subject: "Your Verification Code",
        title: "Verify Your Account",
        subtitle: "Enter this code to complete your verification"
    },
    newLogin: {
        subject: "New Login Alert",
        title: "New Device Login",
        subtitle: "We detected a new login to your account"
    },
    resetPassword: {
        subject: "Reset Your Password",
        title: "Password Reset Request",
        subtitle: "Follow the instructions to reset your password"
    }
};

const getBaseTemplate = (content: string, config: TemplateConfig) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.title}</title>
    <style>
        /* Reset */
        body, p, div, h1, h2, h3, h4, h5, h6 {
            margin: 0;
            padding: 0;
        }
        body {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
        }
        table {
            border-spacing: 0;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #7c3aed;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
        }
        .red-button {
            background-color: #dc2626;
        }
    </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f7f7f7;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; background: linear-gradient(to right, #7c3aed, #6366f1); text-align: center;">
                            <img src="https://www.rushort.site/android-chrome-512x512.png" alt="RUShort Logo" width="150" style="margin-bottom: 24px;">
                            <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">${config.title}</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px;">${config.subtitle}</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f7f7f7; padding: 24px; text-align: center;">
                            <p style="margin-bottom: 16px;">
                                <a href="https://www.rushort.site/" style="color: #6b7280; text-decoration: none; margin: 0 12px;">Website</a>
                                <a href="https://www.rushort.site/contact" style="color: #6b7280; text-decoration: none; margin: 0 12px;">Help Center</a>
                                <a href="https://www.rushort.site/contact" style="color: #6b7280; text-decoration: none; margin: 0 12px;">Contact</a>
                            </p>
                            <p style="color: #9ca3af; font-size: 14px;">
                                © ${new Date().getFullYear()} RUShort. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const getWelcomeContent = (data: EmailData) => `
<div>
    <p style="color: #374151; margin-bottom: 24px;">Hi ${data.name || 'there'},</p>
    <p style="color: #374151; margin-bottom: 24px;">
        Welcome to RUShort! We're excited to have you on board. With RUShort, you can:
    </p>
    <ul style="list-style: none; padding: 0; margin: 0 0 24px 0;">
        <li style="color: #374151; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="width: 8px; height: 8px; background-color: #7c3aed; border-radius: 50%; margin-right: 12px;"></span>
            Create short, memorable URLs in seconds
        </li>
        <li style="color: #374151; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="width: 8px; height: 8px; background-color: #7c3aed; border-radius: 50%; margin-right: 12px;"></span>
            Track detailed analytics for your links
        </li>
        <li style="color: #374151; margin-bottom: 12px; display: flex; align-items: center;">
            <span style="width: 8px; height: 8px; background-color: #7c3aed; border-radius: 50%; margin-right: 12px;"></span>
            Customize your shortened URLs
        </li>
    </ul>
    <div style="text-align: center;">
        <a href="${data.verifyUrl || '#'}" class="button">Get Started</a>
    </div>
</div>
`;

const getOTPContent = (data: EmailData) => `
<div>
    <p style="color: #374151; margin-bottom: 24px;">Hi ${data.name || 'there'},</p>
    <p style="color: #374151; margin-bottom: 24px;">
        Please use the following code to verify your account:
    </p>
    <div style="background-color: #f7f7f7; padding: 24px; border-radius: 8px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 4px; color: #7c3aed;">
            ${data.otp || '123456'}
        </div>
        <div style="color: #6b7280; font-size: 14px; margin-top: 8px;">
            This code will expire in 10 minutes
        </div>
    </div>
    <p style="color: #6b7280; font-size: 14px;">
        If you didn't request this code, please ignore this email.
    </p>
</div>
`;

const getNewLoginContent = (data: EmailData) => `
<div>
    <p style="color: #374151; margin-bottom: 24px;">Hi ${data.name || 'there'},</p>
    <p style="color: #374151; margin-bottom: 24px;">
        We detected a new login to your RUShort account. Here are the details:
    </p>
    <div style="background-color: #f7f7f7; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
        <table width="100%" cellpadding="8" cellspacing="0">
            <tr>
                <td style="color: #6b7280;">Date & Time:</td>
                <td style="color: #374151; font-weight: 500; text-align: right;">${data.datetime || 'March 15, 2025 10:30 AM'}</td>
            </tr>
            <tr>
                <td style="color: #6b7280;">Device:</td>
                <td style="color: #374151; font-weight: 500; text-align: right;">${data.device || 'Nokia 3310'}</td>
            </tr>
            <tr>
                <td style="color: #6b7280;">Location:</td>
                <td style="color: #374151; font-weight: 500; text-align: right;">${data.location || 'New York, USA'}</td>
            </tr>
            <tr>
                <td style="color: #6b7280;">IP Address:</td>
                <td style="color: #374151; font-weight: 500; text-align: right;">${data.ip || '192.168.1.1'}</td>
            </tr>
        </table>
    </div>
    <div style="text-align: center;">
        <a href="${data.secureUrl || 'https://www.rushort.site/settings'}" class="button red-button">Secure My Account</a>
    </div>
</div>
`;

const getResetPasswordContent = (data: EmailData) => `
<div>
    <p style="color: #374151; margin-bottom: 24px;">Hi ${data.name || 'there'},</p>
    <p style="color: #374151; margin-bottom: 24px;">
        We received a request to reset your password. Click the button below to create a new password:
    </p>
    <div style="text-align: center; margin-bottom: 24px;">
        <a href="${data.resetUrl || '#'}" class="button">Reset Password</a>
    </div>
    <p style="color: #6b7280; font-size: 14px;">
        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
    </p>
</div>
`;

export const generateEmailTemplate = (type: 'welcome' | 'otp' | 'newLogin' | 'resetPassword', data: EmailData) => {
    const template = templates[type];
    let content = '';

    switch (type) {
        case 'welcome':
            content = getWelcomeContent(data);
            break;
        case 'otp':
            content = getOTPContent(data);
            break;
        case 'newLogin':
            content = getNewLoginContent(data);
            break;
        case 'resetPassword':
            content = getResetPasswordContent(data);
            break;
    }

    return getBaseTemplate(content, template);
};

// Usage example:
/*
const emailHtml = generateEmailTemplate('welcome', {
  name: 'John Doe',
  email: 'john@example.com',
  verifyUrl: 'https://rushort.com/verify/123'
});
*/