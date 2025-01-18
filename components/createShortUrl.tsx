import { toast } from 'react-hot-toast';
import { saveToLocalStorage } from './LocalStorage';

interface ShortUrlResponse {
    shortenURL: string;
    message: string;
}

const LOCALSTORAGE_KEY = 'shortenedUrls';

interface Stats {
    totalShortenedURLsCount: number;
    totalClicks: number;
}

// Constants
const API_ENDPOINTS = {
    shortener: '/api/urlshortener',
} as const;

const ERROR_MESSAGES = {
    NO_INTERNET: 'No internet connection. Please check your network settings.',
    INVALID_ALIAS: 'Invalid alias. Please use only alphanumeric characters.',
    CREATE_FAILED: 'Failed to create short URL',
    FETCH_FAILED: 'Failed to fetch stats',
    STORAGE_FAILED: 'Failed to store shortened URL in localStorage',
} as const;

// Utility functions
const isValidAlias = (alias: string): boolean => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(alias);
};

const checkInternetConnection = (): boolean => {
    return navigator.onLine;
};


// Main functions

export const createShortUrl = async (
    originalUrl: string,
    alias?: string,
    prefix?: string,
    length?: number,
): Promise<string> => {



    // Validate internet connection
    if (!checkInternetConnection()) {
        toast.error(ERROR_MESSAGES.NO_INTERNET);
        throw new Error(ERROR_MESSAGES.NO_INTERNET);
    }

    // Validate alias if provided
    if (alias && !isValidAlias(alias)) {
        toast.error(ERROR_MESSAGES.INVALID_ALIAS);
        throw new Error(ERROR_MESSAGES.INVALID_ALIAS);
    }

    try {
        const response = await fetch(API_ENDPOINTS.shortener, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl, alias, prefix, length }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || ERROR_MESSAGES.CREATE_FAILED;
            throw new Error(errorMessage);
        }

        const data = await response.json() as ShortUrlResponse;

        // Update stats in background
        // getStats().catch(console.error);

        // Store URL in localStorage
        saveToLocalStorage(data.shortenURL, originalUrl);

        toast.success(data.message);
        return data.shortenURL;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error creating short URL:', error);
        toast.error(errorMessage);
        throw error;
    }
};

export const getStats = async (): Promise<Stats> => {
    if (!checkInternetConnection()) {
        toast.error(ERROR_MESSAGES.NO_INTERNET);
        throw new Error(ERROR_MESSAGES.NO_INTERNET);
    }

    try {
        const response = await fetch(API_ENDPOINTS.shortener);

        if (!response.ok) {
            throw new Error(ERROR_MESSAGES.FETCH_FAILED);
        }

        return await response.json() as Stats;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast.error(`${ERROR_MESSAGES.FETCH_FAILED}: ${errorMessage}`);
        throw error;
    }
};