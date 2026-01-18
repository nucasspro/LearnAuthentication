import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Học Xác Thực Ứng Dụng | CYBERPUNK 2084",
    template: "%s | Học Xác Thực",
  },
  description: "Làm chủ các giao thức xác thực trong môi trường Cyberpunk. Học về Session, JWT, OAuth 2.0, và MFA với các minh họa tương tác và thử thách bảo mật.",
  keywords: ["authentication", "xác thực", "bảo mật", "JWT", "OAuth", "Session", "MFA", "security", "learning"],
  authors: [{ name: "Learn Authentication" }],
  creator: "Learn Authentication Team",
  publisher: "Learn Authentication",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: "Học Xác Thực Ứng Dụng | CYBERPUNK 2084",
    description: "Làm chủ các giao thức xác thực với các minh họa tương tác và thử thách bảo mật",
    siteName: "Learn Authentication",
  },
  twitter: {
    card: "summary_large_image",
    title: "Học Xác Thực Ứng Dụng | CYBERPUNK 2084",
    description: "Làm chủ các giao thức xác thực với các minh họa tương tác và thử thách bảo mật",
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
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body suppressHydrationWarning className="bg-black min-h-screen selection:bg-neon-500/30 selection:text-neon-400">
        {/* Global Cyberpunk Grid Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
