'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
}

export default function CreateWorkoutPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const handleAddExercise = () => {
        setExercises([...exercises, {
            name: '',
            sets: 3,
            reps: '10',
            rest: '60s'
        }]);
    };

    const handleRemoveExercise = (index: number) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
        const newExercises = [...exercises];
        newExercises[index] = {
            ...newExercises[index],
            [field]: value
        };
        setExercises(newExercises);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors([]);

        const formData = new FormData(e.currentTarget);
        const workoutData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            difficulty: formData.get('difficulty'),
            duration: formData.get('duration'),
            frequency: formData.get('frequency'),
            exercises: exercises
        };

        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    setErrors(Array.isArray(data.details) ? data.details : [data.details]);
                } else {
                    setErrors([data.error || 'Failed to create workout']);
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Workout</h1>

                    {errors.length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            {errors.map((error, index) => (
                                <p key={index} className="text-red-600">{error}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Workout Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="Enter workout title"
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
                                placeholder="Describe the workout"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <option value="Strength">Strength</option>
                                    <option value="Cardio">Cardio</option>
                                    <option value="HIIT">HIIT</option>
                                    <option value="Flexibility">Flexibility</option>
                                    <option value="Full Body">Full Body</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                                    Difficulty
                                </label>
                                <select
                                    name="difficulty"
                                    id="difficulty"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                    Duration
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    id="duration"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="e.g., 45 minutes"
                                />
                            </div>

                            <div>
                                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                                    Frequency
                                </label>
                                <input
                                    type="text"
                                    name="frequency"
                                    id="frequency"
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    placeholder="e.g., 3 times per week"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Exercises</h3>
                                <button
                                    type="button"
                                    onClick={handleAddExercise}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                                >
                                    <PlusIcon className="h-4 w-4 mr-2" />
                                    Add Exercise
                                </button>
                            </div>

                            <div className="space-y-4">
                                {exercises.map((exercise, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-medium text-gray-900">Exercise {index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExercise(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={exercise.name}
                                                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    placeholder="Exercise name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Sets</label>
                                                <input
                                                    type="number"
                                                    value={exercise.sets}
                                                    onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    min="1"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Reps</label>
                                                <input
                                                    type="text"
                                                    value={exercise.reps}
                                                    onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    placeholder="e.g., 10 or 8-12"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Rest</label>
                                                <input
                                                    type="text"
                                                    value={exercise.rest}
                                                    onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                                    placeholder="e.g., 60s"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
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
                                {isSubmitting ? 'Creating...' : 'Create Workout'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 