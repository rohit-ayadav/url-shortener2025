"use server";
import { Url } from "@/models/urlShortener";
import connectDB from "@/utils/db";

connectDB();

interface ResponseTypes {
    success: boolean;
    error: string;
}

// Batch fetch click counts for multiple URLs
async function findTotalClick(originalUrls: string[]): Promise<{ [url: string]: number }> {
    // Use MongoDB's `$in` to fetch all URLs in a single query
    console.log("Find Total Click function called");
    const urls = await Url.find({ originalUrl: { $in: originalUrls } });

    // Map the results to a dictionary of { originalUrl: totalClicks }
    const clickData: { [url: string]: number } = {};
    urls.forEach(url => {
        clickData[url.originalUrl] = url.click || 0;
    });

    return clickData;
}


async function deleteFromDB(shortenURL: string) {
    try {
        const shortenPart = shortenURL.split("/").pop();
        const url = await Url.findOne({ shortenURL: shortenPart });
        if (!url) {
            throw new Error("URL not found");
        }
        await Url.deleteOne({ _id: url._id });
        const response: ResponseTypes = { success: true, error: "" };
        return response;
    }
    catch (error) {
        console.error("Error deleting URL:", error);
        const response: ResponseTypes = { success: false, error: (error as Error).message };
        return response;
    }
}

export { findTotalClick, deleteFromDB };