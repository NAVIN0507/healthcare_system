'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChartBarIcon,
    CalendarIcon,
    FireIcon,
    ClockIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

// Sample data for progress tracking
const progressData = {
    fitness: {
        weekly: {
            workouts: 4,
            target: 5,
            calories: 1200,
            targetCalories: 1500,
            minutes: 180,
            targetMinutes: 240
        },
        monthly: {
            workouts: 15,
            target: 20,
            calories: 4800,
            targetCalories: 6000,
            minutes: 720,
            targetMinutes: 960
        }
    },
    mealPrep: {
        weekly: {
            meals: 12,
            target: 14,
            calories: 8400,
            targetCalories: 9800,
            protein: 420,
            targetProtein: 490
        },
        monthly: {
            meals: 48,
            target: 56,
            calories: 33600,
            targetCalories: 39200,
            protein: 1680,
            targetProtein: 1960
        }
    }
};

// Sample data for charts
const weeklyData = [
    { day: 'Mon', workouts: 1, meals: 3 },
    { day: 'Tue', workouts: 0, meals: 2 },
    { day: 'Wed', workouts: 1, meals: 3 },
    { day: 'Thu', workouts: 1, meals: 2 },
    { day: 'Fri', workouts: 0, meals: 3 },
    { day: 'Sat', workouts: 1, meals: 3 },
    { day: 'Sun', workouts: 0, meals: 2 }
];

export default function ProgressPage() {
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');
    const [activeTab, setActiveTab] = useState<'fitness' | 'mealPrep'>('fitness');

    const calculateProgress = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setTimeframe('weekly')}
                            className={`px-4 py-2 rounded-lg ${timeframe === 'weekly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeframe('monthly')}
                            className={`px-4 py-2 rounded-lg ${timeframe === 'monthly'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 border-b">
                    <button
                        onClick={() => setActiveTab('fitness')}
                        className={`pb-2 ${activeTab === 'fitness'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500'
                            }`}
                    >
                        Fitness Progress
                    </button>
                    <button
                        onClick={() => setActiveTab('mealPrep')}
                        className={`pb-2 ${activeTab === 'mealPrep'
                                ? 'border-b-2 border-blue-600 text-blue-600'
                                : 'text-gray-500'
                            }`}
                    >
                        Meal Prep Progress
                    </button>
                </div>

                {/* Progress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeTab === 'fitness' ? (
                        <>
                            <ProgressCard
                                title="Workouts"
                                current={progressData.fitness[timeframe].workouts}
                                target={progressData.fitness[timeframe].target}
                                icon={<CalendarIcon className="w-6 h-6" />}
                                unit="workouts"
                            />
                            <ProgressCard
                                title="Calories Burned"
                                current={progressData.fitness[timeframe].calories}
                                target={progressData.fitness[timeframe].targetCalories}
                                icon={<FireIcon className="w-6 h-6" />}
                                unit="calories"
                            />
                            <ProgressCard
                                title="Active Minutes"
                                current={progressData.fitness[timeframe].minutes}
                                target={progressData.fitness[timeframe].targetMinutes}
                                icon={<ClockIcon className="w-6 h-6" />}
                                unit="minutes"
                            />
                        </>
                    ) : (
                        <>
                            <ProgressCard
                                title="Meals Prepared"
                                current={progressData.mealPrep[timeframe].meals}
                                target={progressData.mealPrep[timeframe].target}
                                icon={<CalendarDaysIcon className="w-6 h-6" />}
                                unit="meals"
                            />
                            <ProgressCard
                                title="Calories Tracked"
                                current={progressData.mealPrep[timeframe].calories}
                                target={progressData.mealPrep[timeframe].targetCalories}
                                icon={<FireIcon className="w-6 h-6" />}
                                unit="calories"
                            />
                            <ProgressCard
                                title="Protein Intake"
                                current={progressData.mealPrep[timeframe].protein}
                                target={progressData.mealPrep[timeframe].targetProtein}
                                icon={<ChartBarIcon className="w-6 h-6" />}
                                unit="grams"
                            />
                        </>
                    )}
                </div>

                {/* Weekly Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Weekly Activity</h2>
                    <div className="h-64 flex items-end space-x-2">
                        {weeklyData.map((day, index) => (
                            <div key={day.day} className="flex-1 flex flex-col items-center">
                                <div className="w-full flex justify-center space-x-1 h-full">
                                    <div
                                        className="w-1/2 bg-blue-500 rounded-t"
                                        style={{
                                            height: `${(day.workouts / 2) * 100}%`
                                        }}
                                    />
                                    <div
                                        className="w-1/2 bg-green-500 rounded-t"
                                        style={{
                                            height: `${(day.meals / 4) * 100}%`
                                        }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 mt-2">{day.day}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                            <span className="text-sm">Workouts</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                            <span className="text-sm">Meals</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ProgressCard({
    title,
    current,
    target,
    icon,
    unit
}: {
    title: string;
    current: number;
    target: number;
    icon: React.ReactNode;
    unit: string;
}) {
    const progress = Math.min((current / target) * 100, 100);
    const isOnTrack = current >= target * 0.8;

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                </div>
                {isOnTrack ? (
                    <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
                ) : (
                    <ArrowTrendingDownIcon className="w-5 h-5 text-red-500" />
                )}
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">
                        {current} / {target} {unit}
                    </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Target</span>
                    <span className="font-medium">{target} {unit}</span>
                </div>
            </div>
        </motion.div>
    );
} 