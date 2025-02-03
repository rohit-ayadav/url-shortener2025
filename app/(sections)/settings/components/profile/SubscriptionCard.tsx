import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
interface SubscriptionCardProps {
    profile: UserProfile;
}

export function SubscriptionCard({ profile }: SubscriptionCardProps) {
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                    Manage your subscription and billing details
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <h3 className="font-medium">
                            {profile.subscription.plan.charAt(0).toUpperCase() +
                                profile.subscription.plan.slice(1)} Plan
                        </h3>
                        <p className="text-sm text-gray-500">
                            Expires: {new Date(profile.subscription.expiryDate).toLocaleDateString()}
                        </p>
                    </div>
                    <Badge variant={
                        profile.subscription.status === 'active' ? 'default' :
                            profile.subscription.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                        {profile.subscription.status.charAt(0).toUpperCase() +
                            profile.subscription.status.slice(1)}
                    </Badge>
                </div>
                {profile.subscription.plan !== 'premium' && (
                    <Button className="w-full"
                        onClick={() => router.push('/pricing')}>
                        Upgrade to Premium
                    </Button>
                )}:{profile.subscription.plan === 'premium' && (
                    <CardDescription className="text-sm text-gray-500">
                        You are on the premium plan
                    </CardDescription>
                )}
            </CardContent>
        </Card>
    );
}

