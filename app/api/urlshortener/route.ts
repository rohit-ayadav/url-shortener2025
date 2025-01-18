import connectDB from "@/utils/db";
import { Url } from "@/models/urlShortener";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { documentation, help, howtouse } from "./docs";
import generateShortUrl from "./generateShortURL";

// Connect to database
connectDB();

const origin = `rushort.site`;

// Configuration
const CONFIG = {
  BASE_DOMAINS: ["http://localhost:3000", "https://resourcesandcarrier.online", "https://www.rushort.site"],
  SHORT_URL_LENGTH: 4,
  MAX_ATTEMPTS: 10
} as const;


// function generateShortUrl(length: number = 5): string {
//   if (length < 1) {
//     throw new Error("Length must be a positive integer.");
//   }

//   const nonNumericStart = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
//   const alphanumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   const firstChar = nonNumericStart.charAt(
//     Math.floor(Math.random() * nonNumericStart.length)
//   );

//   const randomBytes = crypto.randomBytes(Math.ceil((length - 1) * 3 / 4));
//   const remainingChars = randomBytes.toString("base64url").replace(/[^a-zA-Z0-9]/g, "");

//   return (firstChar + remainingChars).substring(0, length);
// }


function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

// Type definitions for better type safety
interface UrlRequest {
  originalUrl: string;
  alias?: string;
  prefix?: string;
}

interface ApiResponse {
  message: string;
  success: boolean;
  shortenURL?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, alias, prefix } = (await request.json()) as UrlRequest;

    if (!originalUrl) {
      return NextResponse.json<ApiResponse>(
        { message: "originalUrl not get", success: false },
        { status: 400 }
      );
    }

    if (!isValidUrl(originalUrl)) {
      return NextResponse.json<ApiResponse>(
        {
          message: "Invalid URL",
          success: false
        },
        { status: 400 }
      );
    }

    // Check if URL is from protected domains
    if (CONFIG.BASE_DOMAINS.some((domain) => originalUrl.startsWith(domain))) {
      return NextResponse.json<ApiResponse>({
        message: "Nice try! But you can't shorten the URL of this website",
        success: true,
        shortenURL: originalUrl
      });
    }

    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      // return NextResponse.json<ApiResponse>({
      //   message: "Shortened URL already exists",
      //   success: true,
      //   shortenURL: `${request.nextUrl.origin}/${existingUrl.shortenURL}`
      // });
      return NextResponse.json<ApiResponse>({
        message: "Shortened URL already exists",
        success: true,
        shortenURL: `${origin}/${existingUrl.shortenURL}`
      });
    }

    let shortenURL: string;
    let urlInUse;
    let attempts = 0;

    if (alias) {
      urlInUse = await Url.findOne({
        shortenURL: prefix ? `${prefix}${alias}` : alias
      });
      if (urlInUse) {
        return NextResponse.json<ApiResponse>({
          message: "Alias already in use",
          success: false
        });
      }
      
      shortenURL = prefix ? `${prefix}${alias}` : alias; 
    } else {
      do {
        shortenURL = generateShortUrl.generateShortUrl({ length: CONFIG.SHORT_URL_LENGTH, prefix: prefix });
        urlInUse = await Url.findOne({ shortenURL });
        attempts++;
      } while (urlInUse && attempts < CONFIG.MAX_ATTEMPTS);

      if (attempts >= CONFIG.MAX_ATTEMPTS) {
        return NextResponse.json<ApiResponse>({
          message: "Failed to generate a unique short URL, please try again",
          success: false
        });
      }
    }
    // let shortenedUrl = `${request.nextUrl.origin}/${shortenURL}`;
    let shortenedUrl = `${origin}/${shortenURL}`;

    const newUrl =
      await Url.create({
        originalUrl,
        shortenURL,
        click: 0,
        createdAt: new Date()
      });

    console.log(`Shortened URL created: ${newUrl}`);

    return NextResponse.json<ApiResponse>({
      message: "Shortened URL created successfully",
      success: true,
      shortenURL: shortenedUrl
    });
  } catch (error) {
    console.error("URL Shortener Error:", error);
    return NextResponse.json<ApiResponse>(
      {
        message: "An error occurred",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log(`GET /api/urlshortener/stats Called`);

    const [totalShortenedURLs, totalClicksResult] = await Promise.all([
      Url.aggregate([{ $group: { _id: null, totalShortenedURLs: { $sum: 1 } } }
      ]),
      Url.aggregate([{ $group: { _id: null, totalClicks: { $sum: "$click" } } }
      ])
    ]);
    const totalClicks = totalClicksResult[0]?.totalClicks ?? 0;
    const totalShortenedURLsCount: number = totalShortenedURLs[0]?.totalShortenedURLs ?? 0;
    const response = {
      totalClicks,
      totalShortenedURLsCount,
      documentation,
      help,
      howtouse
    };
    console.log(`Total Clicks: ${totalClicks}, Total Shortened URLs: ${totalShortenedURLsCount}`);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching URL statistics:", error);
    return NextResponse.json(
      { error: `An error occurred: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
