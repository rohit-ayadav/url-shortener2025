import toast from 'react-hot-toast';
import connectDB from '@/utils/db';
import { Url } from '@/models/urlShortener';

connectDB();

const isValidAlias = (alias: string) => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(alias);
};

const createShortUrl = async (originalUrl: string, alias: string, prefix: string, length: number) => {
    if (!navigator.onLine) {
        toast.error('No internet connection. Please check your network settings.');
        throw new Error('No internet connection. Please check your network settings.');
    }
    if (alias) {
        if (!isValidAlias(alias)) {
            toast.error('Invalid alias. Please use only alphanumeric characters.');
            throw new Error('Invalid alias. Please use only alphanumeric characters.');
        }
    }
    try {
        const response = await fetch('/api/urlshortener', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ originalUrl, alias, prefix, length })
        });
        if (!response.ok) {
            throw new Error('Failed to create short URL');
        }
        const data = await response.json();
        return data.shortenURL;

    } catch (error) {
        console.error('Error creating short URL:', error);
        toast.error(String(error));
        throw error;
    }
};

const getStats = async () => {
    try {
        const response = await fetch('/api/urlshortener');
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return await response.json();
    } catch (error) {
        toast.error(`Failed to fetch stats: ${(error as Error).message}`);
    }
}

export { createShortUrl, getStats };