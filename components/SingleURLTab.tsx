import React from 'react';
import { AlertCircle, Link, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SingleURLTabProps {
  url: string;
  alias: string;
  aliasError: string;
  loading: boolean;
  onUrlChange: (value: string) => void;
  onAliasChange: (value: string) => void;
  onShorten: () => void;
  length: number;
  onLengthChange: (value: number) => void;
  prefix: string;
  onPrefixChange: (value: string) => void;
}

export const SingleURLTab = ({
  url,
  alias,
  aliasError,
  loading,
  onUrlChange,
  onAliasChange,
  onShorten,
  length,
  onLengthChange,
  prefix,
  onPrefixChange,
}: SingleURLTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL to Shorten</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Link className="h-4 w-4 text-gray-500" />
          </div>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://example.com"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            type="number"
            value={length || ''}
            onChange={(e) => onLengthChange(Number(e.target.value))}
            placeholder="Length of short URL"
            min={1}
            max={32}
            className="w-full"
          />
          <p className="text-sm text-gray-500">Default: 4 characters</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prefix">Prefix</Label>
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

      <div className="space-y-2">
        <Label htmlFor="alias">Custom Alias</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="text-gray-500">rushort.site/</span>
          </div>
          <Input
            id="alias"
            value={alias}
            onChange={(e) => onAliasChange(e.target.value)}
            placeholder="custom-alias (optional)"
            className="pl-28"
          />
        </div>
        {aliasError && (
          <p className="text-sm text-red-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{aliasError}</span>
          </p>
        )}
      </div>

      <Button
        onClick={onShorten}
        disabled={loading || !url}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Shortening...
          </span>
        ) : (
          'Shorten URL'
        )}
      </Button>
    </div>
  );
};

export default SingleURLTab;