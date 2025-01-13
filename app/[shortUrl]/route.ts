import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Extract the path segments from the request URL
    let paths = request.nextUrl.pathname.split("/");
    paths = paths.filter((s) => s.length > 0);
    console.log(paths);

    // Get the last segment of the path (shortened URL)
    const shortenURL = paths[paths.length - 1];

    // Return the shortened URL and a test message
    return NextResponse.json({
      message: "Test successful",
      shortenURL: shortenURL,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
