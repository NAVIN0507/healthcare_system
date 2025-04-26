'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    SparklesIcon,
    StarIcon,
    PlusIcon,
    FireIcon,
    HeartIcon,
    BoltIcon,
    ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import GoalSection from '../components/GoalSection';

interface Goal {
    _id: string;
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    progress: number;
    status: string;
    startDate: string;
    targetDate: string;
}

interface Workout {
    _id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    frequency: string;
    category: string;
    exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        rest: string;
    }>;
}

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAchievements, setShowAchievements] = useState(false);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const workoutPlans: WorkoutPlan[] = [
        {
            id: '1',
            title: 'Full Body Strength',
            description: 'Build overall strength with compound exercises',
            difficulty: 'Intermediate',
            duration: '45-60 min',
            frequency: '3x per week',
            category: 'Strength',
            color: 'from-purple-500 to-indigo-600',
            exercises: [
                { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '90 sec' },
                { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90 sec' },
                { name: 'Deadlifts', sets: 3, reps: '8-10', rest: '120 sec' },
                { name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '60 sec' },
                { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90 sec' }
            ]
        },
        {
            id: '2',
            title: 'HIIT Cardio Blast',
            description: 'High-intensity intervals for maximum fat burn',
            difficulty: 'Advanced',
            duration: '30 min',
            frequency: '2-3x per week',
            category: 'Cardio',
            color: 'from-red-500 to-pink-600',
            exercises: [
                { name: 'Burpees', sets: 3, reps: '45 sec', rest: '15 sec' },
                { name: 'Mountain Climbers', sets: 3, reps: '45 sec', rest: '15 sec' },
                { name: 'Jump Squats', sets: 3, reps: '45 sec', rest: '15 sec' },
                { name: 'High Knees', sets: 3, reps: '45 sec', rest: '15 sec' },
                { name: 'Plank to Push-up', sets: 3, reps: '45 sec', rest: '15 sec' }
            ]
        },
        {
            id: '3',
            title: 'Beginner Fitness',
            description: 'Perfect for those starting their fitness journey',
            difficulty: 'Beginner',
            duration: '30-40 min',
            frequency: '3x per week',
            category: 'Full Body',
            color: 'from-orange-500 to-yellow-500',
            exercises: [
                { name: 'Bodyweight Squats', sets: 3, reps: '12-15', rest: '60 sec' },
                { name: 'Push-ups (Modified)', sets: 3, reps: '8-12', rest: '60 sec' },
                { name: 'Dumbbell Rows', sets: 3, reps: '12-15', rest: '60 sec' },
                { name: 'Walking Lunges', sets: 2, reps: '10 each leg', rest: '60 sec' },
                { name: 'Plank Hold', sets: 3, reps: '30 sec', rest: '30 sec' }
            ]
        },
        {
            id: '4',
            title: 'Core & Flexibility',
            description: 'Strengthen your core and improve flexibility',
            difficulty: 'Beginner',
            duration: '40 min',
            frequency: '2-3x per week',
            category: 'Core',
            color: 'from-blue-500 to-cyan-500',
            exercises: [
                { name: 'Plank Variations', sets: 3, reps: '45 sec', rest: '30 sec' },
                { name: 'Russian Twists', sets: 3, reps: '20 each side', rest: '45 sec' },
                { name: 'Superman Holds', sets: 3, reps: '30 sec', rest: '30 sec' },
                { name: 'Bird Dogs', sets: 3, reps: '12 each side', rest: '45 sec' },
                { name: 'Dead Bug', sets: 3, reps: '12 each side', rest: '45 sec' }
            ]
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, workoutsResponse] = await Promise.all([
                    fetch('/api/auth/me'),
                    fetch('/api/workouts')
                ]);

                if (!userResponse.ok) {
                    router.push('/login');
                    return;
                }

                const userData = await userResponse.json();
                const workoutsData = workoutsResponse.ok ? await workoutsResponse.json() : [];

                setUserData(userData.user);
                setWorkouts(workoutsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const userName = userData?.firstName || userData?.name || 'User';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg backdrop-blur-lg bg-opacity-90">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                            <SparklesIcon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500">{userName}</span>! 👋
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                Ready to crush your fitness goals today?
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flex space-x-4">
                        <button
                            onClick={() => router.push('/dashboard/goals')}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Create New Goal
                        </button>
                        <button
                            onClick={() => router.push('/dashboard/workouts')}
                            className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center border border-gray-200"
                        >
                            <FireIcon className="h-5 w-5 mr-2 text-orange-500" />
                            Manage Workouts
                        </button>
                    </div>
                </div>

                {/* Goals Section */}
                <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Goals</h2>
                        <button
                            onClick={() => router.push('/dashboard/goals')}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <GoalSection />
                </div>

                {/* Workouts Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                            <FireIcon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex justify-between items-center flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">Your Workouts</h2>
                            <button
                                onClick={() => router.push('/dashboard/workouts')}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                View All
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.slice(0, 3).map((workout) => (
                            <div
                                key={workout._id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                            >
                                <div className={`h-2 bg-gradient-to-r ${workout.category === 'Strength' ? 'from-purple-500 to-indigo-600' :
                                        workout.category === 'Cardio' ? 'from-red-500 to-pink-600' :
                                            workout.category === 'Full Body' ? 'from-orange-500 to-yellow-500' :
                                                'from-blue-500 to-cyan-500'
                                    }`} />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{workout.title}</h3>
                                    <p className="text-gray-600 mb-4">{workout.description}</p>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Difficulty:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                                                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {workout.difficulty}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Duration:</span>
                                            <span className="text-sm text-gray-700">{workout.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">Frequency:</span>
                                            <span className="text-sm text-gray-700">{workout.frequency}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/dashboard/workouts')}
                                        className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-600 transform hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 