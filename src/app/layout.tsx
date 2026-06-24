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

export const metadata: Metadata = {
  metadataBase: new URL("https://coconala-checker.vercel.app"),
  title: {
    default: "ココナラ出品者チェッカー",
    template: "%s | ココナラ出品者チェッカー",
  },
  description: "出品者の信頼度をAIで独自スコアリング",
  applicationName: "ココナラ出品者チェッカー",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ココナラ出品者チェッカー",
    description: "出品者の信頼度をAIで独自スコアリング",
    type: "website",
    locale: "ja_JP",
    siteName: "ココナラ出品者チェッカー",
  },
  twitter: {
    card: "summary",
    title: "ココナラ出品者チェッカー",
    description: "出品者の信頼度をAIで独自スコアリング",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
