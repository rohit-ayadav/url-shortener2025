import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, MessageCircle, Twitter } from 'lucide-react';
import { formatUrl } from '@/utils/formatUrl';
interface ShareModalProps {
    url: { shortUrl: string };
    isOpen: boolean;
    onClose: () => void;
}
export const ShareModal = ({ url, isOpen, onClose }: ShareModalProps) => {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(formatUrl(url.shortUrl))}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(formatUrl(url.shortUrl))}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(formatUrl(url.shortUrl))}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(formatUrl(url.shortUrl))}`
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share URL</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <Button
                        variant="outline"
                        onClick={() => window.open(shareUrls.twitter, '_blank')}
                        className="flex items-center gap-2"
                    >
                        <Twitter className="h-4 w-4" />
                        Twitter
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.open(shareUrls.facebook, '_blank')}
                        className="flex items-center gap-2"
                    >
                        <Facebook className="h-4 w-4" />
                        Facebook
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.open(shareUrls.linkedin, '_blank')}
                        className="flex items-center gap-2"
                    >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.open(shareUrls.whatsapp, '_blank')}
                        className="flex items-center gap-2"
                    >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                    </Button>
                </div>
                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
