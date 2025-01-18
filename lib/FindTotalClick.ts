"use server";
import { Url } from "@/models/urlShortener";
import connectDB from "@/utils/db";

connectDB();

interface ResponseTypes {
    success: boolean;
    error: string;
}

async function findTotalClick(originalUrl: string) {
    const url = await Url.findOne({ originalUrl });
    // console.log(`URL found: ${url}`);
    const totalClicks = url?.click || 0;
    return totalClicks;
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