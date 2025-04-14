'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    UserGroupIcon,
    CalendarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    FireIcon,
    HeartIcon,
    BoltIcon,
    ClipboardDocumentListIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
import {
    ChartBarIcon as ChartBarSolidIcon,
    UserGroupIcon as UserGroupSolidIcon,
    CalendarIcon as CalendarSolidIcon,
    ClockIcon as ClockSolidIcon,
} from '@heroicons/react/24/solid';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
    },
};

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (!response.ok) {
                    router.push('/login');
                    return;
                }
                const data = await response.json();
                setUserData(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const userName = userData?.firstName || userData?.name || 'User';

    // Sample data for charts
    const activityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Steps',
                data: [8000, 9500, 7800, 10200, 8900, 11000, 8500],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
                label: 'Active Minutes',
                data: [45, 60, 30, 75, 50, 90, 40],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            },
        ],
    };

    const weightData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Weight (kg)',
                data: [75, 74.2, 73.8, 73.1],
                borderColor: 'rgb(139, 92, 246)',
                backgroundColor: 'rgba(139, 92, 246, 0.5)',
            },
        ],
    };

    const nutritionData = {
        labels: ['Protein', 'Carbs', 'Fat', 'Fiber'],
        datasets: [
            {
                label: 'Daily Intake',
                data: [65, 250, 55, 30],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.5)',
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(16, 185, 129, 0.5)',
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(59, 130, 246)',
                    'rgb(245, 158, 11)',
                    'rgb(16, 185, 129)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const goalProgressData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                data: [65, 25, 10],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.5)',
                    'rgba(245, 158, 11, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                ],
                borderColor: [
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-primary-600">{userName}</span>! 👋
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Here's your health dashboard overview
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-primary-100">
                                <FireIcon className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Calories Burned</p>
                                <p className="text-2xl font-bold text-gray-900">1,250</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm">
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">+12%</span>
                                <span className="text-gray-500 ml-2">from last week</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100">
                                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Steps Today</p>
                                <p className="text-2xl font-bold text-gray-900">8,547</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm">
                                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-500 font-medium">+5%</span>
                                <span className="text-gray-500 ml-2">from yesterday</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Meals Tracked</p>
                                <p className="text-2xl font-bold text-gray-900">3</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm">
                                <span className="text-gray-500">Today's meals</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FlagIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Goals Progress</p>
                                <p className="text-2xl font-bold text-gray-900">75%</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm">
                                <span className="text-green-500 font-medium">On track</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                        <div className="h-64">
                            <Line options={{
                                ...chartOptions,
                                maintainAspectRatio: false,
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: {
                                        position: 'bottom' as const,
                                        labels: {
                                            boxWidth: 12,
                                            padding: 8,
                                            font: {
                                                size: 10
                                            }
                                        }
                                    }
                                }
                            }} data={activityData} />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-lg p-6"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
                        <div className="h-64">
                            <Line options={{
                                ...chartOptions,
                                maintainAspectRatio: false,
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: {
                                        position: 'bottom' as const,
                                        labels: {
                                            boxWidth: 12,
                                            padding: 8,
                                            font: {
                                                size: 10
                                            }
                                        }
                                    }
                                }
                            }} data={weightData} />
                        </div>
                    </motion.div>
                </div>

                {/* Progress Tracking Tables */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Physical Activity</h3>
                        </div>
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Daily Steps</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">10,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Workout Days</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '80%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">5/week</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Active Minutes</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">30/day</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Nutrition</h3>
                        </div>
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Water Intake</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-cyan-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2.5 L</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Calories</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-yellow-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Protein</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-red-600 h-2.5 rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">65g</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Schedule Appointment
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                View Medical Records
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-md hover:shadow-lg"
                            >
                                Update Health Info
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 