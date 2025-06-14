import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "SUDOZ NFT - Testnet",
  description: "Interact with SUDOZ ARTIFACTS on Sui Testnet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
