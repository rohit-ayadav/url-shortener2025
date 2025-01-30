import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "./Section/Footer";
import SessionWrapper from "@/components/sessionWrapper"
import Header from "./Header/page";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A simple URL shortener",
  manifest: "/manifest.json",
};

// Separate viewport export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563EB", // Geist UI primary color

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><SessionWrapper >
          <Header />
          {children}
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  );
}