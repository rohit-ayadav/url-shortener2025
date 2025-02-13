import { isValidURL } from '@/utils/utils';
import React, { useEffect, useState } from 'react'
import { useToast } from './use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useAlias } from './useAlias';
import { getSubscriptionStatus } from '@/action/getSubscriptionStatus';

const useSingleShorten = () => {
    const [url, setUrl] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [length, setLength] = React.useState(4);
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [error, setError] = React.useState('');
    const [shortenedURLs, setShortenedURLs] = useState<{ original: string, shortened: string, expiresAt: string | null }[]>([]);
    const toast = useToast();
    const [showQR, setShowQR] = React.useState(false);
    const [selectedURL, setSelectedURL] = React.useState('');
    const { alias, setAlias, aliasError, setAliasError, prefix, setPrefix } = useAlias();
    const [subscriptionStatus, setSubscriptionStatus] = useState('free'); // free basic pro enterprise

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            const response = await getSubscriptionStatus();
            if (response.success) {
                setSubscriptionStatus(response.subscriptionStatus);
            }
        };
        fetchSubscriptionStatus();
        if (subscriptionStatus === 'free') {
            const sixMonthsFromNow = new Date();
            sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
            setExpirationDate(sixMonthsFromNow);
        }
    }, []);

    useEffect(() => {
        const TotalLength = alias.length + prefix.length + length;
        if (TotalLength > 32) {
            setAliasError('Total length of alias, prefix and length should not exceed 32 characters');
            toast.toast({
                title: 'Error',
                description: 'Total length of alias, prefix and length should not exceed 32 characters',
                variant: 'destructive'
            });
            setAlias(alias.slice(0, 32 - prefix.length - length));
        } else {
            setAliasError('');
        }
    }, [alias, prefix, length]);

    const handleShorten = async () => {
        setError('');
        if (alias.length > 0 && !/^[a-zA-Z0-9-_]*$/.test(alias)) {
            setAliasError('Alias can only contain letters, numbers, hyphens, and underscores');
            toast.toast({
                title: 'Error',
                description: 'Alias can only contain letters, numbers, hyphens, and underscores',
                variant: 'destructive'
            });
            return;
        }
        setAliasError('');
        setAlias(alias.trim());
        setSelectedURL('');
        setShowQR(false);
        setShortenedURLs([]);
        console.log(`\n\nShortenedURLs before callAPI: ${shortenedURLs}`);
        if (!url) {
            setError('Please enter a URL');
            toast.toast({
                title: 'Error',
                description: 'Please enter a URL',
                variant: 'destructive'
            });
            return;
        }
        if (!isValidURL(url)) {
            setError('Please enter a valid URL');
            toast.toast({
                title: 'Error',
                description: 'Please enter a valid URL',
                variant: 'destructive'
            });
            return;
        }

        setLoading(true);
        try {

            const shortened = await callAPI(url, alias, prefix, length, expirationDate);
            setShortenedURLs([{ original: url, shortened, expiresAt: expirationDate ? expirationDate.toISOString() : null }, ...shortenedURLs]);
            // setUrl('');
            setError('');
        } catch (err: any) {
            setError(err.message);
            toast.toast({
                title: 'Error',
                description: err.message,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
            console.log(`\n\nShortenedURLs after callAPI: ${shortenedURLs}`);
        }
    };

    const callAPI = async (url: string, alias: string, prefix: string, length: number, expirationDate: Date | null) => {
        try {
            // console.log(`\n\ncallAPI Called with: ${url}, ${alias}, ${prefix}, ${length}, ${expirationDate}`);
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
                        handleShorten();
                    }}>Try again</ToastAction>,
                variant: 'destructive',
            });
            if ((err as Error).message === 'Monthly Quota exceeded, Kindly upgrade to premium') {
                toast.toast({
                    title: 'Monthly Quota exceeded',
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

    const isUrlValid: boolean = url.length === 0 || isValidURL(url);

    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 5);

    const formatDateForInput = (date: Date | null): string => {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const dateValue = e.target.value;
        if (!dateValue) {
            setExpirationDate(null);
            return;
        }
        const newDate = new Date(dateValue);
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        if (subscriptionStatus === 'free' && newDate > sixMonthsFromNow) {
            toast.toast({
                title: 'Maximum expiration date',
                description: 'Link expiration date cannot be more than 6 months for free users',
                variant: 'destructive'
            });
            setExpirationDate(sixMonthsFromNow);
            return;
        }
        newDate.setHours(23, 59, 59, 999);
        setExpirationDate(newDate);
    };

    const handleDurationChange = (value: string): void => {
        const now = new Date();
        let expiryDate: Date | null = new Date();

        switch (value) {
            case '1day':
                expiryDate.setDate(now.getDate() + 1);
                break;
            case '2days':
                expiryDate.setDate(now.getDate() + 2);
                break;
            case '5days':
                expiryDate.setDate(now.getDate() + 5);
                break;
            case '1week':
                expiryDate.setDate(now.getDate() + 7);
                break;
            case '1month':
                expiryDate.setMonth(now.getMonth() + 1);
                break;
            case '6months':
                expiryDate.setMonth(now.getMonth() + 6);
                break;
            case '1year':
                if (subscriptionStatus === 'free') {
                    toast.toast({
                        title: 'Maximum expiration date',
                        description: 'Link expiration date cannot be more than 6 months for free users',
                        variant: 'destructive'
                    });
                    expiryDate.setMonth(now.getMonth() + 6);
                } else {
                    expiryDate.setFullYear(now.getFullYear() + 1);
                }
                break;
            default:
                expiryDate = null;
                break;
        }

        if (subscriptionStatus === 'free' && expiryDate && expiryDate > new Date(now.setMonth(now.getMonth() + 6))) {
            toast.toast({
                title: 'Maximum expiration date',
                description: 'Link expiration date cannot be more than 6 months for free users',
                variant: 'destructive'
            });
            expiryDate = new Date(now.setMonth(now.getMonth() + 6));
        }
        if (expiryDate) {
            expiryDate.setHours(23, 59, 59, 999);
        }
        setExpirationDate(expiryDate);
    };


    return {
        url,
        alias,
        aliasError,
        loading,
        onUrlChange: (text: string) => setUrl(text),
        onAliasChange: (text: string) => setAlias(text),
        onShorten: handleShorten,
        length,
        onLengthChange: (value: number) => setLength(value),
        prefix,
        onPrefixChange: (value: string) => setPrefix(value),
        expirationDate,
        onExpirationDateChange: (value: Date | null) => setExpirationDate(value),
        error,
        shortenedURLs,
        showQR,
        selectedURL,
        setShowQR,
        isUrlValid,
        minDate,
        maxDate,
        formatDateForInput,
        handleDateChange,
        handleDurationChange
    };
}

export default useSingleShorten