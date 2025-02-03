// Server action to get the profile info of the user by email

"use server";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";
import { Url } from "@/models/urlShortener";
import { ObjectId } from "mongoose";
import { getServerSession } from "next-auth";

interface ProfileProps {
    user: {
        name: string;
        email: string;
        image: string;
        joinDate: string;
        isPremium: boolean;
        totalUrls: number;
        totalClicks: number;
    };
    urls: {
        id: string;
        originalUrl: string;
        shortUrl: string;
        clicks: number;
        createdAt: string;
    }[];
}

interface Response {
    message: string;
    error: string;
    data: ProfileProps | null;
}

export async function getProfileInfo(email: string): Promise<Response> {
    await connectDB();
    console.log("email", email);
    console.log(`The server is running in ${process.env.NODE_ENV} mode`);
    if (!email) {
        return { message: "Email is required", error: "Email is required", data: null };
    }
    // const session = await getSessionAtHome();
    let session;
    try {
        session = await getServerSession();

        if (!session) {
            return { message: "Unauthorized", error: "Unauthorized", data: null };
        }
        if (!session.user) {
            return { message: "Unauthorized", error: "Unauthorized", data: null };
        }
        if (session.user.email !== email) {
            return { message: "Unauthorized", error: "Unauthorized", data: null };
        }
    } catch (error) {
        console.log("\n\n\nError", error);
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return { message: "User not found", error: "User not found", data: null };
        }
        const urls: { _id: ObjectId; originalUrl: string; shortenURL: string; click: number; createdAt: Date }[] = await Url.find({ createdBy: user._id });
        const totalUrls = urls.length;
        let totalClicks = 0;
        urls.forEach((url) => {
            totalClicks += url.click;
        });

        const response = {
            message: "Success",
            error: "",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                    image: session?.user?.image || "",
                    joinDate: user.createdAt.toISOString(),
                    isPremium: user.subscriptionStatus === "premium",
                    totalUrls,
                    totalClicks,
                },
                urls: urls.map((url) => ({
                    id: url._id.toString(),
                    originalUrl: url.originalUrl,
                    shortUrl: url.shortenURL,
                    clicks: url.click,
                    createdAt: url.createdAt.toISOString(),
                })),
            },
        };
        return response;

    }
    catch (error) {
        return { message: "Error", error: (error as Error).message, data: null };
    }
}