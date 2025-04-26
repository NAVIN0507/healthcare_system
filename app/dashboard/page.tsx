'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GoalSection from '@/app/components/GoalSection';
import WorkoutSection from '@/app/components/WorkoutSection';

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await fetch('/api/auth/me');

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUserData(userData.user);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
                if (!userData) {
                    router.push('/login');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [router, userData]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-600 mb-4">
                    <p className="text-center text-lg font-medium">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const userName = userData?.firstName || userData?.name || 'User';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-primary-600">{userName}</span>! 👋
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Ready to achieve your fitness goals today?
                    </p>
                </div>

                {/* Goals Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Goals</h2>
                    <GoalSection />
                </div>

                {/* Workouts Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-4">Workouts</h2>
                    <WorkoutSection />
                </div>
            </div>
        </div>
    );
} 