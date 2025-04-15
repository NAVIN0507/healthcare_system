'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        const interval = setInterval(() => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    let newX = particle.x + particle.speedX;
                    let newY = particle.y + particle.speedY;

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

    const tiltX = (mousePosition.y - 50) / 10;
    const tiltY = (mousePosition.x - 50) / -10;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-white/90">
                            Email address
                        </label>
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
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/50 text-white focus:ring-white/50 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white/90">
                            Password
                        </label>
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
                            className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/50 text-white focus:ring-white/50 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
