import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.variable} min-h-screen bg-neutral-50 flex items-center justify-center p-4`}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-600">Healthcare MS</h1>
                    <p className="text-neutral-600 mt-2">Secure access to your healthcare management system</p>
                </div>
                {children}
            </div>
        </div>
    );
} 