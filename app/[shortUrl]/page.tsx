// app/[shortUrl]/page.tsx
import { PreviewPage } from './PreviewPage';
import { Url } from "@/models/urlShortener";
import NotFound from '../not-found';
import { cache } from 'react';

// Cache the database lookup
const getUrlEntry = cache(async (shortUrl: string) => {
  return await Url.findOne({ shortenURL: shortUrl });
});

// Separate function for updating click count
const updateClickCount = async (urlEntry: any) => {
  try {
    const count = (urlEntry.click as number) + 1;
    await Url.updateOne(
      { _id: urlEntry._id },
      { $set: { click: count } }
    );
  } catch (error) {
    console.error('Error updating click count:', error);
    // Don't throw error - click count update is non-critical
  }
};

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

function removeSpecificQueryString(url: string): string {
  const removableStrings = [
    "?referralCode=JEMO1X",
    `?utm_source=ResourceAndUpdates`,
  ];
  
  for (const removable of removableStrings) {
    if (url.includes(removable)) {
      url = url.slice(0, url.indexOf(removable));
    }
  }
  return url.replace(/[?&]$/, "");
}

export default async function Preview({
  params
}: any) {
  try {
    // Use cached database lookup
    const urlEntry = await getUrlEntry(params.shortUrl);
    
    if (!urlEntry) {
      return <NotFound />;
    }

    // Update click count in background without waiting
    updateClickCount(urlEntry);

    const original = normalizeUrl(urlEntry.originalUrl);
    const duplicate = removeSpecificQueryString(original);

    return <PreviewPage originalUrl={original} duplicateUrl={duplicate} />;
    
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl">An error occurred</h1>
        <p className="text-red-500">{(error as Error).toString()}</p>
      </div>
    );
  }
}

