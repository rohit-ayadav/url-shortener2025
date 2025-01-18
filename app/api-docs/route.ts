import { documentation } from "../api/urlshortener/docs";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    return NextResponse.json(documentation, { status: 200 });
}