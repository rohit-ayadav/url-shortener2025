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
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { WifiOff, Download, RefreshCw } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

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
  const { alias, setAlias, aliasError, prefix, setPrefix } = useAlias();
  const [length, setLength] = useState(4);
  // const [prefix, setPrefix] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [offlineUrls, setOfflineUrls] = useState<ShortenedURL[]>([]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        toast.success('Thank you for installing our app!');
        setIsInstallable(false);
      }
    } catch (err) {
      console.error('Installation failed:', err);
    }
    setDeferredPrompt(null);
  };

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing data...');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Limited functionality available.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Offline data handling
  const syncOfflineData = async () => {
    if (!offlineUrls.length) return;

    setIsRefreshing(true);
    try {
      const synced = await Promise.all(
        offlineUrls.map(async ({ original }) => ({
          original,
          shortened: await createShortUrl(original, '', prefix, length, expirationDate)
        }))
      );
      setShortenedURLs(prev => [...prev, ...synced]);
      setOfflineUrls([]);
      toast.success('Offline data synced successfully');
    } catch (err) {
      toast.error('Failed to sync some URLs');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    if (!isOnline) {
      toast.error('Cannot refresh while offline');
      return;
    }

    setIsRefreshing(true);
    try {
      const stats = await getStats();
      setTotalShortenedUrls(stats.totalShortenedURLsCount || 0);
      setTotalClicks(stats.totalClicks || 0);
      setLastSync(new Date());
      toast.success('Data refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Modified shorten handlers with offline support
  const handleShortenSingle = async () => {
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

    setLoading(true);
    try {
      if (!isOnline) {
        // Store URL for later processing
        const offlineUrl = { original: url, shortened: 'Pending sync...' };
        setOfflineUrls(prev => [...prev, offlineUrl]);
        setShortenedURLs(prev => [...prev, offlineUrl]);
        toast.success('URL saved for processing when online');
      } else {
        const shortened = await createShortUrl(url, alias, prefix, length, expirationDate);
        setShortenedURLs([{ original: url, shortened }]);
        setLastSync(new Date());
      }
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getStats();
      setTotalShortenedUrls(stats.totalShortenedURLsCount || 0);
      setTotalClicks(stats.totalClicks || 0);
    };
    fetchStats();
  }, [shortenedURLs, processedText, url, urls, text]);

  // const handleShortenSingle = async () => {
  //   if (!navigator.onLine) {
  //     setError('No internet connection');
  //     return;
  //   }
  //   if (!url) {
  //     setError('Please enter a URL');
  //     toast.error('Please enter a URL');
  //     return;
  //   }
  //   if (!isValidURL(url)) {
  //     setError('Please enter a valid URL');
  //     toast.error('Please enter a valid URL');
  //     return;
  //   }
  //   if (aliasError) {
  //     setError('Please fix the alias error');
  //     return;
  //   }
  //   if (alias.length > 32) {
  //     setError('Alias must be less than 32 characters');
  //     return;
  //   }
  //   if (length < 1 || length > 32) {
  //     setError('Length must be between 1 and 32 characters');
  //     return;
  //   }
  //   if (prefix.length > 32) {
  //     setError('Prefix must be less than 32 characters');
  //     return;
  //   }


  //   setLoading(true);
  //   try {
  //     const shortened = await createShortUrl(url, alias, prefix, length, expirationDate);
  //     setShortenedURLs([{ original: url, shortened }]);
  //     setError('');
  //   } catch (err: any) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          shortened: await createShortUrl(u, '', '', length, expirationDate)
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
          shortened: await createShortUrl(url, '', prefix, length, expirationDate)
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
    const newURL = "https://" + url;
    window.open(newURL, '_blank');
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
        navigator.serviceWorker.register('/sw.js?v=1.0.2')
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-3xl mx-auto">
          {/* Network Status Bar */}
          {!isOnline && (
            <Alert className="mb-4 bg-yellow-50 dark:bg-yellow-900 border-yellow-200">
              <WifiOff className="h-4 w-4 mr-2" />
              <AlertDescription>
                You're offline. Some features may be limited.
                {offlineUrls.length > 0 && ` ${offlineUrls.length} URLs pending sync.`}
              </AlertDescription>
            </Alert>
          )}

          {/* Install Prompt */}
          {isInstallable && (
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-900 border-blue-200">
              <Download className="h-4 w-4 mr-2" />
              <AlertDescription className="flex justify-between items-center">
                <span>Install our app for the best experience!</span>
                <Button
                  onClick={handleInstall}
                  variant="outline"
                  size="sm"
                  className="ml-4"
                >
                  Install App
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RU Short
                </CardTitle>
                {lastSync && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefresh}
                      disabled={!isOnline || isRefreshing}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </Button>
                    <span className="ml-2">
                      Last updated: {lastSync.toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
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
                    length={length}
                    onLengthChange={setLength}
                    prefix={prefix}
                    onPrefixChange={setPrefix}
                    expirationDate={expirationDate}
                    onExpirationDateChange={setExpirationDate}
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
                    length={length}
                    onLengthChange={setLength}
                    prefix={prefix}
                    onPrefixChange={setPrefix}
                    expirationDate={expirationDate}
                    onExpirationDateChange={setExpirationDate}
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
            <div className="p-4">
              <Stats
                totalShortenedUrls={totalShortenedUrls}
                totalClicks={totalClicks}
              />
            </div>
            <div className="p-4">
              <Footer />
            </div>
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