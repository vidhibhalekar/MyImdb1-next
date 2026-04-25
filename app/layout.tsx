import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import SyncProvider from "@/components/Syncprovider";
import Providers from "./providers"; // 👈 React Query island boundary
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "MovieDB",
  description: "A polished movie app built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {/* 🔁 Global providers (TanStack Query, future theme, etc.) */}
        <Providers>

          {/* 🔄 sync layer (watchlist / broadcast / state sync) */}
          <SyncProvider />

          {/* 🧭 Navigation */}
          <header>
            <nav aria-label="Main navigation">
              <Navbar />
            </nav>
          </header>

          {/* 📦 Page content */}
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>

        </Providers>
      </body>
    </html>
  );
}