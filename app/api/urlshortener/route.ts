import { connectDB } from "@/utils/db";
import { Url } from "@/models/urlShortener";
import { NextRequest, NextResponse } from "next/server";
import generateShortUrl from "./generateShortURL";
import { getServerSession } from "next-auth";
import { User } from "@/models/User";
import rateLimit from "@/utils/rate-limit";

await connectDB();

const ORIGIN = "https://rushort.site";
const CONFIG = {
  BASE_DOMAINS: ["http://localhost:3000", "https://resourcesandcarrier.online", "https://www.resourcesandcarrier.online", "https://www.rushort.site", "https://rushort.site"],
  SHORT_URL_LENGTH: 4,
  MAX_ATTEMPTS: 10
} as const;

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  const email = session?.user?.email;

  // Rate Limiting for Guests
  if (!email) {
    const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success, limit, reset, remaining } = await rateLimit.limit(ip);
    if (!success) {
      return NextResponse.json({
        message: "Rate limit exceeded. Please login for higher limits.",
        success: false
      }, { status: 429 });
    }
  }

  try {
    const { originalUrl, alias, prefix, length, expirationDate } = await request.json();

    if (!originalUrl) return NextResponse.json({ message: "Provide original URL", success: false }, { status: 400 });
    if (!isValidUrl(originalUrl)) return NextResponse.json({ message: "Invalid URL", success: false }, { status: 400 });
    if ((prefix?.length ?? 0) + (alias?.length ?? 0) + (length ?? 0) > 32)
      return NextResponse.json({ message: "Combined length must not exceed 32 characters", success: false }, { status: 400 });

    if (!prefix && !alias && !length)
      return NextResponse.json({ message: "Provide prefix, alias, or length", success: false }, { status: 400 });

    if (CONFIG.BASE_DOMAINS.some(domain => originalUrl.startsWith(domain)))
      return NextResponse.json({ message: "Cannot shorten this website's URL", success: true, shortenURL: originalUrl }, { status: 200 });

    if (expirationDate && new Date(expirationDate) < new Date()) return NextResponse.json({ message: "Expiration date must be in the future", success: false }, { status: 400 });

    if (alias?.includes(" ") || prefix?.includes(" "))
      return NextResponse.json({ message: "Alias or prefix must not contain whitespace", success: false }, { status: 400 });

    let user;
    let createdBy = null;

    if (email) {
      user = await User.findOne({ email });
      if (user) {
        const existingUrl = await Url.findOne({ originalUrl, createdBy: user._id });
        if (existingUrl)
          return NextResponse.json({ message: "URL already shortened by you", success: true, shortenURL: `${ORIGIN}/${existingUrl.shortenURL}` }, { status: 200 });

        if (user.monthlyQuotaUsed >= user.monthlyQuotaLimit) return NextResponse.json({ message: "Monthly Quota exceeded, Kindly upgrade to premium", success: false }, { status: 403 });

        await user.handleMonthlyQuota();
        createdBy = user._id;
      }
    }

    let shortenURL = alias ? (prefix ? `${prefix}${alias}` : alias) : "";
    if (alias) {
      if (await Url.findOne({ shortenURL })) return NextResponse.json({ message: "Alias in use", success: false }, { status: 400 });
    } else {
      let attempts = 0;
      do {
        shortenURL = generateShortUrl.generateShortUrl({ length: length ?? CONFIG.SHORT_URL_LENGTH, prefix });
        attempts++;
      } while (await Url.findOne({ shortenURL }) && attempts < CONFIG.MAX_ATTEMPTS);
      if (attempts >= CONFIG.MAX_ATTEMPTS) return NextResponse.json({ message: "Failed to generate unique URL", success: false }, { status: 500 });
    }

    const newUrl = await Url.create({
      originalUrl,
      shortenURL,
      createdBy, // Can be null
      click: 0,
      createdAt: new Date(),
      expireAt: expirationDate ?? null
    });

    if (user) {
      const updatedUser = await User.findByIdAndUpdate(user._id, { $inc: { monthlyQuotaUsed: 1 } }, { new: true });
      console.log("User Monthly Quota used:", updatedUser.monthlyQuotaUsed);
    }

    console.log("Shortened URL created:", newUrl);

    return NextResponse.json({ message: "URL shortened successfully", success: true, shortenURL: `${ORIGIN}/${shortenURL}` }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message: errorMessage, success: false, error: errorMessage }, { status: 500 });
  }
}