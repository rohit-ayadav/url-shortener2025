import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import { Url } from "@/models/urlShortener";

await connectDB();

export async function GET(request: NextRequest) {
  try {
    // Extract the path segments from the request URL
    let paths = request.nextUrl.pathname.split("/");
    paths = paths.filter((s) => s.length > 0);
    console.log(paths);

    const shortenURL = paths[paths.length - 1];
    try {
      const url = await Url.findOne({ shortenURL });
      if(url) {
        url.click++;
        await url.save();
        return NextResponse.redirect(url.originalUrl);
      }

    } catch (error) {
      return NextResponse.json(
        {
          message: "An error occurred",
          error: (error as Error).message,
        },
        { status: 500 }
      );
    }

    const newUrl = `https://resourcesandcarrier.online/${shortenURL}`;
    return NextResponse.redirect(newUrl);
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
