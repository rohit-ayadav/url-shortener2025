import { getServerSession, NextAuthOptions } from "next-auth";
import { connectDB } from "@/utils/db";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import sendEmail from "@/action/sendEmail";
import { generateEmailTemplate } from "@/lib/EmailTemplate";

if (process.env.GOOGLE_CLIENT_ID === undefined || process.env.GOOGLE_CLIENT_SECRET === undefined) {
    throw new Error('Please define GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file');
}
if (process.env.GITHUB_ID === undefined || process.env.GITHUB_SECRET === undefined) {
    throw new Error('Please define GITHUB_ID and GITHUB_SECRET in your .env file');
}
if (process.env.NEXTAUTH_SECRET === undefined) {
    throw new Error('Please define NEXTAUTH_SECRET in your .env file');
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({

            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await connectDB();
                try {
                    if (!credentials.email || !credentials.password) {
                        throw new Error('Please fill in all required fields');
                        return null;
                    }

                    console.log('\nFinding user...\n');
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error('Invalid Credentials');
                        return null;
                    }
                    const isValid = await user.comparePassword(credentials.password);
                    if (!isValid) {
                        throw new Error('Invalid Credentials');
                        return null;
                    }
                    return user;

                } catch (err: any) {
                    console.error(err);
                    throw new Error(err);
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, session }) {
            if (user) {
                token.id = user._id?.toString();
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            if (account && account.provider === 'credentials') {
                return true;
            }
            if (account && account.provider !== 'credentials') {
                // This is a social login so we need to check if the user exists in our database or not
                await connectDB();
                const existingUser = await User.findOne({ email: user.email });
                if (existingUser) {
                    // User exists in the database then update the image and name
                    existingUser.image = user.image === null ? existingUser.image : user.image;
                    existingUser.name = user.name === null ? existingUser.name : user.name;
                    await existingUser.save();
                } else {
                    // User does not exist in the database so create a new user
                    const newUser = new User({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: 'user',
                        provider: account.provider,
                    });
                    await newUser.save();
                    sendEmail({
                        from: 'RUShort <rohitkuyada@gmail.com>',
                        to: user.email,
                        subject: 'Welcome to RUShort',
                        message: 'Welcome to RUShort',
                        html: generateEmailTemplate('welcome', { name: user.name }),
                    });
                }
            }
            return true;
        }
    }
}

export async function getSessionAtHome() {
    return await getServerSession(authOptions);
}