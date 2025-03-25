import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { User } from '@/models/User';

export async function GET(
    req: NextRequest
) {
    const authToken = req.headers.get('authorization')?.replace('Bearer ', '');

    if (authToken !== process.env.CRON_SECRET) {
        return NextResponse.json(
            { error: 'Unauthorized access. Invalid token.' },
            { status: 401 }
        );
    }
    try {
        await connectDB();

        // Reset quota for free users
        const freeUsersUpdate = await User.updateMany(
            { subscriptionStatus: 'free', monthlyQuotaUsed: { $gt: 0 } },
            { $set: { monthlyQuotaUsed: 0, monthlyQuotaLimit: 100 } }
        );

        // Reset quota for active paid users (basic, pro, enterprise)
        const paidUsersUpdate = await User.updateMany(
            { subscriptionStatus: { $in: ['basic', 'pro', 'enterprise'] }, subscriptionExpiration: { $gte: new Date() } },
            { $set: { monthlyQuotaUsed: 0 } }
        );

        // Downgrade and reset quota for expired paid users
        const expiredUsersUpdate = await User.updateMany(
            { subscriptionStatus: { $in: ['basic', 'pro', 'enterprise'] }, subscriptionExpiration: { $lt: new Date() } },
            { $set: { subscriptionStatus: 'free', monthlyQuotaUsed: 0, monthlyQuotaLimit: 100 } }
        );

        return NextResponse.json({
            message: 'Monthly quota reset successfully',
            freeUsersUpdated: freeUsersUpdate.modifiedCount,
            paidUsersUpdated: paidUsersUpdate.modifiedCount,
            expiredUsersUpdated: expiredUsersUpdate.modifiedCount
        });

    } catch (error) {
        console.error('Error resetting monthly quota:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
