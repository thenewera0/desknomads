import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // G-NEK7FYPZT6

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: "italic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.desknomads.store"),
  title: {
    default: "DeskNomads — AI Tools, Remote Jobs & Passive Income",
    template: "%s | DeskNomads",
  },
  description:
    "Discover the best AI tools, remote work opportunities, automation systems, and online income strategies. Your guide to the future of work.",
  keywords: [
    "AI tools",
    "remote jobs",
    "passive income",
    "automation",
    "digital business",
    "productivity",
    "side hustles",
    "future careers",
    "work from home",
    "online income",
  ],
  authors: [{ name: "DeskNomads" }],
  creator: "DeskNomads",
  publisher: "DeskNomads",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DeskNomads",
    title: "DeskNomads — AI Tools, Remote Jobs & Passive Income",
    description:
      "Discover the best AI tools, remote work opportunities, automation systems, and online income strategies.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "DeskNomads — Smart Tools. Remote Freedom. Future Income.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeskNomads — AI Tools, Remote Jobs & Passive Income",
    description:
      "Discover the best AI tools, remote work opportunities, automation systems, and online income strategies.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "", // Add Search Console verification
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <head>
        {/* Google Adsense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "pub-1562600430581360"}`}
          crossOrigin="anonymous"
        />
        {/* Microsoft Clarity — add project ID when available */}
      </head>
      <body className="antialiased">
        {/* Subtle mesh gradient background */}
        <div className="mesh-gradient" aria-hidden="true" />
        {/* Film grain texture overlay */}
        <div className="grain-overlay" aria-hidden="true" />
        {children}
        <Analytics />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
