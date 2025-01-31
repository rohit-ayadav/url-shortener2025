import crypto from 'crypto';

interface ShortUrlOptions {
    length?: number;
    prefix?: string;
}

const generateShortUrl = (options: ShortUrlOptions = {}): string => {
    const { length = 6, prefix = '' } = options;

    if (length < 1 || length > 32) {
        throw new Error("Length must be between 1 and 32 characters");
    }

    const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ALPHANUMERIC = LETTERS + '0123456789';

    const getSecureChar = (charset: string): string => {
        const randomBytes = crypto.randomBytes(1);
        const randomIndex = randomBytes[0] % charset.length;
        return charset[randomIndex];
    };

    const firstChar = getSecureChar(LETTERS);
    let result = firstChar;
    for (let i = 1; i < length; i++) {
        result += getSecureChar(ALPHANUMERIC);
    }
    return prefix + result;
};

export default { generateShortUrl };