import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { shortUrl: string } }) {
  // Construct the new URL using the same short URL parameter
  const redirectUrl = `https://resourcesandcarrier.online/${params.shortUrl}`;

  // Redirect to the new URL
  return NextResponse.redirect(redirectUrl, 302);
}
