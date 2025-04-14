'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        gender: '',
        dateOfBirth: '',
        height: '',
        weight: '',
        bloodType: '',
        pastMedicalIssues: '',
        allergies: '',
        currentHealthIssues: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold text-white/90">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-white/80">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-white/80">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold text-white/90">Contact Information</h3>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white/80">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold text-white/90">Health Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-white/80">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-white/80">
                                    Date of Birth
                                </label>
                                <input
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    type="date"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="height" className="block text-sm font-medium text-white/80">
                                    Height (cm)
                                </label>
                                <input
                                    id="height"
                                    name="height"
                                    type="number"
                                    required
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="weight" className="block text-sm font-medium text-white/80">
                                    Weight (kg)
                                </label>
                                <input
                                    id="weight"
                                    name="weight"
                                    type="number"
                                    required
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="bloodType" className="block text-sm font-medium text-white/80">
                                    Blood Type
                                </label>
                                <select
                                    id="bloodType"
                                    name="bloodType"
                                    required
                                    value={formData.bloodType}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
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
                            </div>
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold text-white/90">Medical History</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="pastMedicalIssues" className="block text-sm font-medium text-white/80">
                                    Past Medical Issues
                                </label>
                                <textarea
                                    id="pastMedicalIssues"
                                    name="pastMedicalIssues"
                                    rows={3}
                                    value={formData.pastMedicalIssues}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="allergies" className="block text-sm font-medium text-white/80">
                                    Allergies
                                </label>
                                <textarea
                                    id="allergies"
                                    name="allergies"
                                    rows={3}
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="currentHealthIssues" className="block text-sm font-medium text-white/80">
                                    Current Health Issues
                                </label>
                                <textarea
                                    id="currentHealthIssues"
                                    name="currentHealthIssues"
                                    rows={3}
                                    value={formData.currentHealthIssues}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
            >
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-center text-4xl font-bold text-white"
                    >
                        Create your account
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-2 text-center text-sm text-white/80"
                    >
                        Or{' '}
                        <Link href="/login" className="font-medium text-white hover:text-white/80 transition-colors">
                            sign in to your account
                        </Link>
                    </motion.p>
                </div>

                {/* Progress Bar */}
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block text-white/80">
                                Step {currentStep} of {totalSteps}
                            </span>
                        </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-xl bg-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white/50"
                        />
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
                    >
                        <p className="text-red-100 text-sm">{error}</p>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderStep()}

                    <div className="flex justify-between pt-4">
                        <button
                            type="button"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${currentStep === 1
                                    ? 'opacity-50 cursor-not-allowed text-white/50'
                                    : 'text-white hover:text-white/80'
                                }`}
                        >
                            Previous
                        </button>
                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all duration-200"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-white text-primary-700 rounded-xl text-sm font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
} 