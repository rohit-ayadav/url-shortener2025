import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  LinkIcon,
  Copy,
  ExternalLink,
  Share2,
  QrCode,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import QRCodeModal from './QRCodeModal';

interface ShortenedURL {
  original: string;
  shortened: string;
  expiresAt?: string;
}

export const ResultCard = (item: ShortenedURL) => {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [selectedURL, setSelectedURL] = useState('');

  const toast = useToast();

  const handleOpen = (url: string) => {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank');
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      if (!url.startsWith('http')) {
        url = `https://${url}`;
      }
      try {
        await navigator.share({ url });
        toast.toast({
          title: 'Success',
          description: 'URL shared successfully',
          variant: 'default',
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const onShowQR = (url: string) => {
    setSelectedURL(url);
    setShowQR(true);
  };

  const handleCopy = (url: string) => {
    setCopied(true);
    navigator.clipboard.writeText(url);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TooltipProvider>
      <div
        className="group p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 space-y-4 border border-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          {item.expiresAt && (
            <Badge variant="outline" className="gap-1">
              <Clock className="w-3 h-3" />
              Expires {formatDate(item.expiresAt)}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
          <LinkIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-gray-600 break-all">
            {isHovered ? item.original : item.original.length > 50
              ? `${item.original.substring(0, 50)}...`
              : item.original}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-blue-600 font-medium select-all cursor-pointer hover:text-blue-700 transition-colors text-lg">
            {item.shortened}
          </p>
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(item.shortened)}
                className={`hover:bg-blue-50 ${copied ? 'text-green-600' : ''}`}
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Copied!' : 'Copy URL'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpen(item.shortened)}
                className="hover:bg-blue-50"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open URL</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare(item.shortened)}
                className="hover:bg-blue-50"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share URL</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onShowQR(item.shortened)}
                className="hover:bg-blue-50"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate QR Code</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      {showQR && selectedURL && (
        <QRCodeModal
          url={selectedURL}
          onClose={() => setShowQR(false)}
        />
      )}
    </TooltipProvider>
  );
};

export default ResultCard;
