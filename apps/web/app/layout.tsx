import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Navigation } from "./Navigation";
import { Footer } from "./components/Footer";
import { Providers } from "./Providers";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "Poller | The simplest polling platform",
  description: "Create polls and get real-time results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Providers>
          <Navigation />
          <main className="min-h-screen w-full pt-12">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
