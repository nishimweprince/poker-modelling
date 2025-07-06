import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Texas Hold'em Poker - Play Online Poker Game",
  description: "Experience the thrill of Texas Hold'em poker with our simplified online poker game. Play with friends, practice your skills, and enjoy realistic poker gameplay with intuitive controls.",
  keywords: "Texas Hold'em, poker, online poker, card game, poker game, holdem, poker strategy",
  authors: [{ name: "Nishimwe Prince" }],
  creator: "Nishimwe Prince",
  publisher: "Nishimwe Prince",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://poker-modelling.basis.rw'),
  alternates: {
    canonical: 'https://poker-modelling.basis.rw',
  },
  openGraph: {
    title: "Texas Hold'em Poker - Play Online Poker Game",
    description: "Experience the thrill of Texas Hold'em poker with our simplified online poker game. Play with friends, practice your skills, and enjoy realistic poker gameplay.",
    url: 'https://poker-modelling.basis.rw',
    siteName: 'Texas Hold\'em Poker',
    images: [
      {
        url: "https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Texas Hold'em Poker Game Interface",
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Texas Hold'em Poker - Play Online Poker Game",
    description: "Experience the thrill of Texas Hold'em poker with our simplified online poker game. Play with friends, practice your skills, and enjoy realistic poker gameplay.",
    images: ["https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico"],
    creator: '@poker_modelling',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico",
    shortcut: "https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico",
    apple: "https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico",
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  category: 'game',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="https://assets.ctfassets.net/sm166qdr1jca/2FyqNQVf20uKZmTUET6rsq/6672b524e82f27c8d15139ce233143ed/favicon.ico" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
