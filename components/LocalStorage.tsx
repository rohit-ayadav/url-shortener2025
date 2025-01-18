import { findTotalClick } from "@/lib/FindTotalClick";

interface UrlEntry {
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
    totalClicks?: number;
}

const LOCALSTORAGE_KEY = 'shortenedUrls';

const ERROR_MESSAGES = {
    STORAGE_FAILED: 'Failed to store shortened URL in localStorage',
    INVALID_DATA: 'Invalid data structure found in localStorage',
    URL_EXISTS: 'This URL has already been shortened'
} as const;

// Cache for storing parsed localStorage data
let cachedEntries: UrlEntry[] | null = null;

const parseStorageData = (): UrlEntry[] => {
    if (cachedEntries) return cachedEntries;

    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!data) return [];

    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            cachedEntries = parsed;
            return parsed;
        }
        console.warn('Converting from old storage format');
        return [];
    } catch (error) {
        console.error('Error parsing localStorage data:', error);
        return [];
    }
};

const saveToLocalStorage = (shortUrl: string, originalUrl: string): void => {
    if (!shortUrl || !originalUrl) {
        throw new Error('Short URL and original URL are required');
    }

    try {
        const entries = parseStorageData();

        // Check for duplicate shortUrl using Set for O(1) lookup
        const urlSet = new Set(entries.map(entry => entry.shortUrl));
        if (urlSet.has(shortUrl)) {
            console.warn('URL already exists in storage');
            return;
        }

        // Create new entry
        const newEntry: UrlEntry = {
            shortUrl,
            originalUrl,
            createdAt: new Date().toISOString()
        };

        entries.push(newEntry);
        cachedEntries = entries;
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(entries));

    } catch (error) {
        console.error('Error saving to localStorage:', error);
        if (error instanceof Error && Object.values(ERROR_MESSAGES).includes(error.message as typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES])) {
            throw error;
        }
        throw new Error(ERROR_MESSAGES.STORAGE_FAILED);
    }
};

const getStoredUrls = async (): Promise<UrlEntry[]> => {
    try {
        const entries = parseStorageData();
        
        // Use Promise.all for concurrent requests
        const clickDataPromises = entries.map(entry => 
            findTotalClick(entry.originalUrl)
                .then(clicks => ({ ...entry, totalClicks: Number(clicks) || 0 }))
                .catch(() => ({ ...entry, totalClicks: 0 }))
        );

        const updatedEntries = await Promise.all(clickDataPromises);
        return updatedEntries;

    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return parseStorageData(); // Return entries without click data on error
    }
};

const deleteFromLocalStorage = (shortUrl: string): void => {
    try {
        const entries = parseStorageData();
        const updatedEntries = entries.filter(entry => entry.shortUrl !== shortUrl);
        
        cachedEntries = updatedEntries;
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedEntries));

    } catch (error) {
        console.error('Error deleting from localStorage:', error);
    }
};

export { saveToLocalStorage, getStoredUrls, deleteFromLocalStorage };
export type { UrlEntry };