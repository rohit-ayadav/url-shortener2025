import NextAuth from "next-auth";
import { connectDB } from "@/utils/db";
import { authOptions } from "./options";

await connectDB();

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };