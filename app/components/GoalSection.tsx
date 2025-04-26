'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    PlusIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import GoalMilestones from './GoalMilestones';

interface Goal {
    _id: string;
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    progress: number;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Abandoned';
    startDate: string;
    targetDate: string;
}

export default function GoalSection() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const response = await fetch('/api/goals');
            if (!response.ok) {
                throw new Error('Failed to fetch goals');
            }
            const data = await response.json();
            setGoals(data.goals);
        } catch (error) {
            console.error('Error fetching goals:', error);
            setError(error instanceof Error ? error.message : 'Failed to load goals');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: Goal['status']) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'In Progress':
                return 'bg-blue-100 text-blue-800';
            case 'Abandoned':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-4">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((goal) => (
                    <div
                        key={goal._id}
                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                                    {goal.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{goal.description}</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-medium">{goal.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-600 rounded-full h-2 transition-all duration-300"
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Current</span>
                                    <span className="font-medium">{goal.currentValue} {goal.unit}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Target</span>
                                    <span className="font-medium">{goal.targetValue} {goal.unit}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {goals.length === 0 && (
                <div className="text-center py-12">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No goals</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new goal.</p>
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/dashboard/goals/new')}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                        >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Goal
                        </button>
                    </div>
                </div>
            )}

            {goals.length > 0 && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => router.push('/dashboard/goals/new')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add New Goal
                    </button>
                </div>
            )}

            {/* Add GoalMilestones after the goals list */}
            {goals.length > 0 && (
                <div className="mt-8">
                    <GoalMilestones />
                </div>
            )}
        </div>
    );
} 