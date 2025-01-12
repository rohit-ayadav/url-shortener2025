"use client";
import React from 'react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stats } from '@/components/Stats';
import Help from '@/components/help/page';
import { SingleURLTab } from '@/components/SingleURLTab';
import { MultipleURLsTab } from '@/components/MultipleURLsTab';
import { TextModeTab } from '@/components/TextModeTab';
import { ResultCard } from '@/components/ResultCard';
import { QRCodeModal } from '@/components/QRCodeModal';
import { ShortenedURL } from '@/types/types';
import { isValidURL, cleanText } from '@/utils/utils';
import { useAlias } from '@/hooks/useAlias';
import { createShortUrl, getStats } from '@/components/createShortUrl';


const URLShortener = () => {
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState('');
  const [text, setText] = useState('');
  const [processedText, setProcessedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shortenedURLs, setShortenedURLs] = useState<ShortenedURL[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [selectedURL, setSelectedURL] = useState<string | null>(null);
  const [totalShortenedUrls, setTotalShortenedUrls] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const { alias, setAlias, aliasError } = useAlias();

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getStats();
      setTotalShortenedUrls(stats.totalShortenedURLsCount);
      setTotalClicks(stats.totalClicks);
    };
    fetchStats();
  }, []);

  const handleShortenSingle = async () => {
    if (!navigator.onLine) {
      setError('No internet connection');
      return;
    }
    if (!url) {
      setError('Please enter a URL');
      toast.error('Please enter a URL');
      return;
    }
    if (!isValidURL(url)) {
      setError('Please enter a valid URL');
      toast.error('Please enter a valid URL');
      return;
    }
    if (aliasError) {
      setError('Please fix the alias error');
      return;
    }

    setLoading(true);
    try {
      const shortened = await createShortUrl(url, alias);
      setShortenedURLs([{ original: url, shortened }]);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShortenMultiple = async () => {
    if (!urls) {
      setError('Please enter URLs');
      toast.error('Please enter URLs');
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection');
      return;
    }

    setLoading(true);
    try {
      const urlList = urls.split('\n').filter(u => u.trim());
      const shortened = await Promise.all(
        urlList.map(async u => ({
          original: u,
          shortened: await createShortUrl(u, '')
        }))
      );
      setShortenedURLs(shortened);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessText = async () => {
    if (!text) {
      setError('Please enter text');
      toast.error('Please enter text');
      return;
    }
    if (!navigator.onLine) {
      setError('No internet connection');
      return;
    }

    setLoading(true);
    try {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let newText = text;
      const urls = text.match(urlRegex) || [];
      const shortened = await Promise.all(
        urls.map(async url => ({
          original: url,
          shortened: await createShortUrl(url, '')
        }))
      );

      shortened.forEach(({ original, shortened }) => {
        newText = newText.replace(original, shortened);
      });
      await navigator.clipboard.writeText(newText);
      toast.success('Text processed and copied');
      setProcessedText(newText);
      setShortenedURLs(shortened);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setText(cleanText(clipboardText));
    toast.success('Text pasted from clipboard');
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard');
  };

  const handleOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ url });
        toast.success('URL shared successfully');
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  // Progressive Web App Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js?v=1.0.0')
          .then((registration) => {
            console.log('Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                URL Shortener
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="single" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="single">Single URL</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple URLs</TabsTrigger>
                  <TabsTrigger value="text">Text Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="single">
                  <SingleURLTab
                    url={url}
                    alias={alias}
                    aliasError={aliasError}
                    loading={loading}
                    onUrlChange={setUrl}
                    onAliasChange={setAlias}
                    onShorten={handleShortenSingle}
                  />
                </TabsContent>

                <TabsContent value="multiple">
                  <MultipleURLsTab
                    urls={urls}
                    loading={loading}
                    onUrlsChange={setUrls}
                    onShorten={handleShortenMultiple}
                  />
                </TabsContent>

                <TabsContent value="text">
                  <TextModeTab
                    text={text}
                    processedText={processedText}
                    loading={loading}
                    onTextChange={setText}
                    onProcess={handleProcessText}
                    onPaste={handlePasteClipboard}
                    onClear={() => {
                      setText('');
                      setProcessedText('');
                      setShortenedURLs([]);
                      setError('');
                    }}
                    onCopyProcessed={() => handleCopy(processedText)}
                  />
                </TabsContent>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {shortenedURLs.length > 0 && (
                  <div className="space-y-3 animate-in fade-in-50 duration-500">
                    {shortenedURLs.map((item, index) => (
                      <ResultCard
                        key={index}
                        item={item}
                        onShowQR={(url: string) => {
                          setSelectedURL(url);
                          setShowQR(true);
                        }}
                        onCopy={handleCopy}
                        onOpen={handleOpen} 
                        onShare={handleShare}
                      />
                    ))}
                  </div>
                )}
              </Tabs>
            </CardContent>
            <Stats
              totalShortenedUrls={totalShortenedUrls}
              totalClicks={totalClicks}
            />
          </Card>
        </div>
        <Help />
      </div>

      {showQR && selectedURL && (
        <QRCodeModal
          url={selectedURL}
          onClose={() => setShowQR(false)}
        />
      )}

    </>
  );
};

export default URLShortener;