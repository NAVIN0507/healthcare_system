'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FlagIcon,
    CheckCircleIcon,
    ChartBarIcon,
    CalendarIcon,
    PhotoIcon,
    PlusIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface Milestone {
    id: string;
    title: string;
    description: string;
    targetDate: Date;
    completed: boolean;
    progressPhotos?: string[];
}

interface GoalMilestone {
    id: string;
    title: string;
    description: string;
    category: string;
    targetDate: Date;
    milestones: Milestone[];
    progress: number;
    target: number;
    unit: string;
}

export default function GoalMilestones() {
    const [showAddPhoto, setShowAddPhoto] = useState(false);
    const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
    const [goals, setGoals] = useState<GoalMilestone[]>([
        {
            id: '1',
            title: 'Weight Loss Journey',
            description: 'Achieve healthy weight loss through consistent exercise and diet',
            category: 'Weight Loss',
            targetDate: new Date('2024-12-31'),
            progress: 8,
            target: 20,
            unit: 'kg',
            milestones: [
                {
                    id: 'm1',
                    title: 'First 5kg',
                    description: 'Lose first 5kg through cardio and diet',
                    targetDate: new Date('2024-03-31'),
                    completed: true,
                    progressPhotos: ['/progress1.jpg', '/progress2.jpg']
                },
                {
                    id: 'm2',
                    title: 'Halfway Point',
                    description: 'Reach 10kg weight loss milestone',
                    targetDate: new Date('2024-06-30'),
                    completed: false
                },
                {
                    id: 'm3',
                    title: 'Final Goal',
                    description: 'Achieve target weight and maintain',
                    targetDate: new Date('2024-12-31'),
                    completed: false
                }
            ]
        }
    ]);

    const handleAddPhoto = (goalId: string, milestoneId: string) => {
        // In a real app, this would open a file picker and upload the photo
        console.log('Adding photo to milestone:', milestoneId);
        setShowAddPhoto(false);
    };

    const handleMilestoneComplete = (goalId: string, milestoneId: string) => {
        setGoals(prevGoals =>
            prevGoals.map(goal => {
                if (goal.id === goalId) {
                    return {
                        ...goal,
                        milestones: goal.milestones.map(milestone =>
                            milestone.id === milestoneId
                                ? { ...milestone, completed: !milestone.completed }
                                : milestone
                        )
                    };
                }
                return goal;
            })
        );
    };

    return (
        <div className="space-y-6">
            {goals.map(goal => (
                <div
                    key={goal.id}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-500/20"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">{goal.title}</h3>
                            <p className="text-sm text-gray-400">{goal.description}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-400">
                            {goal.category}
                        </span>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Overall Progress</span>
                            <span className="text-sm text-violet-400">
                                {goal.progress} / {goal.target} {goal.unit}
                            </span>
                        </div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(goal.progress / goal.target) * 100}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {goal.milestones.map(milestone => (
                            <motion.div
                                key={milestone.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`relative bg-gray-800/50 rounded-lg p-4 border ${milestone.completed ? 'border-green-500/50' : 'border-gray-700/30'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <button
                                        onClick={() => handleMilestoneComplete(goal.id, milestone.id)}
                                        className={`p-2 rounded-lg ${milestone.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-400'
                                            }`}
                                    >
                                        <CheckCircleIcon className="h-6 w-6" />
                                    </button>
                                    <div className="flex-1">
                                        <h4 className="text-white font-medium">{milestone.title}</h4>
                                        <p className="text-sm text-gray-400">{milestone.description}</p>

                                        {milestone.progressPhotos && milestone.progressPhotos.length > 0 && (
                                            <div className="mt-3 flex gap-2">
                                                {milestone.progressPhotos.map((photo, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-16 h-16 rounded-lg bg-gray-700 overflow-hidden"
                                                    >
                                                        <img
                                                            src={photo}
                                                            alt={`Progress ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        setSelectedMilestone(milestone.id);
                                                        setShowAddPhoto(true);
                                                    }}
                                                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors"
                                                >
                                                    <PlusIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-400">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        <span>{milestone.targetDate.toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {showAddPhoto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Add Progress Photo</h3>
                            <button
                                onClick={() => setShowAddPhoto(false)}
                                className="text-gray-400 hover:text-gray-300"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div
                                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
                                onClick={() => handleAddPhoto(goals[0].id, selectedMilestone!)}
                            >
                                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">Click to upload a photo</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowAddPhoto(false)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleAddPhoto(goals[0].id, selectedMilestone!)}
                                    className="ml-3 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 