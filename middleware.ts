import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { getSessionAtHome } from "./auth";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl || { pathname: '' };
    
    // const session = await getSessionAtHome();
    // console.log(`Session: ${JSON.stringify(session)}`);

    const publicRoutes = ["/", "/about", "/contact", "/auth", '/pricing', '/features'];
    const adminRoutes = ["/admin"];
    const protectedRoutes = ["/dashboard", "/my-urls", "/settings", "/bulk-shortener"];

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // const token = await getToken({ req, secret: process.env.JWT_SECRET });

    // console.log(`Token: ${JSON.stringify(token)}`);
    // if (!token) {
    //     const loginUrl = new URL("/auth", req.url);
    //     loginUrl.searchParams.set(
    //         "message",
    //         "You must be logged in to access this page."
    //     );
    //     return NextResponse.redirect(loginUrl);
    // }

    // const { name, email, role } = token;
    // console.log({ name, email, role });

    // if (
    //     !token &&
    //     (protectedRoutes.some((route) => pathname.startsWith(route)) ||
    //         adminRoutes.includes(pathname))
    // ) {
    //     const loginUrl = new URL("/auth", req.url);
    //     loginUrl.searchParams.set(
    //         "message",
    //         "You must be logged in to access this page."
    //     );
    //     loginUrl.searchParams.set("callbackUrl", pathname);
    //     return NextResponse.redirect(loginUrl);
    // }

    // if (adminRoutes.includes(pathname) && token?.role !== "admin") {
    //     return NextResponse.redirect(new URL("/unauthorized", req.url));
    // }

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
