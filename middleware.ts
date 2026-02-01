import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import rateLimit from "./utils/rate-limit";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = new URL(req.url);
    if (token && (url.pathname === "/auth" || url.pathname === "/auth?signup")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // if url contains /auth or /auth?signup and user is not logged in, then don't redirect
    if (!token && (url.pathname === "/auth" || url.pathname === "/auth?signup")) {
        return NextResponse.next();
    }

    if (!token && config.matcher.includes(url.pathname)) {
        return NextResponse.redirect(new URL("/auth?redirect=" + url.pathname, req.url));
    }

    return NextResponse.next();
}
export const config = {
    matcher: [
        "/admin",
        "/dashboard",
        "/my-urls",
        "/settings",
        "/bulk-shortener",
        "/api/:path*", // Match all API routes
        "/auth",
        "/my-purchase"
        // "/auth?signup",
    ],
};
