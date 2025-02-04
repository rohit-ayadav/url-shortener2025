export const formatUrl = (url: string) => {
    if (!url) return "";
    const base = "https://rushort.site/";
    if (!url.startsWith(base)) return base + url;
    if (!url.startsWith('http')) return 'https://' + url;
    return url;
};