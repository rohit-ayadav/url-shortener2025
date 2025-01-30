import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import { Url } from "@/models/urlShortener";
import { connectDB } from "@/utils/db";
import { ObjectId } from "mongoose";

interface Url {
    _id: ObjectId;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    created: Date;
    lastClicked: Date;
    status: 'active' | 'expired' | 'archived';
}

await connectDB();

export async function GET(request: NextRequest) {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    console.log("\n\nParams:", params);
    const { limit } = params;
    console.log("Limit:", limit);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ message: "You must be logged in to view your URLs", success: false }, { status: 401 });

    try {
        const user = await User.findOne({ email });
        if (!user) return NextResponse.json({ message: "Login required", success: false });

        let urls;
        if (limit)
            urls = await Url.find({ createdBy: user._id }).sort({ createdAt: -1 }).limit(parseInt(limit as string));
        else
            urls = await Url.find({ createdBy: user._id }).sort({ createdAt: -1 });

        const urlsData: Url[] = urls.map(url => ({
            _id: url._id as ObjectId,
            originalUrl: url.originalUrl,
            shortUrl: url.shortenURL,
            clicks: url.click,
            created: url.createdAt,
            lastClicked: new Date(),
            status: url.expireAt ? (url.expireAt < new Date() ? 'expired' : 'active') : 'active'
        }));
        const userData = user.toJSON();
        return NextResponse.json({ urls: urlsData, user: userData, success: true }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        return NextResponse.json({ message: errorMessage, success: false }, { status: 500 });
    }
}
