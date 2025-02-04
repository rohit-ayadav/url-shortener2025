"use server";

import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import { Url } from "@/models/urlShortener";
import generateShortURL from "@/app/api/urlshortener/generateShortURL";
import { isValidURL } from "@/utils/utils";
import { getServerSession } from "next-auth";

await connectDB();

const ORIGIN = "rushort.site";
const CONFIG = {
    BASE_DOMAINS: [
        "http://localhost:3000",
        "https://resourcesandcarrier.online",
        "https://www.rushort.site"
    ],
    SHORT_URL_LENGTH: 4,
    MAX_ATTEMPTS: 10
} as const;

interface BulkShortResult {
    error?: string;
    invalidUrls?: string[];
    shortenedURLs?: { original: string; shortened: string; createdAt?: string; expiresAt?: string }[];
}

export default async function BulkShort(urlList: string[], prefix: string = "", length: number = CONFIG.SHORT_URL_LENGTH, expirationDate: Date | null = null): Promise<BulkShortResult> {
    const shortenedURLs: { original: string; shortened: string; createdAt?: string; expiresAt?: string }[] = [];
    const invalidUrls: string[] = [];

    // Check for expiry date, cannot be in the past and more then 90 days, say to take a premium plan
    if (expirationDate) {
        const now = new Date();
        const ninetyDays = new Date(now.setDate(now.getDate() + 90));
        if (expirationDate < new Date() || expirationDate > ninetyDays) {
            return { error: "Expiration date must be in the future and less than 90 days", invalidUrls, shortenedURLs };
        }
    } else expirationDate = new Date(new Date().setDate(new Date().getDate() + 90));

    try {
        // Validate URLs
        urlList.forEach(url => {
            if (!isValidURL(url.trim())) invalidUrls.push(url);
        });

        if (invalidUrls.length > 0) {
            return { error: "Invalid URLs", invalidUrls, shortenedURLs };
        }

        // Authenticate user
        const session = await getServerSession();
        const email = session?.user?.email;
        if (!email) return { error: "You must be logged in to shorten URLs", invalidUrls, shortenedURLs };

        const user = await User.findOne({ email });
        if (!user) return { error: "Login required", invalidUrls, shortenedURLs };

        const remainingQuota = user.monthlyQuotaLimit - user.monthlyQuotaUsed;
        if (user.subscriptionStatus !== "premium" && urlList.length > remainingQuota) {
            return { error: "Monthly Quota exceeded, Kindly upgrade to premium", invalidUrls, shortenedURLs };
        }

        let successfulShortens = 0;
        for (const url of urlList) {
            // Check if URL already exists
            const existingUrl = await Url.findOne({ originalUrl: url, createdBy: user._id });
            if (existingUrl) {
                shortenedURLs.push({ original: url, shortened: `${ORIGIN}/${existingUrl.shortenURL}`, createdAt: existingUrl.createdAt.toISOString(), expiresAt: existingUrl.expireAt?.toISOString() });
                continue;
            }

            // If URL is from base domains, return as is
            if (CONFIG.BASE_DOMAINS.some(domain => url.startsWith(domain))) {
                shortenedURLs.push({ original: url, shortened: url });
                continue;
            }

            // Generate unique short URL
            let shortenURL;
            let attempts = 0;
            do {
                shortenURL = prefix + generateShortURL.generateShortUrl({ length });
                attempts++;
            } while (await Url.findOne({ shortenURL, createdBy: user._id }) && attempts < CONFIG.MAX_ATTEMPTS);

            if (attempts === CONFIG.MAX_ATTEMPTS) {
                return { error: "Failed to generate unique short URL", invalidUrls, shortenedURLs };
            }

            // Save new short URL
            const createdAt = new Date();
            await Url.create({
                originalUrl: url,
                shortenURL,
                createdBy: user._id,
                click: 0,
                createdAt,
                expiresAt: expirationDate ? new Date(expirationDate) : undefined
            });

            shortenedURLs.push({ original: url, shortened: `${ORIGIN}/${shortenURL}`, createdAt: createdAt.toISOString(), expiresAt: expirationDate ? expirationDate.toISOString() : undefined });
            successfulShortens++;
        }

        // Update user quota usage atomically
        if (successfulShortens > 0) {
            await User.updateOne({ email }, { $inc: { monthlyQuotaUsed: successfulShortens } });
        }

        return { shortenedURLs };
    } catch (error) {
        console.error("BulkShort Error:", error);
        return { error: "An error occurred while processing your request." };
    }
}