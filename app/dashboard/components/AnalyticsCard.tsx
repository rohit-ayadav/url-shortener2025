// AnalyticsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Analytics } from '@/types/types';

interface AnalyticsCardProps {
    analytics: Analytics;
}

export const AnalyticsCard = ({ analytics }: AnalyticsCardProps) => {
    const metrics = [
        { label: 'Total URLs shortened', value: analytics.totalShorten },
        { label: 'Total Clicks', value: analytics.totalClick },
        { label: 'Subscription Status', value: analytics.subscriptionStatus },
        { label: 'Daily Quota Used', value: analytics.monthlyQuotaUsed },
        { label: 'Daily Quota Limit', value: analytics.monthlyQuotaLimit },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Your URL performance and statistics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="flex flex-col gap-2">
                            <span className="text-sm text-gray-500">{metric.label}</span>
                            <span className={`font-bold text-gray-900 ${metric.label === 'Total URLs shortened' || metric.label === 'Total Clicks'
                                ? 'text-2xl'
                                : 'text-lg'
                                }`}>
                                {metric.value}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};