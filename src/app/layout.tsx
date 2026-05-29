import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "The Hunt is on. Find the banana at stops around Fenway, mark your progress, and get that banana.";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : undefined,
  title: {
    default: "Boston Banana Hunt 2026",
    template: "%s · Banana Hunt 2026",
  },
  description: siteDescription,
  applicationName: "Banana Hunt 2026",
  openGraph: {
    title: "Boston Banana Hunt 2026: Going Yard 🍌",
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: "Banana Hunt 2026",
  },
  twitter: {
    card: "summary",
    title: "Boston Banana Hunt 2026: Going Yard 🍌",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-dvh flex-col overflow-hidden">{children}</body>
    </html>
  );
}
