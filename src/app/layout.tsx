import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABTalks - 60-Day Student Challenge",
  description: "Build Consistency. Get Hired.",
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
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#08080a] text-[#e5e1e4] min-h-screen">
        {children}
      </body>
    </html>
  );
}
