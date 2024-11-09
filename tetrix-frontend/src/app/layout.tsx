import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TetrisProvider } from "@/context/TetrisContext";

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
  title: "tetriX",
  description: "tetriX",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
      // Fallback for browsers that don't support SVG favicons
      {
        url: "/favicon.png",
        sizes: "any",
      },
    ],
  },
  openGraph: {
    title: 'tetriX',
    description: 'tetriX is a classic Tetris game built with Next.js and Tailwind CSS.',
    url: 'https://tetrix.patttrn.tech',
    siteName: 'tetriX',
    images: [
      { url: '/tetrix-cover.png' }
    ],
  }, 
  twitter: {
    title: 'tetriX',
    description: 'tetriX is a classic Tetris game built with Next.js and Tailwind CSS.',
    images: [
      { url: '/tetrix-cover.png' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <TetrisProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
      </TetrisProvider>
    </html>
  );
}
