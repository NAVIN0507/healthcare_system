'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate particles
    useEffect(() => {
        const newParticles = [];
        for (let i = 0; i < 50; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2
            });
        }
        setParticles(newParticles);
    }, []);

    // Animate particles
    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    let newX = particle.x + particle.speedX;
                    let newY = particle.y + particle.speedY;

                    // Bounce off edges
                    if (newX < 0 || newX > 100) particle.speedX *= -1;
                    if (newY < 0 || newY > 100) particle.speedY *= -1;

                    return {
                        ...particle,
                        x: newX < 0 ? 0 : newX > 100 ? 100 : newX,
                        y: newY < 0 ? 0 : newY > 100 ? 100 : newY
                    };
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Track mouse position for 3D effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    // Calculate 3D tilt effect based on mouse position
    const tiltX = (mousePosition.y - 50) / 10;
    const tiltY = (mousePosition.x - 50) / -10;

    return (
        <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background with particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-white/20"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                        }}
                    />
                ))}
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden"
                style={{
                    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.1s ease-out'
                }}
            >
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/20 via-primary-300/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-primary-400 to-transparent opacity-20 rounded-tl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-primary-300 to-transparent opacity-20 rounded-br-2xl" />

                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center text-4xl font-bold text-white"
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-2 text-center text-sm text-white/80"
                    >
                        Please sign in to your account
                    </motion.p>
                </div>

                <AnimatePresence>
                    {searchParams.get('registered') && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm"
                        >
                            <p className="text-green-100 text-sm">
                                Registration successful! Please sign in to continue.
                            </p>
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
                        >
                            <p className="text-red-100 text-sm">{error}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90">
                                Email address
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'email' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    placeholder="Enter your email"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/90">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'password' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('password')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors z-20"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-white/20 rounded bg-white/10"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-white/80">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-white hover:text-white/80 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-400/20 to-primary-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 flex items-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <svg className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </span>
                        </button>
                    </motion.div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-sm text-white/80">
                        Don't have an account?{' '}
                        <Link href="/register" className="font-medium text-white hover:text-white/80 transition-colors">
                            Register here
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
        </Suspense>
    );
} 