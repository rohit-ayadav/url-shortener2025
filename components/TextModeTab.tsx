import React from 'react';
import { Copy, CircleX, ClipboardCopy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TextModeTabProps {
  text: string;
  processedText: string;
  loading: boolean;
  onTextChange: (value: string) => void;
  onProcess: () => void;
  onPaste: () => void;
  onClear: () => void;
  onCopyProcessed: () => void;
  length: number;
  onLengthChange: (value: number) => void;
  prefix: string;
  onPrefixChange: (value: string) => void;
  expirationDate: Date | null;
  onExpirationDateChange: (value: Date) => void;
}

export const TextModeTab = ({
  text,
  processedText,
  loading,
  onTextChange,
  onProcess,
  onPaste,
  onClear,
  onCopyProcessed,
  length,
  onLengthChange,
  prefix,
  onPrefixChange,
  expirationDate,
  onExpirationDateChange,
}: TextModeTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input-text">Text with URLs</Label>
        <div className="relative">
          <Textarea
            id="input-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Paste or type text containing URLs to shorten"
            rows={8}
            className="resize-y min-h-[200px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Short URL Length</Label>
          <Input
            id="length"
            type="number"
            value={length || ''}
            onChange={(e) => onLengthChange(Number(e.target.value))}
            placeholder="6"
            min={1}
            max={32}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Default: 4 characters</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prefix">URL Prefix</Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => onPrefixChange(e.target.value)}
            placeholder="Optional prefix"
            className="w-full"
            maxLength={10}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          onClick={onProcess}
          disabled={loading || !text.trim()}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </span>
          ) : (
            'Process Text'
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onPaste}
          title="Paste from clipboard"
          className="text-gray-600 hover:text-gray-900"
        >
          <ClipboardCopy className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onClear}
          title="Clear text"
          className="text-gray-600 hover:text-red-600"
        >
          <CircleX className="h-5 w-5" />
        </Button>
      </div>

      {processedText && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base">Processed Text</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopyProcessed}
                className="text-blue-600 hover:text-blue-700"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Result
              </Button>
            </div>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-800 whitespace-pre-wrap">
              {processedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextModeTab;