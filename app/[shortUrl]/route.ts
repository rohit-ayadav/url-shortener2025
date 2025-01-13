import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: { shortUrl: string } }) {
  try {
    // Return the params and a test message as JSON
    return NextResponse.json({
      message: "Test successful",
      params: context.params,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "An error occurred during testing",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
