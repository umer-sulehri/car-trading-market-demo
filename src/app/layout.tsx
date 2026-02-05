import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { seoConfig, structuredData } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultSEO = seoConfig.default;

export const metadata: Metadata = {
  title: {
    default: defaultSEO.title,
    template: "%s - Car Trading Market",
  },
  description: defaultSEO.description,
  keywords: defaultSEO.keywords,
  robots: defaultSEO.robots,
  authors: defaultSEO.author ? [{ name: defaultSEO.author }] : undefined,
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  creator: "Car Trading Market",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cartradingmarket.com",
    siteName: "Car Trading Market",
    title: defaultSEO.ogTitle || defaultSEO.title,
    description: defaultSEO.ogDescription || defaultSEO.description,
    images: defaultSEO.ogImage ? [{ url: defaultSEO.ogImage }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    site: "@cartradingmarket",
    creator: "@cartradingmarket",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData.website),
          }}
        />
        {/* Google Site Verification (Add your verification code) */}
        {/* <meta name="google-site-verification" content="your-code-here" /> */}
        {/* Meta Tags for Social Media */}
        <meta property="og:type" content="website" />
        <meta name="twitter:creator" content="@cartradingmarket" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
