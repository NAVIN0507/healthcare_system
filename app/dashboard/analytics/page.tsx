'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    ChartPieIcon,
    ChartLineIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarIcon,
    ClockIcon,
    FireIcon,
    HeartIcon,
    BoltIcon,
    UserGroupIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

// Sample data for charts
const activityData = [
    { name: 'Mon', steps: 8000, calories: 2100, activeMinutes: 45 },
    { name: 'Tue', steps: 10000, calories: 2300, activeMinutes: 60 },
    { name: 'Wed', steps: 7500, calories: 1900, activeMinutes: 40 },
    { name: 'Thu', steps: 12000, calories: 2500, activeMinutes: 70 },
    { name: 'Fri', steps: 9000, calories: 2200, activeMinutes: 50 },
    { name: 'Sat', steps: 11000, calories: 2400, activeMinutes: 65 },
    { name: 'Sun', steps: 8500, calories: 2000, activeMinutes: 55 },
];

const nutritionData = [
    { name: 'Protein', value: 30 },
    { name: 'Carbs', value: 45 },
    { name: 'Fat', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const sleepData = [
    { name: 'Mon', hours: 7.5, quality: 85 },
    { name: 'Tue', hours: 8.0, quality: 90 },
    { name: 'Wed', hours: 6.5, quality: 75 },
    { name: 'Thu', hours: 7.0, quality: 80 },
    { name: 'Fri', hours: 8.5, quality: 95 },
    { name: 'Sat', hours: 9.0, quality: 100 },
    { name: 'Sun', hours: 7.0, quality: 80 },
];

// Stats cards data
const statsCards = [
    {
        id: 1,
        title: 'Weekly Activity',
        value: '85%',
        change: '+5%',
        isPositive: true,
        icon: <FireIcon className="w-6 h-6 text-orange-500" />,
        color: 'bg-orange-100',
        textColor: 'text-orange-600',
    },
    {
        id: 2,
        title: 'Calories Burned',
        value: '2,450',
        change: '+320',
        isPositive: true,
        icon: <BoltIcon className="w-6 h-6 text-yellow-500" />,
        color: 'bg-yellow-100',
        textColor: 'text-yellow-600',
    },
    {
        id: 3,
        title: 'Steps',
        value: '12,500',
        change: '+1,200',
        isPositive: true,
        icon: <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />,
        color: 'bg-green-100',
        textColor: 'text-green-600',
    },
    {
        id: 4,
        title: 'Sleep Quality',
        value: '85%',
        change: '-2%',
        isPositive: false,
        icon: <HeartIcon className="w-6 h-6 text-blue-500" />,
        color: 'bg-blue-100',
        textColor: 'text-blue-600',
    },
];

// Time period options
const timePeriods = [
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'quarter', name: 'This Quarter' },
    { id: 'year', name: 'This Year' },
];

export default function AnalyticsPage() {
    const [activePeriod, setActivePeriod] = useState('week');
    const [isLoading, setIsLoading] = useState(false);

    // Simulate data refresh
    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Health Analytics</h1>
                        <p className="text-gray-600 mt-1">Track your health metrics and progress</p>
                    </div>
                    <div className="flex items-center mt-4 md:mt-0">
                        <div className="flex rounded-lg overflow-hidden border border-gray-200 mr-4">
                            {timePeriods.map((period) => (
                                <button
                                    key={period.id}
                                    onClick={() => setActivePeriod(period.id)}
                                    className={`px-4 py-2 text-sm font-medium ${activePeriod === period.id
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {period.name}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={refreshData}
                            className={`p-2 rounded-lg bg-white border border-gray-200 ${isLoading ? 'animate-spin' : ''
                                }`}
                        >
                            <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: card.id * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-500 text-sm">{card.title}</p>
                                    <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                                </div>
                                <div className={`p-3 rounded-full ${card.color}`}>
                                    {card.icon}
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-sm font-medium ${card.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {card.change}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">vs last period</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Weekly Activity</h2>
                            <div className="flex space-x-2">
                                <span className="flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                    Steps
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                    Calories
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                                    Active Minutes
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={activityData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="steps" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="calories" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="activeMinutes" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Sleep Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Sleep Analysis</h2>
                            <div className="flex space-x-2">
                                <span className="flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                    Hours
                                </span>
                                <span className="flex items-center text-sm text-gray-500">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                    Quality
                                </span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={sleepData}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="hours"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="quality"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Nutrition and Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Nutrition Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Nutrition Breakdown</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={nutritionData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {nutritionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-center space-x-4">
                            {nutritionData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-1"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-sm text-gray-600">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Insights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Insights</h2>
                        <div className="space-y-6">
                            <div className="flex items-start p-4 bg-green-50 rounded-lg">
                                <div className="p-2 bg-green-100 rounded-full mr-4">
                                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-green-800">Activity Improvement</h3>
                                    <p className="text-green-700 mt-1">
                                        Your daily step count has increased by 15% compared to last week. Keep up the good work!
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                                <div className="p-2 bg-blue-100 rounded-full mr-4">
                                    <ClockIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-blue-800">Sleep Consistency</h3>
                                    <p className="text-blue-700 mt-1">
                                        You're maintaining a consistent sleep schedule. Try to go to bed 30 minutes earlier to improve sleep quality.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start p-4 bg-purple-50 rounded-lg">
                                <div className="p-2 bg-purple-100 rounded-full mr-4">
                                    <ChartBarIcon className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-purple-800">Nutrition Balance</h3>
                                    <p className="text-purple-700 mt-1">
                                        Your macronutrient distribution is well-balanced. Consider increasing protein intake for better muscle recovery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 