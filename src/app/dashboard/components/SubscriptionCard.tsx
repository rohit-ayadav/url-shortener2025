import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

interface SubscriptionCardProps {
  subscriptionStatus: 'free' | 'basic' | 'premium';
  onUpgrade: () => void;
}

export const SubscriptionCard = ({ subscriptionStatus, onUpgrade }: SubscriptionCardProps) => {
  const isPremium = subscriptionStatus === 'premium';
  
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white md:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="w-5 h-5 mr-2" />
          {isPremium ? 'Thanks for being a Premium User' : 'Upgrade to Premium'}
        </CardTitle>
        <CardDescription className="text-blue-100">
          {isPremium 
            ? 'Enjoy unlimited URL shortening and advanced features'
            : 'Unlock unlimited URL shortening and advanced features'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="space-y-2">
            {[
              'Unlimited URLs per day',
              'Custom branded domains',
              'Advanced analytics',
              'API access'
            ].map((feature) => (
              <li key={feature} className="flex items-center text-sm">
                ✓ {feature}
              </li>
            ))}
          </ul>
          {!isPremium && (
            <Button
              className="w-full bg-white text-blue-600 hover:bg-blue-50"
              onClick={onUpgrade}
            >
              Upgrade Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
