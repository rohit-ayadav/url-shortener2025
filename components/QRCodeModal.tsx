import React, { useEffect, useState } from 'react';
import { CircleX, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
}

export const QRCodeModal = ({ url, onClose }: QRCodeModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setError(true);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `qr-code-RUShort-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>QR Code</DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close dialog"
            >
              <CircleX className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4">
          <div className="flex justify-center items-center min-h-[200px] bg-gray-50 rounded-lg relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}
            
            {error ? (
              <div className="text-center text-gray-500 p-4">
                <p>Failed to generate QR code.</p>
                <Button 
                  variant="outline" 
                  onClick={() => handleImageLoad()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
                alt={`QR code for ${url}`}
                className={`rounded shadow-sm ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-3 break-all">{url}</p>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="w-full"
              disabled={isLoading || error}
            >
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;