"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Footer from "./components/Footer";
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

 const metadata : Metadata = {
  title: "Wellnest - Your Personal Wellness Companion",
  description: "Track your health, plan your meals, monitor your fitness, and achieve your wellness goals with Wellnest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <html lang="en">
      <body className={inter.className}>
        {!isDashboard && (
          <header className="bg-primary-600 text-white shadow-md">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
                    </div>
                  </div>
                  <span className="text-xl font-bold">Wellnest</span>
                </Link>
                <nav className="hidden md:flex space-x-8">
                  <Link href="/" className="hover:text-primary-200 transition-colors">
                    Home
                  </Link>
                  <Link href="/about" className="hover:text-primary-200 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="hover:text-primary-200 transition-colors">
                    Contact
                  </Link>
                </nav>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="hidden md:inline-flex items-center px-4 py-2 border border-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 bg-white text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <button className="md:hidden p-2 hover:bg-primary-700 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}
        <main>{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
