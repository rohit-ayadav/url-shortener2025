import { format } from 'date-fns';
import { UrlData } from '@/types/types';

export const exportToCSV = (urls: UrlData[]) => {
    const headers = ['Original URL', 'Short URL', 'Clicks', 'Created', 'Status', 'Expires'];
    const data = urls.map(url => [
        url.originalUrl,
        url.shortUrl,
        url.clicks,
        format(url.created, 'PPP'),
        url.status,
        url.expireAt ? format(url.expireAt, 'PPP') : 'Never'
    ]);

    const csvContent = [headers, ...data]
        .map(row => row.join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `urls-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
};
