// RecentUrlsCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { UrlData } from '@/types/types';
import UrlCard from './UrlCard';

interface RecentUrlsCardProps {
    urls: UrlData[];
    onViewAll: () => void;
}

export const RecentUrlsCard = ({ urls, onViewAll }: RecentUrlsCardProps) => {
    return (
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>Recent URLs</CardTitle>
                    <CardDescription>Your recently shortened URLs and their performance</CardDescription>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex"
                    onClick={onViewAll}
                >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardHeader>
            {urls.length > 0 ? (

                <CardContent>
                    <div className="space-y-4">
                        {urls.map((url) => (
                            <UrlCard key={url._id.toString()} url={url} />
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 sm:hidden"
                        onClick={onViewAll}
                    >
                        View All URLs
                    </Button>
                </CardContent>
            ) : (
                <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <p className="text-gray-500 text-lg">No URLs shortened yet</p>
                        <p className="text-gray-500 text-sm">Shorten a URL to get started</p>
                        <Button onClick={() => window.location.href = '/'}>Shorten a URL</Button>
                    </div>
                </CardContent>
            )}

        </Card>
    );
};

