"use client";
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Trash2, Copy, ExternalLink, ArrowBigLeft, TextCursorInputIcon, Wifi, WifiOff, RefreshCw, Home } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteFromLocalStorage, getStoredUrls } from '@/components/LocalStorage';
import { deleteFromDB } from '@/lib/FindTotalClick';

interface UrlEntry {
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
    totalClicks?: number;
}

const MyUrls = () => {
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastSync, setLastSync] = useState<Date | null>(null);

    // Network status monitoring
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success('Back online!');
            fetchUrls(); // Refresh data when coming back online
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast.error('You are offline. Some features may be limited.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(navigator.onLine);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const fetchUrls = async () => {
        try {
            const storedUrls = await getStoredUrls();
            setUrls(storedUrls);
            setLastSync(new Date());
        } catch (error) {
            toast.error('Failed to fetch URLs');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUrls();
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const deleteUrl = async (shortUrl: string) => {
        if (!isOnline) {
            toast.error('Cannot delete URLs while offline');
            return;
        }

        try {
            const result = await deleteFromDB(shortUrl);
            if (result.success) {
                deleteFromLocalStorage(shortUrl);
                toast.success('URL deleted successfully');
                setUrls(urls.filter((url) => url.shortUrl !== shortUrl));
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to delete URL: ${errorMessage}`);
        }
    };

    const formatUrl = (url: string, maxLength: number = 50) => {
        return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Loading state with skeleton animation
    if (isLoading) {
        return (
            <Card className="w-full min-h-[500px] animate-pulse">
                <CardHeader>
                    <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-2/4"></div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Empty state with offline support
    if (urls.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>My URLs</CardTitle>
                        {!isOnline && (
                            <div className="flex items-center text-yellow-600">
                                <WifiOff className="h-4 w-4 mr-2" />
                                <span className="text-sm">Offline Mode</span>
                            </div>
                        )}
                    </div>
                    <CardDescription>
                        Manage all your shortened URLs in one place
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert variant="default">
                        <AlertDescription>
                            {isOnline ? (
                                <>
                                    You have not shortened any URLs yet. Go ahead and shorten your first URL!
                                    <br />
                                    <a href="/" className="text-blue-500 hover:text-blue-700">
                                        Shorten a URL
                                    </a>
                                </>
                            ) : (
                                "You're offline. Your shortened URLs will appear here when you're back online."
                            )}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            {/* Navigation Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = '/'}
                        >
                            <Home className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                        >
                            <ArrowBigLeft className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                        >
                            <RefreshCw className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(window.location.href)}
                        >
                            <TextCursorInputIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Toaster for notifications */}
            <Toaster position="top-right" reverseOrder={false} />
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>My URLs</CardTitle>
                        <CardDescription>
                            Manage all your shortened URLs in one place
                        </CardDescription>
                    </div>
                    {lastSync && (
                        <div className="text-sm text-gray-500">
                            Last updated: {formatDate(lastSync.toISOString())}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-14">#</TableHead>
                                <TableHead>Short URL</TableHead>
                                <TableHead className="hidden md:table-cell">Original URL</TableHead>
                                <TableHead className="hidden sm:table-cell">Created</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {urls.map((url, index) => (
                                <TableRow key={url.shortUrl} className="group hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-medium max-w-[150px] truncate">
                                        {formatUrl(url.shortUrl, 30)}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                                        {formatUrl(url.originalUrl)}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {formatDate(url.createdAt)}
                                    </TableCell>
                                    <TableCell>{url.totalClicks ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => copyToClipboard(url.shortUrl)}
                                                title="Copy short URL"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => window.open("https://" + url.shortUrl, "_blank")}
                                                title="Open original URL"
                                                disabled={!isOnline}
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete URL"
                                                        disabled={!isOnline}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete URL</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete this shortened URL {url.shortUrl}? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-500 hover:bg-red-600"
                                                            onClick={() => deleteUrl(url.shortUrl)}
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="mt-4 text-sm text-gray-600 text-center">
                    <p>
                        <span className="font-medium">{urls.length}</span> URLs found
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default MyUrls;