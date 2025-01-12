// components/PreviewPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PreviewPageProps {
  originalUrl: string;
  duplicateUrl: string;
}


export function PreviewPage({ originalUrl, duplicateUrl }: PreviewPageProps) {
  const [timeLeft, setTimeLeft] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsLoading(true);
          router.push(originalUrl);
          clearInterval(timer);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [originalUrl]);

  const handleImmediateRedirect = () => {
    setIsLoading(true);
    router.push(originalUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Timer Alert */}
        <Alert className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Redirecting in {timeLeft} seconds...
          </AlertDescription>
        </Alert>

        {/* Preview Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Preview Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="break-all">
              <p className="text-sm text-gray-500">You are being redirected to:</p>
              <p className="font-medium mt-1">{duplicateUrl}</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleImmediateRedirect}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Redirect Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        {/* Two Column Layout for Ads and Community */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Space */}
          <Card className="h-64">
            <CardHeader>
              <CardTitle>Advertisement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center h-full'>
                {/* <p className="text-gray-400">Ad Space</p> */}
                {/* <img
                  src="https://via.placeholder.com/150"
                  alt="Advertisement"
                  className="h-40 w-full object-cover rounded"
                /> */}
                <a href="https://tinyurl.com/3p5rsjkk" className="text-blue-500">Practice with us to ace your next job interview for FREE</a>

                <p className="text-sm text-gray-600 bottom-0">
                  Ad by Resources & Updates</p>
              </div>
            </CardContent>
          </Card>

          {/* Community Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Resources & Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium">Community Guidelines</h3>
                  <p className="text-sm text-gray-600">Stay updated with our latest community guidelines</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium">Latest Updates</h3>
                  <p className="text-sm text-gray-600">Check out what's new in our community</p>
                  <p className="text-sm text-gray-600">Join <a href="https://whatsapp.com/channel/0029VaVd6px8KMqnZk7qGJ2t" className="text-blue-500">our
                    whatsapp group</a> for more updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}