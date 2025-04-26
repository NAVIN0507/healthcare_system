'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    PlusIcon,
    FireIcon,
} from '@heroicons/react/24/outline';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
}

interface Workout {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    frequency: string;
    category: string;
    exercises: Exercise[];
}

export default function WorkoutSection() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const response = await fetch('/api/workouts');
            if (!response.ok) {
                throw new Error('Failed to fetch workouts');
            }
            const data = await response.json();
            setWorkouts(data.workouts);
        } catch (error) {
            console.error('Error fetching workouts:', error);
            setError(error instanceof Error ? error.message : 'Failed to load workouts');
        } finally {
            setIsLoading(false);
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return 'bg-green-100 text-green-800';
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'Advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryGradient = (category: string) => {
        switch (category) {
            case 'Strength':
                return 'from-purple-500 to-indigo-600';
            case 'Cardio':
                return 'from-red-500 to-pink-600';
            case 'HIIT':
                return 'from-orange-500 to-red-600';
            case 'Flexibility':
                return 'from-blue-500 to-indigo-600';
            case 'Full Body':
                return 'from-green-500 to-teal-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                    <div
                        key={workout._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                    >
                        <div className={`h-2 bg-gradient-to-r ${getCategoryGradient(workout.category)}`} />
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{workout.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                                    {workout.difficulty}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{workout.description}</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Duration:</span>
                                    <span className="font-medium text-gray-700">{workout.duration}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Frequency:</span>
                                    <span className="font-medium text-gray-700">{workout.frequency}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Exercises:</span>
                                    <span className="font-medium text-gray-700">{workout.exercises.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {workouts.length === 0 && (
                <div className="text-center py-12">
                    <FireIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No workouts</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new workout.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/dashboard/workouts/new')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Workout
                        </button>
                    </div>
                </div>
            )}

            {workouts.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => router.push('/dashboard/workouts/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add New Workout
                    </button>
                </div>
            )}
        </div>
    );
} 