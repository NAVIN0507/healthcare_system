'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    HeartIcon,
    FireIcon,
    ScaleIcon,
    ClockIcon,
    MoonIcon,
} from '@heroicons/react/24/outline';

interface HealthMetric {
    icon: any;
    label: string;
    value: string;
    trend: number;
    color: string;
}

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);

    // Sample data - in a real app, this would come from your API
    const monthlyStats = {
        totalWorkouts: 12,
        avgDuration: '45 min',
        caloriesBurned: 4500,
        streakDays: 8
    };

    const healthMetrics: HealthMetric[] = [
        {
            icon: HeartIcon,
            label: 'Heart Rate',
            value: '72 bpm',
            trend: 2,
            color: 'text-red-500'
        },
        {
            icon: ChartBarIcon,
            label: 'Steps',
            value: '8,432',
            trend: 5,
            color: 'text-blue-500'
        },
        {
            icon: MoonIcon,
            label: 'Sleep',
            value: '7.5 hrs',
            trend: -1,
            color: 'text-purple-500'
        },
        {
            icon: ScaleIcon,
            label: 'Weight',
            value: '165 lbs',
            trend: -0.5,
            color: 'text-green-500'
        }
    ];

    const weeklyProgress = [
        { day: 'Mon', workouts: 2 },
        { day: 'Tue', workouts: 1 },
        { day: 'Wed', workouts: 3 },
        { day: 'Thu', workouts: 0 },
        { day: 'Fri', workouts: 2 },
        { day: 'Sat', workouts: 1 },
        { day: 'Sun', workouts: 0 }
    ];

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>

            {/* Monthly Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-blue-600 text-sm">Total Workouts</div>
                    <div className="text-2xl font-bold">{monthlyStats.totalWorkouts}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-green-600 text-sm">Avg Duration</div>
                    <div className="text-2xl font-bold">{monthlyStats.avgDuration}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="text-orange-600 text-sm">Calories Burned</div>
                    <div className="text-2xl font-bold">{monthlyStats.caloriesBurned}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-purple-600 text-sm">Streak Days</div>
                    <div className="text-2xl font-bold">{monthlyStats.streakDays}</div>
                </div>
            </div>

            {/* Health Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {healthMetrics.map((metric, index) => (
                    <div key={index} className="bg-white border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <metric.icon className={`w-6 h-6 ${metric.color}`} />
                            <div className="flex items-center">
                                <ArrowTrendingUpIcon
                                    className={`w-4 h-4 ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'} transform ${metric.trend >= 0 ? '' : 'rotate-180'}`}
                                />
                                <span className={`text-sm ${metric.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {Math.abs(metric.trend)}%
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                        <div className="text-xl font-semibold">{metric.value}</div>
                    </div>
                ))}
            </div>

            {/* Weekly Progress Chart */}
            <div className="bg-white border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Weekly Progress</h3>
                <div className="flex items-end justify-between h-32">
                    {weeklyProgress.map((day, index) => (
                        <div key={index} className="flex flex-col items-center w-1/7">
                            <div
                                className="w-8 bg-blue-500 rounded-t"
                                style={{
                                    height: `${day.workouts * 30}px`,
                                    backgroundColor: day.workouts > 0 ? '#3B82F6' : '#E5E7EB'
                                }}
                            ></div>
                            <div className="text-sm text-gray-600 mt-2">{day.day}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard; 