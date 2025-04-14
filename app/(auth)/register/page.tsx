'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        height: '',
        weight: '',
        bloodType: '',
        allergies: '',
        medications: '',
        conditions: '',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speedX: number; speedY: number }>>([]);
    const [floatingElements, setFloatingElements] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; speed: number }>>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Generate floating elements
    useEffect(() => {
        const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#10B981', '#F59E0B'];
        const newElements = [];
        for (let i = 0; i < 15; i++) {
            newElements.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 30 + 20,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 0.05 + 0.02
            });
        }
        setFloatingElements(newElements);
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

    // Animate floating elements
    useEffect(() => {
        const interval = setInterval(() => {
            setFloatingElements(prevElements =>
                prevElements.map(element => {
                    let newY = element.y - element.speed;
                    if (newY < -20) newY = 120;

                    return {
                        ...element,
                        y: newY
                    };
                })
            );
        }, 50);

        return () => clearInterval(interval);
    }, []);

    // Canvas animation for gradient effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Animation variables
        let time = 0;
        const animate = () => {
            time += 0.005;

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsla(${(time * 20) % 360}, 70%, 50%, 0.1)`);
            gradient.addColorStop(0.5, `hsla(${((time * 20) + 120) % 360}, 70%, 50%, 0.1)`);
            gradient.addColorStop(1, `hsla(${((time * 20) + 240) % 360}, 70%, 50%, 0.1)`);

            // Fill with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw animated circles
            for (let i = 0; i < 5; i++) {
                const x = canvas.width / 2 + Math.cos(time + i * 1.5) * 200;
                const y = canvas.height / 2 + Math.sin(time * 0.7 + i * 1.2) * 200;
                const radius = 100 + Math.sin(time * 2 + i) * 30;

                const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                circleGradient.addColorStop(0, `hsla(${(time * 30 + i * 60) % 360}, 70%, 50%, 0.05)`);
                circleGradient.addColorStop(1, `hsla(${(time * 30 + i * 60) % 360}, 70%, 50%, 0)`);

                ctx.fillStyle = circleGradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('emergencyContact.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                emergencyContact: {
                    ...prev.emergencyContact,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Calculate 3D tilt effect based on mouse position
    const tiltX = (mousePosition.y - 50) / 10;
    const tiltY = (mousePosition.x - 50) / -10;

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium text-white">Personal Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-white/90">
                                    First Name
                                </label>
                                <div className="mt-1 relative group">
                                    <div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'firstName' ? 'opacity-100' : ''}`}
                                    />
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('firstName')}
                                        onBlur={() => setActiveField(null)}
                                        className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-white/90">
                                    Last Name
                                </label>
                                <div className="mt-1 relative group">
                                    <div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'lastName' ? 'opacity-100' : ''}`}
                                    />
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('lastName')}
                                        onBlur={() => setActiveField(null)}
                                        className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/90">
                                Email
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'email' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-white/90">
                                Phone Number
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'phone' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('phone')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium text-white">Account Security</h3>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white/90">
                                Password
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'password' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('password')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/90">
                                Confirm Password
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'confirmPassword' ? 'opacity-100' : ''}`}
                                />
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('confirmPassword')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium text-white">Health Information</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-white/90">
                                    Height (cm)
                                </label>
                                <div className="mt-1 relative group">
                                    <div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'height' ? 'opacity-100' : ''}`}
                                    />
                                    <input
                                        type="number"
                                        id="height"
                                        name="height"
                                        required
                                        value={formData.height}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('height')}
                                        onBlur={() => setActiveField(null)}
                                        className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-white/90">
                                    Weight (kg)
                                </label>
                                <div className="mt-1 relative group">
                                    <div
                                        className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'weight' ? 'opacity-100' : ''}`}
                                    />
                                    <input
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        required
                                        value={formData.weight}
                                        onChange={handleChange}
                                        onFocus={() => setActiveField('weight')}
                                        onBlur={() => setActiveField(null)}
                                        className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    />
                                    <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="bloodType" className="block text-sm font-medium text-white/90">
                                Blood Type
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'bloodType' ? 'opacity-100' : ''}`}
                                />
                                <select
                                    id="bloodType"
                                    name="bloodType"
                                    required
                                    value={formData.bloodType}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('bloodType')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                >
                                    <option value="">Select blood type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium text-white">Medical History</h3>
                        <div>
                            <label htmlFor="allergies" className="block text-sm font-medium text-white/90">
                                Allergies
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'allergies' ? 'opacity-100' : ''}`}
                                />
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    rows={3}
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('allergies')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    placeholder="List any allergies (separate with commas)"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="medications" className="block text-sm font-medium text-white/90">
                                Current Medications
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'medications' ? 'opacity-100' : ''}`}
                                />
                                <textarea
                                    id="medications"
                                    name="medications"
                                    rows={3}
                                    value={formData.medications}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('medications')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    placeholder="List current medications (separate with commas)"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="conditions" className="block text-sm font-medium text-white/90">
                                Medical Conditions
                            </label>
                            <div className="mt-1 relative group">
                                <div
                                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400/30 to-primary-300/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${activeField === 'conditions' ? 'opacity-100' : ''}`}
                                />
                                <textarea
                                    id="conditions"
                                    name="conditions"
                                    rows={3}
                                    value={formData.conditions}
                                    onChange={handleChange}
                                    onFocus={() => setActiveField('conditions')}
                                    onBlur={() => setActiveField(null)}
                                    className="appearance-none block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 relative z-10"
                                    placeholder="List any medical conditions (separate with commas)"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-white/10 z-0" />
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Canvas for animated gradient background */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0"
                style={{ opacity: 0.7 }}
            />

            {/* Animated background with particles */}
            <div className="absolute inset-0 overflow-hidden z-10">
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

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden z-10">
                {floatingElements.map(element => (
                    <motion.div
                        key={element.id}
                        className="absolute rounded-full opacity-20 blur-xl"
                        style={{
                            left: `${element.x}%`,
                            top: `${element.y}%`,
                            width: `${element.size}px`,
                            height: `${element.size}px`,
                            backgroundColor: element.color,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 5 + element.id,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Glowing orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '12s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDuration: '10s' }} />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] z-10" />

            {/* Animated lines */}
            <div className="absolute inset-0 overflow-hidden z-10">
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{
                            top: `${10 + i * 10}%`,
                            left: '0%',
                            width: '100%',
                        }}
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 10 + i * 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <motion.div
                ref={containerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full space-y-8 bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 relative overflow-hidden z-20"
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

                {/* Animated border */}
                <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center text-4xl font-bold text-white"
                    >
                        Create Your Account
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-2 text-center text-sm text-white/80"
                    >
                        Join our healthcare platform and take control of your wellness journey
                    </motion.p>
                </div>

                {/* Progress bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white/80">
                                Step {currentStep} of {totalSteps}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-white/80">
                                {Math.round((currentStep / totalSteps) * 100)}%
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary-400 to-primary-300"
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
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
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>

                    <div className="flex justify-between pt-4">
                        <motion.button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white ${currentStep === 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50'
                                } transition-all duration-200`}
                            whileHover={{ scale: currentStep === 1 ? 1 : 1.02 }}
                            whileTap={{ scale: currentStep === 1 ? 1 : 0.98 }}
                        >
                            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </motion.button>

                        {currentStep < totalSteps ? (
                            <motion.button
                                type="button"
                                onClick={nextStep}
                                className="flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Next
                                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        ) : (
                            <motion.button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-primary-700 bg-white hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </form>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center"
                >
                    <p className="text-sm text-white/80">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-white hover:text-white/80 transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
} 