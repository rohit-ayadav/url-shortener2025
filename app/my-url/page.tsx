"use client";
import React, { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Trash2, Copy, ExternalLink } from 'lucide-react';
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
import { deleteFromLocalStorage, getStoredUrls } from '@/components/LocalStorage';
import { deleteFromDB } from '@/lib/FindTotalClick';

interface UrlEntry {
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
    totalClicks?: number;
}

const LOCALSTORAGE_KEY = 'shortenedUrls';

const MyUrls = () => {
    const [urls, setUrls] = useState<UrlEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUrls = async () => {
            const storedUrls = await getStoredUrls();
            setUrls(storedUrls);
            setIsLoading(false);
        };
        fetchUrls();
    }, []);


    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy to clipboard');
            console.error('Copy failed:', error);
        }
    };

    const deleteUrl = async (shortUrl: string) => {
        try {
            const success = (await deleteFromDB(shortUrl)).success;
            if (success) {
                deleteFromLocalStorage(shortUrl);
                toast.success('URL deleted successfully');
                const updatedUrls = urls.filter((url) => url.shortUrl !== shortUrl);
                setUrls(updatedUrls);
            }else{
                // toast.error(`${(await deleteFromDB(shortUrl)).error}`);
                throw new Error(`${(await deleteFromDB(shortUrl)).error}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to delete URL: ${errorMessage}`);
            console.error('Delete failed:', error);
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

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (urls.length === 0) {
        return (
            <Card className="w-full">
                <CardContent className="p-6">
                    <Alert>
                        <AlertDescription>
                            You haven't created any short URLs yet. Create one to see it here!
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <Toaster
                position="top-right"
                reverseOrder={false}
            />
            <CardHeader>
                <CardTitle>My URLs</CardTitle>
                <CardDescription>
                    Manage all your shortened URLs in one place
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Short URL</TableHead>
                                <TableHead>Original URL</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Total Clicks</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {urls.map((url) => (
                                <TableRow key={url.shortUrl}>
                                    <TableCell className="font-medium">
                                        {formatUrl(url.shortUrl, 30)}
                                    </TableCell>
                                    <TableCell>{formatUrl(url.originalUrl)}</TableCell>

                                    <TableCell>{formatDate(url.createdAt)}</TableCell>
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
                                                onClick={() => window.open(url.originalUrl, '_blank')}
                                                title="Open original URL"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => deleteUrl(url.shortUrl)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete URL"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default MyUrls;