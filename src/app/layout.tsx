import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABTalks - Redesign",
  description: "The elite proof-of-work engine for high-performance students.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className="bg-[#08080a] text-[#e5e1e4] antialiased selection:bg-[#f97316]/30 min-h-screen">
        {children}
      </body>
    </html>
  );
}
