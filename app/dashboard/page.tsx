'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    FlagIcon,
    SparklesIcon,
    StarIcon,
    TrophyIcon,
    XMarkIcon,
    PlusIcon
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
import CreateGoalModal from '@/app/components/CreateGoalModal';
import toast from 'react-hot-toast';
import GoalSection from '../components/GoalSection';

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

export default function DashboardPage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showAchievements, setShowAchievements] = useState(false);

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, <span className="text-primary-600">{userName}</span>! 👋
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Here's your health dashboard overview
                    </p>
                    <div className="mt-6 flex space-x-4">
                        <button
                            onClick={() => setShowAchievements(true)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
                        >
                            <SparklesIcon className="h-5 w-5 inline-block mr-2" />
                            View Achievements
                        </button>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
                        >
                            <StarIcon className="h-5 w-5 inline-block mr-2" />
                            Track Progress
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('fitness')}
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
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('activity')}
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
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('nutrition')}
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
                    </div>

                    <div
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => setActiveTab('goals')}
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
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-8">
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {['overview', 'fitness', 'nutrition', 'progress'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
                                <div className="h-64">
                                    <Line options={chartOptions} data={activityData} />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Progress</h3>
                                <div className="h-64">
                                    <Doughnut options={chartOptions} data={goalProgressData} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fitness' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Weight Progress</h3>
                                <div className="h-64">
                                    <Line options={chartOptions} data={weightData} />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Activity</h3>
                                <div className="h-64">
                                    <Line options={chartOptions} data={activityData} />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'nutrition' && (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                                                        <div className="bg-cyan-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2.5 L</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Calories</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-yellow-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">2,000</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Protein</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">65g</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'progress' && (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">10,000</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Workout Days</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">5/week</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Active Minutes</td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">30/day</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Achievements Modal */}
                {showAchievements && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowAchievements(false)}
                    >
                        <div
                            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
                                <button
                                    onClick={() => setShowAchievements(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Fitness Master', icon: TrophyIcon, progress: 75 },
                                    { title: 'Nutrition Expert', icon: HeartIcon, progress: 60 },
                                    { title: 'Wellness Guru', icon: SparklesIcon, progress: 90 },
                                    { title: 'Goal Crusher', icon: FlagIcon, progress: 85 },
                                ].map((achievement, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-50 rounded-xl p-4"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-3 bg-primary-100 rounded-lg">
                                                <achievement.icon className="h-6 w-6 text-primary-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-600"
                                                        style={{ width: `${achievement.progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <GoalSection />
            </div>
        </div>
    );
} 