'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        dateOfBirth: '',
        height: '',
        weight: '',
        bloodType: '',
        pastMedicalIssues: '',
        allergies: '',
        currentHealthIssues: '',
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement actual registration logic here
            await new Promise(resolve => setTimeout(resolve, 1000));
            router.push('/login?registered=true');
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-soft p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-accent-500 mb-6">Create Account</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Enter your first name"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Enter your last name"
                            required
                        />
                    </div>
                </div>

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-neutral-700 mb-1">
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 mb-1">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="height" className="block text-sm font-medium text-neutral-700 mb-1">
                            Height (cm)
                        </label>
                        <input
                            type="number"
                            id="height"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Enter your height"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-neutral-700 mb-1">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            id="weight"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Enter your weight"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="bloodType" className="block text-sm font-medium text-neutral-700 mb-1">
                        Blood Type
                    </label>
                    <select
                        id="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        required
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="pastMedicalIssues" className="block text-sm font-medium text-neutral-700 mb-1">
                            Past Medical Issues
                        </label>
                        <textarea
                            id="pastMedicalIssues"
                            value={formData.pastMedicalIssues}
                            onChange={(e) => setFormData({ ...formData, pastMedicalIssues: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="List any past medical conditions or surgeries"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-neutral-700 mb-1">
                            Allergies
                        </label>
                        <textarea
                            id="allergies"
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="List any allergies (medications, food, etc.)"
                            rows={3}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="currentHealthIssues" className="block text-sm font-medium text-neutral-700 mb-1">
                        Current Health Issues
                    </label>
                    <textarea
                        id="currentHealthIssues"
                        value={formData.currentHealthIssues}
                        onChange={(e) => setFormData({ ...formData, currentHealthIssues: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                        placeholder="Describe any current health issues or concerns"
                        rows={3}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            placeholder="Create a password"
                            required
                            minLength={8}
                        />
                        <p className="mt-1 text-xs text-neutral-500">Must be at least 8 characters long</p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            type="checkbox"
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                            className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                    </div>
                    <div className="ml-3">
                        <label htmlFor="agreeToTerms" className="text-sm text-neutral-700">
                            I agree to the{' '}
                            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors ${loading
                        ? 'bg-primary-400 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-neutral-600">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
} 