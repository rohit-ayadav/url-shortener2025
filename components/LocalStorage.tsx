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

const saveToLocalStorage = (shortUrl: string, originalUrl: string): void => {
    if (!shortUrl || !originalUrl) {
        throw new Error('Short URL and original URL are required');
    }

    try {
        // Get existing entries
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        let entries: UrlEntry[] = [];

        if (data) {
            try {
                const parsed = JSON.parse(data);
                // Validate the parsed data is an array
                if (Array.isArray(parsed)) {
                    entries = parsed;
                } else {
                    // Handle migration from old format if necessary
                    console.warn('Converting from old storage format');
                    entries = [];
                }
                console.log('Successfully parsed localStorage data:', entries);
            } catch (parseError) {
                console.error('Error parsing localStorage data:', parseError);
                throw new Error(ERROR_MESSAGES.INVALID_DATA);
            }
        }

        // Check for duplicate shortUrl
        if (entries.some(entry => entry.shortUrl === shortUrl)) {
            console.warn('URL already exists in storage');
            // throw new Error(ERROR_MESSAGES.URL_EXISTS);
            return;
        }

        // Create new entry
        const newEntry: UrlEntry = {
            shortUrl,
            originalUrl,
            createdAt: new Date().toISOString()
        };

        // Add to entries array
        entries.push(newEntry);

        // Save back to localStorage
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(entries));

        console.log('Successfully saved URL to localStorage:', shortUrl);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        // Re-throw the error with a custom message if it's not already our error
        if (error instanceof Error && Object.values(ERROR_MESSAGES).includes(error.message as typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES])) {
            throw error;
        } else {
            throw new Error(ERROR_MESSAGES.STORAGE_FAILED);
        }
    }
};

// Helper function to retrieve URLs (optional but useful)
const getStoredUrls = async (): Promise<UrlEntry[]> => {
    try {
        console.log('Retrieving URLs from localStorage');
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!data) return [];

        // Find total clicks for each URL and then parse the data

        const entries = JSON.parse(data);
        if (!Array.isArray(entries)) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
        }
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            const clickData = await findTotalClick(entry.originalUrl);
            console.log('Click data for', entry.originalUrl, ':', clickData);
            entries[i].totalClicks = clickData || 0;
        }

        console.log('Successfully retrieved URLs from localStorage:', entries);
        return entries as UrlEntry[];
    } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return [];
    }
};
const deleteFromLocalStorage = (shortUrl: string): void => {
    try {
        const data = localStorage.getItem(LOCALSTORAGE_KEY);
        if (!data) return;

        const entries = JSON.parse(data);
        if (!Array.isArray(entries)) {
            throw new Error(ERROR_MESSAGES.INVALID_DATA);
        }

        const updatedEntries = entries.filter((entry: UrlEntry) => entry.shortUrl !== shortUrl);

        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedEntries));

        console.log('Successfully deleted URL from localStorage:', shortUrl);
    } catch (error) {
        console.error('Error deleting from localStorage:', error);
    }
}
    ;
export { saveToLocalStorage, getStoredUrls, deleteFromLocalStorage };
export type { UrlEntry };