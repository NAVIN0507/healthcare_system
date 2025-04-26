'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrophyIcon,
    FireIcon,
    ChartBarIcon,
    StarIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: Date;
    progress: number;
    target: number;
    category: 'strength' | 'cardio' | 'consistency' | 'milestone';
}

export default function WorkoutAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: '1',
            title: 'Workout Warrior',
            description: 'Complete 10 workouts',
            icon: 'trophy',
            progress: 7,
            target: 10,
            category: 'consistency'
        },
        {
            id: '2',
            title: 'Calorie Crusher',
            description: 'Burn 5000 total calories',
            icon: 'fire',
            progress: 3500,
            target: 5000,
            category: 'cardio'
        },
        {
            id: '3',
            title: 'Strength Master',
            description: 'Complete 20 strength workouts',
            icon: 'muscle',
            progress: 15,
            target: 20,
            category: 'strength'
        },
        {
            id: '4',
            title: '30-Day Streak',
            description: 'Work out for 30 consecutive days',
            icon: 'calendar',
            progress: 25,
            target: 30,
            category: 'consistency'
        }
    ]);

    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case 'trophy':
                return <TrophyIcon className="h-6 w-6 text-yellow-400" />;
            case 'fire':
                return <FireIcon className="h-6 w-6 text-orange-400" />;
            case 'muscle':
                return <ChartBarIcon className="h-6 w-6 text-blue-400" />;
            case 'calendar':
                return <StarIcon className="h-6 w-6 text-purple-400" />;
            default:
                return <HeartIcon className="h-6 w-6 text-red-400" />;
        }
    };

    return (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-500/20">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Achievements</h3>
                <span className="text-sm text-gray-400">
                    {achievements.filter(a => (a.progress / a.target) >= 1).length} / {achievements.length} Unlocked
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                    const progressPercentage = (achievement.progress / achievement.target) * 100;
                    const isUnlocked = progressPercentage >= 100;

                    return (
                        <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`relative bg-gray-800/50 rounded-lg p-4 border ${isUnlocked ? 'border-yellow-500/50' : 'border-gray-700/30'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${isUnlocked ? 'bg-yellow-500/20' : 'bg-gray-700/50'
                                    }`}>
                                    {getIconComponent(achievement.icon)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium">{achievement.title}</h4>
                                    <p className="text-sm text-gray-400">{achievement.description}</p>
                                    <div className="mt-2">
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPercentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className={`h-full rounded-full ${isUnlocked
                                                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500'
                                                        : 'bg-gradient-to-r from-violet-500 to-cyan-500'
                                                    }`}
                                            />
                                        </div>
                                        <div className="mt-1 flex justify-between text-xs">
                                            <span className="text-gray-400">
                                                {achievement.progress} / {achievement.target}
                                            </span>
                                            <span className={isUnlocked ? 'text-yellow-400' : 'text-violet-400'}>
                                                {progressPercentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {isUnlocked && (
                                    <div className="absolute top-2 right-2">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <TrophyIcon className="h-5 w-5 text-yellow-400" />
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
} 