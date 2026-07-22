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
        <div className="flex min-h-full flex-1 flex-col md:pl-64">
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-8 sm:px-6 md:pb-10 lg:px-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
