// Root layout component
// This wraps all pages in your app
// Perfect place for global providers (Redux, theme, etc.)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/lib/store/Provider";

// Load Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

// Metadata for SEO and browser
export const metadata: Metadata = {
  title: "TODO App",
  description: "A full-stack todo application built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* suppressHydrationWarning prevents hydration mismatch with theme */}
      <body className={inter.className}>
        {/* Redux Provider - makes store available to all components */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}

