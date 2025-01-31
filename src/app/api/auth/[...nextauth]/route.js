import NextAuth from 'next-auth';
import { connectDB } from '@/utils/db';
import { authOptions } from '@/auth';

await connectDB();

const handler = NextAuth(authOptions);

export { handler as POST, handler as GET };
