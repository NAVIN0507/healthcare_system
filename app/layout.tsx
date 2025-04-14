import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Healthcare Management System",
  description: "A modern healthcare management system for efficient patient care",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans bg-neutral-50 text-neutral-800 min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="bg-primary-500 text-white shadow-soft">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Healthcare MS</h1>
                <div className="space-x-4">
                  <a href="/" className="hover:text-primary-100">Dashboard</a>
                  <a href="/patients" className="hover:text-primary-100">Patients</a>
                  <a href="/appointments" className="hover:text-primary-100">Appointments</a>
                </div>
              </nav>
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="bg-neutral-100 border-t border-neutral-200">
            <div className="container mx-auto px-4 py-6 text-center text-neutral-600">
              <p>© 2024 Healthcare Management System. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
