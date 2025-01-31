import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import { User } from '@/models/User';
import { connectDB } from '@/utils/db';
import { pages } from 'next/dist/build/templates/app-page';
import { signOut } from 'next-auth/react';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || 'default-google-id',
            clientSecret: process.env.GOOGLE_SECRET || 'default-google-secret',
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID || 'default-github-id',
            clientSecret: process.env.GITHUB_SECRET || 'default-github-secret',
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                await connectDB();
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Please fill in all required fields');
                }
                const user = await User.findOne({ email: credentials.email });
                if (!user) {
                    return null;
                }
                const isValid = await user.comparePassword(credentials.password);
                if (!isValid) {
                    return null;
                }
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                    provider: 'credentials',
                };
            },
        }),
    ],
    session: {
        // strategy: 'jwt',
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 30 * 24 * 60 * 60, // 30 days

    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth',
        signOut: '/auth/signout',
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role || 'user';
                token.provider = user.provider || 'credentials';
            }
            // console.log(`The token is: ${JSON.stringify(token)}\n\n`);
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    image: token.image,
                    role: token.role,
                    provider: token.provider,
                };
            }
            return session;
        },
        async signIn(user, account, profile) {
            // the account and profile is undefined here.
            await connectDB();
            const email = user.user.email;

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    existingUser.provider = user?.account?.provider || existingUser.provider;
                    if (profile) {
                        existingUser.image = profile.picture || profile.avatar_url || existingUser.image;
                    }
                    await existingUser.save();
                    return true;
                }
                const newUser = new User({
                    name: user.user.name,
                    email: user.user.email,
                    image: user.user.image,
                    provider: user?.account?.provider || 'credentials',
                });

                await newUser.save();
                if (!process.env.NEXTAUTH_SECRET) {
                    return false;
                }
                if (!process.env.NEXTAUTH_URL) {
                    return false;
                }
                return true;

            } catch (error) {
                console.error(error);
                return false;
            }
        },
    },
};

export default NextAuth(authOptions);

export async function getSessionAtHome() {
    return await getServerSession(authOptions);
}

