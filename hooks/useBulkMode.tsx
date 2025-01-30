"use client";
import React, { useEffect, useState } from 'react';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from './use-toast';
import { isValidURL } from '@/utils/utils';

const useBulkMode = () => {
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState(4);
    const [prefix, setPrefix] = useState('');
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [shortenedURLs, setShortenedURLs] = useState<{ original: string; shortened: string; createdAt?: string; expiresAt?: string }[]>([]);
    const [error, setError] = useState('');
    const [showQR, setShowQR] = useState(false);
    const toast = useToast();
    const [urlCount, setUrlCount] = useState(0);
    const [urls, setUrls] = useState('');
    const [selectedURL, setSelectedURL] = useState('');

    useEffect(() => {
        setUrlCount(urls.split('\n').filter(u => u.trim()).length);
    }, [urls]);

    const onPaste = () => {
        navigator.clipboard.readText().then(setUrls);
    };

    const onLengthChange = (value: number) => {
        setLength(value);
    };

    const callAPI = async (url: string, alias: string, prefix: string, length: number, expirationDate: Date | null) => {
        try {
            console.log(`\n\ncallAPI Called with: ${url}, ${alias}, ${prefix}, ${length}, ${expirationDate}`);
            const response = await fetch('/api/urlshortener', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalUrl: url,
                    alias,
                    prefix,
                    length,
                    expirationDate,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            toast.toast({
                title: 'Success',
                description: data.message,
            });
            return data.shortenURL;
        } catch (err) {
            setError(`Failed to create short URL: ${(err as Error).message}`);

            toast.toast({
                title: 'Failed to create short URL',
                description: `${(err as Error).message}`,
                action: <ToastAction
                    altText='Try again'
                    onClick={() => {
                        setError('');
                        handleShortenMultiple();
                    }}>Try again</ToastAction>,
                variant: 'destructive',
            });
            if ((err as Error).message === 'Daily quota exceeded, Kindly upgrade to premium') {
                toast.toast({
                    title: 'Daily quota exceeded',
                    description: 'Kindly upgrade to premium',
                    variant: 'destructive',
                    action: <ToastAction
                        altText='Upgrade now'
                        onClick={() => {
                            setError('');
                            window.open('/pricing', '_blank');
                        }}>Upgrade now</ToastAction>,
                });
            }
            throw err;
        }
    }
    const onPrefixChange = (value: string) => {
        setPrefix(value);
    }
    const onExpirationDateChange = (value: Date) => {
        setExpirationDate(value);
    }

    const handleShortenMultiple = async () => {
        setError('');
        setShortenedURLs([]);

        if (!urls) {
            setError('Please enter URLs');
            toast.toast({
                title: 'Error',
                description: 'Please enter URLs',
                variant: 'destructive',
            });

            return;
        }
        if (!navigator.onLine) {
            setError('No internet connection');
            return;
        }

        setLoading(true);
        try {
            const urlList = urls.split('\n').filter(u => u.trim());
            if (urlList.length > 1000) {
                setError('Maximum 1000 URLs allowed at once');
                toast.toast({
                    title: 'Error',
                    description: 'Maximum 1000 URLs allowed at once',
                    variant: 'destructive',
                });
                return;
            }
            if (urlList.length === 0) {
                setError('Please enter URLs');
                toast.toast({
                    title: 'Error',
                    description: 'Please enter URLs',
                    variant: 'destructive',
                });
                return;
            }

            console.log('\n\nURLs:', urlList);

            const invalidUrls = urlList.filter(url => {
                return !isValidURL(url.trim());
            });

            if (invalidUrls.length > 0) {
                setError(`Invalid URLs detected: ${invalidUrls.slice(0, 3).join(', ')}${invalidUrls.length > 3 ? '...' : ''}`);
                toast.toast({
                    title: 'Invalid URLs detected...',
                    description: `Keep each URL in a new line`,
                    variant: 'destructive',
                });
                return;
            }
            toast.toast({
                title: 'Shortening URLs...',
                description: 'Please wait...',
                variant: 'default',
            });

            const shortened = await Promise.all(
                urlList.map(async u => ({
                    original: u,
                    shortened: await callAPI(u, '', prefix, length, expirationDate),
                    createdAt: new Date().toISOString(),
                    expiresAt: expirationDate?.toISOString(),
                }))
            );
            setShortenedURLs(shortened);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (url: string) => {
        navigator.clipboard.writeText(url);
    };


    const handleClear = () => {
        setShortenedURLs([]);
        setUrls('');
        setError('');
    };
    const handleOpen = (url: string) => {
        // add https if not present
        if (!url.startsWith('http')) {
            url = `https://${url}`;
        }
        window.open(url, '_blank');
    };

    const handleShare = async (url: string) => {
        if (navigator.share) {
            if (!url.startsWith('http')) {
                url = `https://${url}`;
            }
            try {
                await navigator.share({ url });
                toast.toast({
                    title: 'Success',
                    description: 'URL shared successfully',
                    variant: 'default',
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };
    const onUrlsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setUrls(text);
    };

    return {
        urls,
        setUrls,
        loading,
        length,
        prefix,
        expirationDate,
        shortenedURLs,
        error,
        showQR,
        onPaste,
        onLengthChange,
        onPrefixChange,
        onExpirationDateChange,
        handleShortenMultiple,
        handleCopy,
        handleClear,
        handleOpen,
        handleShare,
        onUrlsChange,
        urlCount,
        setShowQR,
        selectedURL,
        setSelectedURL,
    };
}

export default useBulkMode;