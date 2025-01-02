import React from 'react';
import { Button } from "@/components/ui/button";
import { LinkIcon, Copy, ExternalLink, Share2, QrCode } from "lucide-react";
import { ShortenedURL } from '../types/types';

interface ResultCardProps {
  item: ShortenedURL;
  onShowQR: (url: string) => void;
  onCopy: (url: string) => void;
  onOpen: (url: string) => void;
  onShare: (url: string) => void;
}

export const ResultCard = ({ item, onShowQR, onCopy, onOpen, onShare }: ResultCardProps) => (
  <div className="group p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 space-y-2 border border-gray-100">
    <div className="flex items-center space-x-2">
      <LinkIcon className="h-4 w-4 text-blue-500" />
      <p className="text-sm text-gray-500 truncate flex-1">{item.original}</p>
    </div>
    <p className="text-blue-600 font-medium select-all cursor-pointer hover:text-blue-700 transition-colors">
      {item.shortened}
    </p>
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCopy(item.shortened)}
        className="hover:bg-blue-50"
        title="Copy"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onOpen(item.shortened)}
        className="hover:bg-blue-50"
        title="Open"
      >
        <ExternalLink className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onShare(item.shortened)}
        className="hover:bg-blue-50"
        title="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onShowQR(item.shortened)}
        className="hover:bg-blue-50"
        title="QR Code"
      >
        <QrCode className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
