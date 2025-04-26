'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-xl px-4">
                <div className="bg-white px-12 py-12 rounded-xl shadow-lg">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome back</h1>
                        <p className="mt-3 text-lg text-gray-600">Please sign in to your account</p>
                    </div>

                    {searchParams.get('registered') && (
                        <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-700 text-base rounded-lg">
                            Registration successful! Please sign in to continue.
                        </div>
                    )}

                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 text-base rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-base">
                        <span className="text-gray-600">Don't have an account?</span>
                        {' '}
                        <Link href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
