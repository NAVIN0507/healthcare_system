'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ChartBarIcon,
    FireIcon,
    ClipboardDocumentListIcon,
    FlagIcon
} from '@heroicons/react/24/outline';
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

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Sample data for charts
    const activityData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Steps',
                data: [6500, 5900, 8000, 8100, 5600, 9500, 8500],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Calories Burned',
                data: [1200, 1100, 1500, 1600, 1300, 1800, 1700],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const nutritionData = {
        labels: ['Protein', 'Carbs', 'Fat', 'Fiber', 'Sugar'],
        datasets: [
            {
                label: 'Daily Intake (g)',
                data: [65, 250, 55, 30, 45],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const weightData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Weight (kg)',
                data: [75, 74.2, 73.5, 72.8, 72.1, 71.5],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const goalProgressData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                data: [3, 2, 1],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Welcome back, {user?.firstName || 'User'}! Here's an overview of your health journey.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FireIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Calories Burned</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">1,250</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <span>+12%</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ChartBarIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Steps Today</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">8,547</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <span>+5%</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-green-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Meals Tracked</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">3</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <span>Today</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FlagIcon className="h-6 w-6 text-purple-500" aria-hidden="true" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Goals Progress</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">75%</div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                            <span>On track</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 mb-8">
                {/* Activity Chart */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Weekly Activity</h3>
                    <div className="h-48">
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
                </div>

                {/* Weight Chart */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Weight Progress</h3>
                    <div className="h-48">
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
                </div>

                {/* Nutrition Chart */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nutrition</h3>
                    <div className="h-48">
                        <Bar options={{
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
                        }} data={nutritionData} />
                    </div>
                </div>

                {/* Goals Progress Chart */}
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Goals</h3>
                    <div className="h-48 flex items-center justify-center">
                        <div className="w-32 h-32">
                            <Doughnut
                                data={goalProgressData}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
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
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Tracking Tables */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
                {/* Physical Activity Progress */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Physical Activity</h3>
                        <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Daily Steps</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">10,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Workout Days</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">5/week</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Active Minutes</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">30/day</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Nutrition Progress */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Nutrition</h3>
                        <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Water Intake</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">2.5 L</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Calories</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">2,000</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Protein</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-red-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">65g</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sleep & Recovery */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Sleep & Recovery</h3>
                        <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Sleep Duration</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '81%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">8 hrs</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Sleep Quality</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-violet-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">85%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Recovery Score</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-pink-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">90%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Weight Management */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Weight Management</h3>
                        <div className="mt-4">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Weight Loss</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">5 kg</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">BMI</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">22.5</td>
                                    </tr>
                                    <tr>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">Body Fat %</td>
                                        <td className="px-3 py-2 whitespace-nowrap">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">18%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Schedule Appointment
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            View Medical Records
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            Update Health Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 