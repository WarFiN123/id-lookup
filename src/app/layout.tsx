import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Grid } from "@/components/ui/grid";

export const metadata: Metadata = {
  alternates: { canonical: "https://id.uncoverit.org" },
  title: "Discord ID Lookup",
  description:
    "Discord ID Lookup is a tool to fetch user information using Discord IDs. Enter a user, guild, or message ID to retrieve details.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
        >
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
    </html>
  );
}
