import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/*
 * Font Configuration
 *
 * Next.js has built-in font optimization with next/font. It:
 * - Hosts fonts locally (no external requests to Google)
 * - Prevents layout shift by using font metrics
 * - Creates CSS custom properties for use in Tailwind
 *
 * We define two fonts:
 * - Geist Sans: A clean sans-serif for body text
 * - Geist Mono: A monospace font for code blocks
 *
 * The `variable` option creates a CSS custom property (--font-geist-sans)
 * that we reference in tailwind.config.ts
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*
 * Metadata Configuration
 *
 * This generates <head> tags for the entire application.
 * Individual pages can override or extend this metadata.
 *
 * Next.js 15 uses a new metadata API that's type-safe and
 * generates proper SEO tags automatically.
 */
export const metadata: Metadata = {
  title: {
    default: "Homelab Notebook",
    template: "%s | Homelab Notebook",
  },
  description:
    "AI-enhanced knowledge management with Research, Project, and Reference modes.",
  keywords: ["knowledge management", "notes", "homelab", "documentation"],
};

/*
 * Root Layout Component
 *
 * This is the root layout that wraps ALL pages in your application.
 * It's rendered once and persists across page navigations (like a shell).
 *
 * Key concepts:
 * - Server Component by default (no "use client" directive)
 * - The `children` prop is where page content gets rendered
 * - Font classes are added to <body> to apply globally
 * - This is where you'd add providers (auth, theme, etc.) later
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-gray-50 font-sans text-gray-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
