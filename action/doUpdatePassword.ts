"use server";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";

await connectDB();
export async function doUpdatePassword(currentPassword: string, newPassword: string, email: string) {
    if (!email) {
        return {
            success: "",
            error: "Email is required"
        }
    }
    console.log(`\n\nEmail: ${email}\n\nPassword: ${currentPassword}\n\nNew Password: ${newPassword}\n\n`);
    if (currentPassword === newPassword) {
        return {
            success: "",
            error: "New password cannot be same as current password"
        }
    }
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: "",
            error: "User not found"
        }
    }
    const isValid = await user.comparePassword(currentPassword);
    console.log(`\n\nPassword Match: ${isValid}\n\n`);
    if (isValid) {
        user.password = newPassword;
        await user.save();
        console.log("Password updated successfully");
        return {
            success: "Password reset successfully.",
            error: ""
        }
    } else {
        return {
            success: "",
            error: "Invalid current password"
        }
    }
}