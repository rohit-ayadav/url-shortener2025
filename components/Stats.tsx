import React from 'react';
import { Link2, MousePointerClick } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsProps {
  totalShortenedUrls: number;
  totalClicks: number;
}

export const Stats = ({ totalShortenedUrls, totalClicks }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Total URLs Shortened</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalShortenedUrls.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <MousePointerClick className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardContent className="py-6">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-500">Average Clicks per URL</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalShortenedUrls > 0
                ? (totalClicks / totalShortenedUrls).toFixed(1)
                : '0'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;