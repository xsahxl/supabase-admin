import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/auth-provider";
import Link from "next/link";
import ConditionalSidebar from "@/components/conditional-sidebar";
import { AuthButton } from "@/components/auth-button";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased flex flex-col`}>
        <AuthProvider>
          <nav className="fixed top-0 w-full flex border-b border-b-foreground/10 h-16 bg-white z-30">
            <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
              <Link href="/companies" className="font-semibold">Next.js Supabase Starter</Link>
              <AuthButton />
            </div>
          </nav>
          <div className="flex flex-1 pt-16">
            <ConditionalSidebar />
            <main className="flex-1 min-h-screen bg-white transition-all duration-300">
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
              </ThemeProvider>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
