// app/dboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Link,
  ExternalLink,
  Copy,
  QrCode,
  Trash,
  Crown,
  Settings,
  User,
  List,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import SingleURL from '../Section/SingleUrl';
import { useRouter } from 'next/navigation';
import { ObjectId, set } from 'mongoose';

interface UrlData {
  id: number;
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
  dailyQuotaUsed: number;
  dailyQuotaLimit: number;
  createdAt: Date;
}

const DashboardPage = () => {
  const [showUrlShortener, setShowUrlShortener] = useState(false);
  const router = useRouter();
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [dailyLimit, setDailyLimit] = useState({
    used: 0,
    total: 0,
    percentage: 0
  });

  useEffect(() => {
    const fetchUrls = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/my-urls?limit=5');
        if (!response.ok) throw new Error('Failed to fetch URLs');

        const data = await response.json();
        setUrls(data.urls);
        setUser(data.user);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch URLs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);


  useEffect(() => {
    const dailyLimit = {
      used: user?.dailyQuotaUsed || 0,
      total: user?.dailyQuotaLimit || 0,
      percentage: Math.floor(((user?.dailyQuotaUsed || 0) / (user?.dailyQuotaLimit || 1)) * 100)
    };
    setDailyLimit(dailyLimit);
  }, [user]);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  const handleDelete = () => {
    toast.success('URL deleted successfully');
  };



  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-blue-600 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Header Section with Navigation */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center" onClick={() => router.push('/account')}>
                <User className="w-4 h-4 mr-2" />
                Account
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center" onClick={() => router.push('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none justify-center"
                onClick={() => {
                  router.push('/my-urls');
                }}>
                <List className="w-4 h-4 mr-2" />
                All URLs
              </Button>
            </div>
          </div>

          {/* URL Shortener Toggle */}
          <div className="w-full">
            <Button
              onClick={() => setShowUrlShortener(!showUrlShortener)}
              className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Link className="w-4 h-4" />
              {showUrlShortener ? 'Hide URL Shortener' : 'Create New Short URL'}
              {showUrlShortener ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Collapsible URL Shortener */}
          {showUrlShortener && (
            <div className="w-full animate-in slide-in-from-top duration-300">
              <SingleURL />
            </div>
          )}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent URLs Card */}
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Recent URLs</CardTitle>
                <CardDescription>Your recently shortened URLs and their performance</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => router.push('/my-urls')}>
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {urls.map((url, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                      <div className="w-full sm:max-w-[60%]">
                        <p className="text-sm text-gray-500 truncate">{url.originalUrl}</p>
                        <p className="text-blue-600 font-medium break-all">{url.shortUrl}</p>
                      </div>
                      <span className="text-sm text-gray-500 shrink-0">
                        {formatDistanceToNow(url.created, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-sm font-medium">{url.clicks} clicks</span>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopy(url.shortUrl)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <QrCode className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleDelete}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 sm:hidden">
                View All URLs
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Analytics, Limits, Premium */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
            {/* Analytics Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Click Analytics</CardTitle>
                <CardDescription>Last 7 days performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-8">{day}</span>
                      <div className="flex-1">
                        <div className="h-2 bg-blue-100 rounded-full">
                          <div
                            className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.random() * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {Math.floor(Math.random() * 200)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Limit Card */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Usage</CardTitle>
                <CardDescription>{user?.subscriptionStatus} plan limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={dailyLimit.percentage} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {dailyLimit.used} of {dailyLimit.total} URLs shortened
                    </p>
                    <p className="text-sm font-medium">
                      {dailyLimit.percentage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium CTA Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-800 text-white md:col-span-2 xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Unlock unlimited URL shortening and advanced features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      ✓ Unlimited URLs per day
                    </li>
                    <li className="flex items-center text-sm">
                      ✓ Custom branded domains
                    </li>
                    <li className="flex items-center text-sm">
                      ✓ Advanced analytics
                    </li>
                    <li className="flex items-center text-sm">
                      ✓ API access
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div >
  );
};

export default DashboardPage;