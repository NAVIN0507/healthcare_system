'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateGoalPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        const formData = new FormData(e.currentTarget);
        const goalData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            targetValue: parseFloat(formData.get('targetValue') as string),
            currentValue: parseFloat(formData.get('currentValue') as string) || 0,
            unit: formData.get('unit'),
            targetDate: formData.get('targetDate'),
        };

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(goalData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    setErrors(Array.isArray(data.details) ? data.details : [data.details]);
                } else {
                    setErrors([data.error || 'Failed to create goal']);
                }
                return;
            }

            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            setErrors(['An unexpected error occurred. Please try again.']);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Goal</h1>

                    {errors.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-600">
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Goal Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter your goal title"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                required
                                rows={3}
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Describe your goal"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                id="category"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                                <option value="">Select a category</option>
                                <option value="Fitness">Fitness</option>
                                <option value="Weight">Weight</option>
                                <option value="Nutrition">Nutrition</option>
                                <option value="Health">Health</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
                                    Target Value
                                </label>
                                <input
                                    type="number"
                                    name="targetValue"
                                    id="targetValue"
                                    required
                                    step="any"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="Enter target value"
                                />
                            </div>

                            <div>
                                <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">
                                    Current Value
                                </label>
                                <input
                                    type="number"
                                    name="currentValue"
                                    id="currentValue"
                                    step="any"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="Enter current value"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                Unit
                            </label>
                            <input
                                type="text"
                                name="unit"
                                id="unit"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="e.g., kg, steps, minutes"
                            />
                        </div>

                        <div>
                            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                                Target Date
                            </label>
                            <input
                                type="date"
                                name="targetDate"
                                id="targetDate"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Goal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 