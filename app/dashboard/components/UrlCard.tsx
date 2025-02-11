import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Copy, QrCode, ExternalLink } from 'lucide-react';
import { UrlData } from '@/types/types';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import QRCodeModal from '@/components/QRCodeModal';
// URL Card Component
const UrlCard = ({ url }: { url: UrlData }) => {
    const [showQR, setShowQR] = useState(false);
    const [selectedURL, setSelectedURL] = useState('');
    const toast = useToast();

    const handleQR = (url: string) => {
        const urlData = new URL(`https://rushort.site/${url}`);
        setSelectedURL(urlData.href);
        setShowQR(true);
    };

    const handleCopy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.toast({
                title: 'Copied',
                description: 'URL copied to clipboard',
                variant: 'default'
            });
        } catch (error) {
            toast.toast({
                title: 'Error',
                description: 'Failed to copy URL',
                variant: 'destructive'
            });
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                <div className="w-full sm:max-w-[60%]">
                    <p className="text-sm text-gray-500 truncate" title={url.originalUrl}>
                        {url.originalUrl}
                    </p>
                    <p className="text-blue-600 font-medium break-all">{url.shortUrl}</p>
                </div>
                <span className="text-sm text-gray-500 shrink-0">
                    {formatDistanceToNow(url.created, { addSuffix: true })}
                </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-sm font-medium">{url.clicks} clicks</span>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(url.shortUrl)}
                        title="Copy URL"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        title="Generate QR Code"
                        onClick={() => handleQR(url.shortUrl)}
                    >
                        <QrCode className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        title="Open URL"
                        onClick={() => window.open(url.shortUrl, '_blank')}
                    >
                        <ExternalLink className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            {showQR && (
                <QRCodeModal url={selectedURL} onClose={() => setShowQR(false)} />
            )}
        </div>
    );
};

export default UrlCard;