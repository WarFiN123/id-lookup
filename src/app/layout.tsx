import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Grid } from "@/components/ui/grid";
import Script from "next/script";

export const metadata: Metadata = {
  alternates: { canonical: "https://id.uncoverit.org" },
  title: "Discord ID Lookup",
  description:
    "Discord ID Lookup is a tool to fetch user information using Discord IDs. Enter a user, guild, or message ID to retrieve details.",
  keywords: [
    "Discord ID Lookup",
    "Discord User Lookup",
    "Discord Guild Lookup",
    "Discord ID Search",
    "Discord User Info",
    "Discord Guild Info",
    "Discord ID"
  ],
  openGraph: {
    title: "Discord ID Lookup",
    description:
      "Discord ID Lookup is a tool to fetch user information using Discord IDs. Enter a user, guild, or message ID to retrieve details.",
    url: "https://id.uncoverit.org",
    siteName: "Discord ID Lookup",
    images: [
      {
        url: "https://id.uncoverit.org/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Discord ID Lookup",
    card: "summary_large_image",
    description:
      "Discord ID Lookup is a tool to fetch user information using Discord IDs. Enter a user, guild, or message ID to retrieve details.",
    images: ["https://id.uncoverit.org/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange enableSystem>
          <div
            style={{ position: "fixed", inset: 0, zIndex: -1 }}
            aria-hidden="true"
          >
            <Grid />
          </div>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-EV66QW3VM8" />
      <Script src="https://api.instatus.com/widget?host=status.uncoverit.org&code=4f0eef87&locale=en" />
    </html>
  );
}
