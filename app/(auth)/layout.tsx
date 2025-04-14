import { Inter } from "next/font/google";
import Logo from "../components/Logo";

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
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <Logo size="large" className="mx-auto mb-2" />
                    <p className="text-neutral-600 mt-2">Your journey to wellness starts here</p>
                </div>
                {children}
            </div>
        </div>
    );
} 