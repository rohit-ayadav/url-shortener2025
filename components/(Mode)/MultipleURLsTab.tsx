"use client";
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  ClipboardCopy,
  CircleX,
  Link2,
  Calendar,
  RefreshCw,
  Hash,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import useBulkMode from '@/hooks/useBulkMode';
import ResultCard from '../ResultCard';
import { useToast } from '@/hooks/use-toast';

const MAX_URLS = 1000;
const MIN_LENGTH = 4;
const MAX_LENGTH = 32;

const MultipleURLsPage = () => {
  const {
    urls,
    setUrls,
    loading,
    length,
    setLength,
    prefix,
    setPrefix,
    shortenedURLs,
    error,
    setExpirationDate,
    handleShortenMultiple,
    handleClear,
    handleReadCSV,
    handleDownloadCSV,
    urlCount } = useBulkMode();

  const today = new Date().toISOString().split('T')[0];
  const toast = useToast();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-purple-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-purple-900">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Bulk URL Processor
          </CardTitle>
          <CardDescription className="text-purple-600">
            Enter one URL per line to process them all at once
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* URL Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium text-purple-900">URLs to Shorten</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const text = await navigator.clipboard.readText();
                      setUrls(text);
                    }}
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" />
                    Paste
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <CircleX className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  placeholder="https://example.com/long-url-1&#10;https://example.com/long-url-2&#10;https://example.com/long-url-3"
                  className={`min-h-[250px] resize-y p-4 text-base bg-white border-purple-100 focus:border-purple-300 focus:ring-purple-200 ${error ? 'border-red-300' : ''
                    }`}
                />
                <div className="absolute bottom-3 right-3 text-sm text-gray-400">
                  {urlCount}/{MAX_URLS} URLs
                </div>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length" className="flex items-center gap-2 text-purple-900">
                  <Hash className="h-4 w-4" />
                  URL Length ({MIN_LENGTH}-{MAX_LENGTH})
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(+e.target.value)}
                  className="border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                  min={MIN_LENGTH}
                  max={MAX_LENGTH}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prefix" className="flex items-center gap-2 text-purple-900">
                  <Link2 className="h-4 w-4" />
                  Custom Prefix
                </Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g., promo, blog"
                  className="border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration" className="flex items-center gap-2 text-purple-900">
                  <Calendar className="h-4 w-4" />
                  Expiration
                </Label>
                <Input
                  id="expiration"
                  type="date"
                  onChange={(e) => setExpirationDate(new Date(e.target.value))}
                  className="border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                  min={today}
                />
              </div>
            </div>

            {/* Process Button */}
            <Button
              onClick={handleShortenMultiple}
              disabled={loading || urls.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Processing {urlCount} URLs...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-6 w-6" />
                  Shorten {urlCount} URLs
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload CSV and Download CSV */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <Label
            htmlFor="csv"
            className="text-purple-900"
            onClick={() => {
              toast.toast({
                title: 'Please note',
                description: 'Upload a csv file with headers as "OriginalURL" and in first column',
                variant: 'default',
              });
            }}
          >
            Upload CSV
          </Label>
          <input
            type="file"
            id="csv"
            accept=".csv"
            onChange={handleReadCSV}
            className="hidden"
          />
        </div>
        <Button
          onClick={handleDownloadCSV}
          disabled={shortenedURLs.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Download CSV
        </Button>
      </div>

      {shortenedURLs.length > 0 && (
        <div className="space-y-3 animate-in fade-in-50 duration-500 mt-6">
          {shortenedURLs.map((item, index) => (
            <ResultCard
              key={index}
              original={item.original} shortened={item.shortened} expiresAt={item.expiresAt}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleURLsPage;