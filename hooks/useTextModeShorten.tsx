import React from 'react'
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import exp from 'constants';


const useTextModeShorten = () => {
    const [text, setText] = useState('');
    const [processedText, setProcessedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState(4);
    const [prefix, setPrefix] = useState('');
    const [expirationDate, setExpirationDate] = useState<Date | null>(null);
    const [shortenedURLs, setShortenedURLs] = useState<{ original: string; shortened: string; expiresAt?: string }[]>([]);
    const [error, setError] = useState('');
    const toast = useToast();

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
                        handleProcess();
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
    const handleProcess = async () => {
        setError('');
        setProcessedText('');
        setShortenedURLs([]);
        console.log(`\n\nhandleProcess Called`);

        if (!text) {
            setError('Please enter text');
            toast.toast({
                title: 'Please enter text',
                description: 'The text field cannot be empty',
                action: <ToastAction
                    altText='Try again'
                    onClick={() => {
                        setError('');

                    }}>Try again</ToastAction>,
                variant: 'destructive',
            })
            return;
        }
        if (!navigator.onLine) {
            setError('No internet connection');
            return;
        }

        console.log(`\n\nProcessing text...`);
        setLoading(true);
        try {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            let newText = text;
            const urls = text.match(urlRegex) || [];
            const shortened = await Promise.all(
                urls.map(async url => ({
                    original: url,
                    shortened: await callAPI(url, "", prefix, length, expirationDate),
                    expiresAt: expirationDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }))
            );

            shortened.forEach(({ original, shortened }) => {
                newText = newText.replace(original, shortened);
            });
            // await navigator.clipboard.writeText(newText);
            console.log(`\n\nThe text has been processed`);
            toast.toast({
                title: 'Success',
                description: 'Text processed and copied',
            });
            setProcessedText(newText);
            setShortenedURLs(shortened);
            setError('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    function cleanText(input: string): string {
        const cleanedCaption = input.replace(/^.*?Caption\s*.*?\n/, "").replace(/^.*?caption\s*.*?\n/, "");
        const finalOutput = cleanedCaption.replace(/^.*?usp=sharing\s*/s, "");
        return finalOutput.trim();
    }

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(cleanText(clipboardText));
        } catch (err) {
            console.error('Failed to read clipboard:', err);
        }
    };

    const handleClear = () => {
        setText('');
        setProcessedText('');
    };

    const handleCopyProcessed = async () => {
        try {
            await navigator.clipboard.writeText(processedText);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return {
        text,
        setText,
        processedText,
        loading,
        length,
        setLength,
        prefix,
        setPrefix,
        setExpirationDate,
        shortenedURLs,
        error,
        handleProcess,
        handlePaste,
        handleClear,
        handleCopyProcessed,
    };
}

export default useTextModeShorten