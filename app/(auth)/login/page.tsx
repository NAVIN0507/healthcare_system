'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // TODO: Implement actual authentication logic here
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-soft p-8">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-6">Sign In</h2>

            {error && (
                <div className="mb-4 p-3 bg-accent-50 text-accent-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="remember"
                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-neutral-700">
                            Remember me
                        </label>
                    </div>
                    <Link
                        href="/forgot-password"
                        className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${loading
                            ? 'bg-primary-400 cursor-not-allowed'
                            : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
} 