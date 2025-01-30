"use client";
import React, { useState } from 'react';
import { Crown, Star, Sparkles, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import TextModeTab from '@/components/TextModeTab';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import QRCodeModal from '@/components/QRCodeModal';
import { ResultCard } from '@/components/ResultCard';

const TextModePage = () => {


    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header Section */}
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <Crown className="h-6 w-6 text-yellow-400" />
                        <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                            Premium Feature
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Text Mode</h1>
                    <p className="text-xl text-blue-100 max-w-2xl">
                        Automatically detect and shorten multiple URLs within your text while preserving the original formatting.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Text Processing Section */}
                    <div className="md:col-span-2">
                        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-blue-100">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                                    <Sparkles className="h-6 w-6 text-yellow-500" />
                                    URL Text Processor
                                </CardTitle>
                                <CardDescription className="text-blue-600">
                                    Paste your text containing URLs and we'll automatically shorten them
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TextModeTab />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Premium Features Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-400" />
                                    Premium Benefits
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    {[
                                        'Process unlimited URLs in text',
                                        'Custom link expiration dates',
                                        'Advanced analytics for each URL',
                                        'Custom domain support',
                                        'Priority customer support',
                                        'API access for automation'
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-center gap-2 text-blue-100">
                                            <div className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                                            {benefit}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <Alert>
                                    <Lock className="h-4 w-4" />
                                    <AlertDescription>
                                        URLs processed in Text Mode will expire after 1 year and include advanced tracking capabilities.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-600" />
                                    Pro Tips
                                </h3>
                                <ul className="space-y-2 text-yellow-800">
                                    <li className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2" />
                                        <span>Use custom prefixes to categorize different types of content</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2" />
                                        <span>Set expiration dates for time-sensitive content</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2" />
                                        <span>Track clicks and engagement with premium analytics</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
               
            </main>
        </div>
    );
};

export default TextModePage;