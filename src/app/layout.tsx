import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/layout/header/header";
import { Toaster } from "@/components/ui/toaster";
import { Metadata, Viewport } from "next";
import Footer from "@/components/layout/footer/footer";
import ResetScroll from "@/components/layout/reset-scroll";


interface RootLayoutProps {
  children: React.ReactNode;
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Sleep-at",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-fit bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <Header />
          <div className="sm:container sm:mx-auto mx-2 min-h-screen">
            {children}
          </div>
          <ResetScroll />
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
