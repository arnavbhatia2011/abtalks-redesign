import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABTalks — 60-Day Student Coding Challenge",
  description: "Mobile-first platform for daily proof-of-work coding challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 min-h-screen text-neutral-100 antialiased flex justify-center">
        {/* Mobile viewport wrapper locked to max 390px */}
        <div className="w-full max-w-[390px] min-h-screen border-x border-neutral-800 bg-neutral-950 shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  );
}
