import crypto from 'crypto';

interface ShortUrlOptions {
    length?: number;
    prefix?: string;
}

const generateShortUrl = (options: ShortUrlOptions = {}): string => {
    const { length = 6, prefix = '' } = options;

    // Input validation
    if (length < 1 || length > 32) {
        throw new Error("Length must be between 1 and 32 characters");
    }

    // Constants
    const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ALPHANUMERIC = LETTERS + '0123456789';

    // Generate secure random string
    const getSecureChar = (charset: string): string => {
        const randomBytes = crypto.randomBytes(1);
        const randomIndex = randomBytes[0] % charset.length;
        return charset[randomIndex];
    };

    // First character must be a letter
    const firstChar = getSecureChar(LETTERS);

    // Generate remaining characters
    let result = firstChar;
    for (let i = 1; i < length; i++) {
        result += getSecureChar(ALPHANUMERIC);
    }

    return prefix + result;
};

export default { generateShortUrl };