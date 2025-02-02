"use server";
import { Url } from "@/models/urlShortener";
import { User } from "@/models/User";
import { connectDB } from "@/utils/db";

await connectDB();

async function getClickAnalytics(email: string | undefined) {
    if (!email) {
        console.log(`\n\nEmail is required\n\n`);
        return;
    }
    try {
        // Return Total Shorten by user and total click 
        const user = await User.findOne({ email });
        const urls = await Url.find({ createdBy: user?._id });
        const totalShorten = urls.length;
        let totalClick = 0;
        urls.forEach((url) => {
            totalClick += url.click;
        });
        const subscriptionStatus = user?.subscriptionStatus;
        const subscriptionExpiration = user?.subscriptionExpiration;
        const monthlyQuotaUsed = user?.monthlyQuotaUsed;
        const monthlyQuotaLimit = user?.monthlyQuotaLimit;
        const response = {
            totalShorten,
            totalClick,
            subscriptionExpiration,
            subscriptionStatus,
            monthlyQuotaLimit,
            monthlyQuotaUsed,
        }
        return response;
    } catch (err) {
        console.log(err);
    }
}

export default getClickAnalytics;