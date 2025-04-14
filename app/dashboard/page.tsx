'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                            Welcome, {user?.firstName}!
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Health Summary Card */}
                            <div className="bg-primary-50 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-primary-900 mb-4">Health Summary</h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Height:</span> {user?.height} cm
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Weight:</span> {user?.weight} kg
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Blood Type:</span> {user?.bloodType}
                                    </p>
                                </div>
                            </div>

                            {/* Medical History Card */}
                            <div className="bg-primary-50 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-primary-900 mb-4">Medical History</h2>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Past Issues:</span> {user?.pastMedicalIssues || 'None recorded'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Allergies:</span> {user?.allergies || 'None recorded'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Current Issues:</span> {user?.currentHealthIssues || 'None recorded'}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Actions Card */}
                            <div className="bg-primary-50 rounded-lg p-6">
                                <h2 className="text-lg font-medium text-primary-900 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                                        Schedule Appointment
                                    </button>
                                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                                        View Medical Records
                                    </button>
                                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                                        Update Health Info
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 