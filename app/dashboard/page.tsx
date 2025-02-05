"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SingleURL from '@/components/(Mode)/SingleUrl';
import getClickAnalytics from '@/action/getClickAnalytics';
import { User, Analytics } from '@/types/types';
import { UsageMeter } from './components/UsageMeter';
import useUrlManagement from '@/hooks/useUrlManagement';
import { DashboardHeader } from './components/DashboardHeader';
import { RecentUrlsCard } from './components/RecentUrlscard';
import { AnalyticsCard } from './components/AnalyticsCard';
import { SubscriptionCard } from './components/SubscriptionCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Loading from '@/lib/Loading';

const DashboardPage = () => {
  const [showUrlShortener, setShowUrlShortener] = useState(false);
  const [user, setUser] = useState<User>();
  const [analytics, setAnalytics] = useState<Analytics>();
  const router = useRouter();
  const { urls, loading, fetchUrls } = useUrlManagement();

  useEffect(() => {
    const initializeDashboard = async () => {
      const userData = await fetchUrls();
      setUser(userData);
      const userAnalytics = await getClickAnalytics(userData?.email);
      setAnalytics(userAnalytics);
    };
    initializeDashboard();
  }, []);

  if (loading || !user || !analytics) {
    return <Loading text="Preparing your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col gap-6">
          <DashboardHeader userName={user.name} />
          <Button
            onClick={() => setShowUrlShortener(!showUrlShortener)}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Link className="w-4 h-4" />
            {showUrlShortener ? 'Hide URL Shortener' : 'Create New Short URL'}
            {showUrlShortener ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {showUrlShortener && (
            <div className="w-full animate-in slide-in-from-top duration-300">
              <SingleURL />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <RecentUrlsCard
            urls={urls}
            onViewAll={() => router.push('/my-urls')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage</CardTitle>
                <CardDescription>{user.subscriptionStatus} plan limits</CardDescription>
              </CardHeader>
              <CardContent>
                <UsageMeter
                  used={user.monthlyQuotaUsed}
                  total={user.monthlyQuotaLimit}
                />
              </CardContent>
            </Card>

            <AnalyticsCard analytics={analytics} />

            <SubscriptionCard
              subscriptionStatus={user.subscriptionStatus}
              onUpgrade={() => router.push('/pricing')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;