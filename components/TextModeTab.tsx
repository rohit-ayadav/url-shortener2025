import React from 'react';
import { Copy, CircleX, ClipboardCopy, Loader2, Calendar, Hash, Link2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import useTextModeShorten from '@/hooks/useTextModeShorten';
import { ResultCard } from './ResultCard';

const TextModeTab = () => {
  const {
    text,
    setText,
    processedText,
    loading,
    length,
    setLength,
    prefix,
    setPrefix,
    expirationDate,
    setExpirationDate,
    shortenedURLs,
    error,
    showQR,
    setShowQR,
    selectedURL,
    setSelectedURL,
    handleProcess,
    handlePaste,
    handleClear,
    handleCopyProcessed,
    handleCopy,
    handleOpen,
    handleShare,
  } = useTextModeShorten();
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="input-text" className="text-lg font-semibold text-blue-900">
            Input Text
          </Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePaste}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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
            id="input-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text containing URLs here..."
            className="min-h-[200px] resize-y p-4 text-base bg-white border-blue-100 focus:border-blue-300 focus:ring-blue-200"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-400">
            {text.length} characters
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {error && (
          <Alert className="bg-red-50 text-red-800 border-red-200">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length" className="flex items-center gap-2 text-blue-900">
            <Hash className="h-4 w-4" />
            URL Length
          </Label>
          <Input
            id="length"
            type="number"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            min={1}
            max={32}
          />
          <p className="text-xs text-gray-500">Recommended: 4-8 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prefix" className="flex items-center gap-2 text-blue-900">
            <Link2 className="h-4 w-4" />
            Custom Prefix
          </Label>
          <Input
            id="prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="e.g., promo, blog"
            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
            maxLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiration" className="flex items-center gap-2 text-blue-900">
            <Calendar className="h-4 w-4" />
            Expiration
          </Label>
          <Input
            id="expiration"
            type="date"
            onChange={(e) => setExpirationDate(new Date(e.target.value))}
            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Process Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleProcess}
          disabled={loading}
          className="w-full md:w-auto min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing URLs...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Process Text
            </span>
          )}
        </Button>
      </div>

      {/* Result Section */}
      {processedText && (
        <div className="rounded-xl border border-blue-100 bg-white shadow-lg">
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-900">Processed Result</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyProcessed}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap border border-gray-100">
              {processedText}
            </div>

            <Alert className="bg-blue-50 text-blue-800 border-blue-200">
              <AlertDescription className="text-sm">
                All shortened URLs will be tracked and analytics will be available in your dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {shortenedURLs.length > 0 && (
        <div className="space-y-3 animate-in fade-in-50 duration-500">
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

export default TextModeTab;