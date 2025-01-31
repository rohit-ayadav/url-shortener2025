import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET
    const { pathname } = req.nextUrl || { pathname: '' };
    console.log(`\n\nPathname: ${pathname}\n\n`);

    const publicRoutes = ["/", "/about", "/contact", "/auth", '/pricing', '/features'];
    const adminRoutes = ["/admin"];
    const protectedRoutes = ["/dashboard", "/my-urls", "/settings", "/bulk-shortener"];

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }
    if (pathname.startsWith('/auth')) {
        return NextResponse.next();
    }

    const token = await getToken({ req, secret });
    console.log("Token in middleware:", token);
    if (!token) {
        const loginUrl = new URL("/auth", req.url);
        loginUrl.searchParams.set(
            "redirect",
            pathname
        );
        return NextResponse.redirect(loginUrl);
    }

    if (
        !token &&
        (protectedRoutes.some((route) => pathname.startsWith(route)) ||
            adminRoutes.includes(pathname))
    ) {
        const loginUrl = new URL("/auth", req.url);
        loginUrl.searchParams.set(
            "message",
            "You must be logged in to access this page."
        );
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (adminRoutes.includes(pathname) && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
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
    ]
};
