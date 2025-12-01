import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Learn Authentication | CYBERPUNK 2084",
    template: "%s | Learn Authentication",
  },
  description: "Master authentication protocols in a cyberpunk learning environment. Learn Session, JWT, OAuth 2.0, and MFA with interactive demos and security challenges.",
  keywords: ["authentication", "JWT", "OAuth", "Session", "MFA", "security", "learning"],
  authors: [{ name: "Learn Authentication" }],
  creator: "Learn Authentication Team",
  publisher: "Learn Authentication",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Learn Authentication | CYBERPUNK 2084",
    description: "Master authentication protocols with interactive demos and security challenges",
    siteName: "Learn Authentication",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Authentication | CYBERPUNK 2084",
    description: "Master authentication protocols with interactive demos and security challenges",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#4aff00",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
