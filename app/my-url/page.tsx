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
    const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
    const [urlToOpen, setUrlToOpen] = useState<string | null>(null);

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
            } else {
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
            <Card className="w-full min-h-[500px]">
                {/* card in the middle of the page000 */}
                <CardHeader>
                    <CardTitle>My URLs</CardTitle>
                    <CardDescription>
                        Manage all your shortened URLs in one place
                    </CardDescription>
                </CardHeader>
                <CardContent>

                    {/* Spinner in middle of page */}
                    <div className="flex justify-center items-center h-32">
                        <svg
                            className="animate-spin h-8 w-8 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4a4 4 0 00-4-4V12z"
                            />
                        </svg>
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
            <Toaster position="top-right" reverseOrder={false} />
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

                                <TableHead>#</TableHead>
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
                                    <TableCell>{urls.indexOf(url) + 1}</TableCell>
                                    <TableCell className="font-medium">
                                        {formatUrl(url.shortUrl, 30)}
                                    </TableCell>
                                    <TableCell>{formatUrl(url.originalUrl)}</TableCell>
                                    <TableCell>{formatDate(url.createdAt)}</TableCell>
                                    <TableCell>{url.totalClicks ?? 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Copy short URL"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Copy URL</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Do you want to copy this shortened URL to your clipboard?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => copyToClipboard(url.shortUrl)}>
                                                            Copy
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        title="Open original URL"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Open URL</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Do you want to open this URL in a new tab?
                                                            <div className="mt-2 text-sm text-gray-500">
                                                                {url.shortUrl} will be opened in a new tab.
                                                            </div>
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => window.open(url.shortUrl, '_blank')}>
                                                            Open
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-700"
                                                        title="Delete URL"
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
                <div className="mt-4 text-sm text-gray-600 text-center bottom-4">
                    <p>
                        <span className="font-medium">{urls.length}</span> URLs found
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default MyUrls;
