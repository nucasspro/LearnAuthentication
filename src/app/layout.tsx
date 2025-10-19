import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn Authentication",
  description: "A Next.js app for learning authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
