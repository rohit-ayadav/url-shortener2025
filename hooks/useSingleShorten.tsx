import { createShortUrl } from '@/components/createShortUrl';
import { isValidURL } from '@/utils/utils';
import React from 'react'
import { useToast } from './use-toast';


const useSingleShorten = () => {
    const [url, setUrl] = React.useState('');
    const [alias, setAlias] = React.useState('');
    const [aliasError, setAliasError] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [length, setLength] = React.useState(4);
    const [prefix, setPrefix] = React.useState('');
    const [expirationDate, setExpirationDate] = React.useState<Date | null>(null);
    const [error, setError] = React.useState('');
    const [shortenedURLs, setShortenedURLs] = React.useState<{ original: string, shortened: string, expiresAt?: string }[]>([]);
    const toast = useToast();
    const [showQR, setShowQR] = React.useState(false);
    const [selectedURL, setSelectedURL] = React.useState('');

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

            const shortened = await createShortUrl(url, alias, prefix, length, expirationDate);
            setShortenedURLs([{ original: url, shortened, expiresAt: expirationDate?.toISOString() }, ...shortenedURLs]);
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
        }
    };

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
                expiryDate.setFullYear(now.getFullYear() + 1);
                break;
            default:
                expiryDate = null;
                break;
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