import { PreviewPage } from './PreviewPage';
import connectDB from "@/utils/db";
import { Url } from "@/models/urlShortener";
import { NextResponse } from 'next/server';
import NotFound from '../not-found';

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
}

export default async function Preview({
  params
}: any) {
  try {
    const urlEntry = await Url.findOne({
      shortenURL: params.shortUrl,
    });

    if (!urlEntry) {
      return <NotFound />;
    }

    // Increment click count
    let count: number = urlEntry.click as number;
    count = count + 1;
    urlEntry.click = count;
    await urlEntry.save();

    const original = normalizeUrl(urlEntry.originalUrl);
    const duplicate = removeSpecificQueryString(original);

    // Check if direct redirect is requested
    // if (searchParams.direct === 'true' || searchParams.redirectNow === 'true') {
    //   return redirect(original);
    // }

    return <PreviewPage originalUrl={original} duplicateUrl={duplicate} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">An error occurred...</h1>
        <p className='text-red-500'>{(error as Error).toString()}</p>
      </div>
    );
  }
}


function removeSpecificQueryString(url: string): string {
  const removableStrings = [
    "?referralCode=JEMO1X",
    "?utm_source=ResourceAndUpdates&utm_medium=Affiliates&utm_campaign=XZN12012025&ref=AffResourceAndUpdates",
    `?utm_source=ResourceAndUpdates&utm_medium=Affiliates&utm_campaign={optional}&ref=AffResourceAndUpdates`,
  ];

  for (const removable of removableStrings) {
    if (url.includes(removable)) {
      url = url.replace(removable, "");
    }
  }

  return url.replace(/[?&]$/, "");
}