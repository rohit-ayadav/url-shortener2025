import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Crown,
    Star,
    LineChart,
    Lock,
    AlertCircle
} from 'lucide-react';
import MultipleURLsPage from '@/components/MultipleURLsTab';

const FeatureList = ({ items, iconClass = "bg-yellow-400" }: { items: string[], iconClass?: string }) => (
    <div className="space-y-3">
        {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-purple-100">
                <div className={`h-1.5 w-1.5 rounded-full ${iconClass}`} />
                {item}
            </div>
        ))}
    </div>
);
const FeatureList1 = ({ items, iconClass = "bg-yellow-400" }: { items: string[], iconClass?: string }) => (
    <div className="space-y-3">
        {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-purple">
                <div className={`h-1.5 w-1.5 rounded-full ${iconClass}`} />
                {item}
            </div>
        ))}
    </div>
);

const PremiumFeatures = [
    'Bulk process up to 1000 URLs at once',
    'Custom URL prefixes',
    'Expiration date settings',
    'Advanced analytics per URL',
    'Export data to CSV/Excel',
    'API access for automation'
];

const AnalyticsFeatures = [
    'Track clicks and engagement for each URL',
    'Geographic and device analytics',
    'Export detailed reports'
];

const BulkShortenerPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            {/* Header Section */}
            <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 relative">
                <div className="absolute inset-0 bg-black/5" aria-hidden="true" />
                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center space-x-2 mb-2">
                        <Crown className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                        <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400">
                            Premium Feature
                        </Badge>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Batch URL Shortener</h1>
                    <p className="text-xl text-purple-100 max-w-2xl">
                        Shorten multiple URLs at once with advanced customization and tracking capabilities.
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Card className="mb-4">
                            <CardContent className="p-4">
                                <Alert className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Paste up to 1000 URLs below to shorten them in bulk
                                    </AlertDescription>
                                </Alert>
                                <MultipleURLsPage />
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="space-y-6">
                        <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white transform hover:scale-[1.02] transition-transform">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    Premium Features
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FeatureList items={PremiumFeatures} />
                            </CardContent>
                        </Card>

                        <Card className="transform hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <Alert>
                                    <Lock className="h-4 w-4" aria-hidden="true" />
                                    <AlertDescription>
                                        Enhanced security with SSL encryption and spam protection
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 transform hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                    <LineChart className="h-5 w-5 text-purple-600" aria-hidden="true" />
                                    Analytics Dashboard
                                </h3>
                                <FeatureList1
                                    items={AnalyticsFeatures} 
                                    iconClass="bg-purple-500" 
                                />
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default BulkShortenerPage;