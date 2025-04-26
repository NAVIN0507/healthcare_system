'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    SparklesIcon,
    BoltIcon,
    HeartIcon,
    FireIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';

interface UserMetrics {
    recentWorkouts: number;
    averageIntensity: number;
    completionRate: number;
    consistencyScore: number;
    preferredWorkoutTypes: string[];
    fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface Recommendation {
    type: 'workout' | 'nutrition' | 'recovery';
    title: string;
    description: string;
    intensity: number;
    duration: string;
    benefits: string[];
    icon: JSX.Element;
}

export default function AIRecommendationEngine() {
    const [userMetrics, setUserMetrics] = useState<UserMetrics>({
        recentWorkouts: 0,
        averageIntensity: 0,
        completionRate: 0,
        consistencyScore: 0,
        preferredWorkoutTypes: [],
        fitnessLevel: 'Beginner'
    });
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching user metrics and generating recommendations
        const fetchUserMetrics = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be an API call
                const mockMetrics: UserMetrics = {
                    recentWorkouts: 12,
                    averageIntensity: 7.5,
                    completionRate: 85,
                    consistencyScore: 90,
                    preferredWorkoutTypes: ['HIIT', 'Strength', 'Cardio'],
                    fitnessLevel: 'Intermediate'
                };
                setUserMetrics(mockMetrics);
                generateRecommendations(mockMetrics);
            } catch (error) {
                console.error('Error fetching user metrics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserMetrics();
    }, []);

    const generateRecommendations = (metrics: UserMetrics) => {
        // AI logic to generate personalized recommendations based on user metrics
        const recommendations: Recommendation[] = [
            {
                type: 'workout',
                title: 'High-Intensity Interval Training',
                description: 'Based on your recent performance and fitness level, we recommend a HIIT session focusing on full-body exercises.',
                intensity: 8,
                duration: '30 minutes',
                benefits: ['Improved cardiovascular health', 'Enhanced fat burning', 'Increased stamina'],
                icon: <FireIcon className="h-6 w-6 text-orange-500" />
            },
            {
                type: 'nutrition',
                title: 'Pre-workout Nutrition Plan',
                description: 'Optimize your performance with this personalized pre-workout meal plan.',
                intensity: 6,
                duration: 'Consume 1-2 hours before workout',
                benefits: ['Enhanced energy levels', 'Better muscle recovery', 'Improved performance'],
                icon: <BoltIcon className="h-6 w-6 text-yellow-500" />
            },
            {
                type: 'recovery',
                title: 'Active Recovery Session',
                description: 'Based on your workout intensity, we recommend a light recovery session.',
                intensity: 4,
                duration: '20 minutes',
                benefits: ['Reduced muscle soreness', 'Improved flexibility', 'Enhanced recovery'],
                icon: <HeartIcon className="h-6 w-6 text-red-500" />
            }
        ];

        setRecommendations(recommendations);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <SparklesIcon className="h-8 w-8 text-primary-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">AI Recommendations</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Fitness Level:</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                        {userMetrics.fitnessLevel}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recent Workouts</span>
                        <FireIcon className="h-5 w-5 text-violet-500" />
                    </div>
                    <p className="text-2xl font-bold text-violet-700">{userMetrics.recentWorkouts}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <ChartBarIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{userMetrics.completionRate}%</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Consistency Score</span>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-700">{userMetrics.consistencyScore}%</p>
                </div>
            </div>

            <div className="space-y-6">
                {recommendations.map((recommendation, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow border border-gray-100"
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {recommendation.icon}
                            </div>
                            <div className="ml-4 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
                                <p className="text-gray-600 mb-4">{recommendation.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center">
                                        <FireIcon className="h-4 w-4 mr-1" />
                                        <span>Intensity: {recommendation.intensity}/10</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        <span>{recommendation.duration}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recommendation.benefits.map((benefit, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
} 