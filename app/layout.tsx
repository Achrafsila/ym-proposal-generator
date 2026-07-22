import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { AppNav } from "@/components/layout/app-nav";
import { siteConfig } from "@/config/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${siteConfig.productName} · ${siteConfig.name}`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full`}>
      <body className="flex h-full min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <AppNav />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
