import { ObjectId } from 'mongoose';

interface UrlData {
    _id: ObjectId;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    created: Date;
    lastClicked: Date;
    status: 'active' | 'expired' | 'archived';
}

interface User {
    _id: ObjectId;
    name: string;
    email: string;
    role: 'user' | 'admin';
    subscriptionStatus: 'free' | 'basic' | 'premium';
    subscriptionExpiration: Date | null;
    monthlyQuotaUsed: number;
    monthlyQuotaLimit: number;
    createdAt: Date;
}

interface Analytics {
    totalShorten: number;
    totalClick: number;
    subscriptionExpiration: Date | null;
    subscriptionStatus: 'free' | 'basic' | 'premium';
    monthlyQuotaLimit: number;
    monthlyQuotaUsed: number;
}

export type { UrlData, User, Analytics };

export interface PaymentHistory {
    _id: ObjectId;
    date: string;
    amount: number;
    status: 'succeeded' | 'failed' | 'pending';
    description: string;
}

export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    subscription: {
        plan: 'free' | 'premium' | 'custom';
        expiryDate: string;
        status: 'active' | 'cancelled' | 'expired';
    };
    twoFactorEnabled: boolean;
    apiKey?: string;
    apiUsage: {
        total: number;
        limit: number;
    };
}