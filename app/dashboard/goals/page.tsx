'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    PencilIcon,
    TrashIcon,
    ChartBarIcon,
    FireIcon,
    HeartIcon,
    ClockIcon,
    CalendarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    TrophyIcon,
    StarIcon,
    BoltIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    CheckCircleIcon as CheckCircleSolidIcon,
    FireIcon as FireSolidIcon,
    HeartIcon as HeartSolidIcon,
    ClockIcon as ClockSolidIcon
} from '@heroicons/react/24/solid';

interface Goal {
    _id: string;
    title: string;
    description?: string;
    category: 'Weight Loss' | 'Muscle Gain' | 'Cardio' | 'Strength' | 'Nutrition' | 'Mental Health' | 'Other';
    targetValue: number;
    currentValue: number;
    unit: string;
    startDate: string;
    targetDate: string;
    progress: number;
    status: 'In Progress' | 'Completed';
    createdAt: string;
    reminders?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'none';
        time: string;
        enabled: boolean;
    };
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [activeCategory, setActiveCategory] = useState<Goal['category'] | 'all'>('all');
    const [activeStatus, setActiveStatus] = useState<Goal['status'] | 'all'>('all');
    const [newGoal, setNewGoal] = useState<Partial<Goal>>({
        title: '',
        description: '',
        category: 'Cardio',
        targetValue: 0,
        unit: '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reminders: {
            frequency: 'none',
            time: '09:00',
            enabled: false
        }
    });

    // Fetch goals from API
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/goals');
                if (!response.ok) {
                    throw new Error('Failed to fetch goals');
                }
                const data = await response.json();
                setGoals(data.goals);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch goals');
            } finally {
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    const handleAddGoal = async () => {
        if (!newGoal.title || !newGoal.unit) return;

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGoal),
            });

            if (!response.ok) {
                throw new Error('Failed to create goal');
            }

            const data = await response.json();
            setGoals(prevGoals => [...prevGoals, data.goal]);
            setShowAddGoal(false);
            setNewGoal({
                title: '',
                description: '',
                category: 'Cardio',
                targetValue: 0,
                unit: '',
                startDate: new Date().toISOString().split('T')[0],
                targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                reminders: {
                    frequency: 'none',
                    time: '09:00',
                    enabled: false
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create goal');
        }
    };

    const handleEditGoal = async () => {
        if (!selectedGoal) return;

        try {
            const response = await fetch(`/api/goals/${selectedGoal._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedGoal),
            });

            if (!response.ok) {
                throw new Error('Failed to update goal');
            }

            const data = await response.json();
            setGoals(prevGoals =>
                prevGoals.map(goal =>
                    goal._id === selectedGoal._id ? data.goal : goal
                )
            );
            setShowEditGoal(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update goal');
        }
    };

    const handleDeleteGoal = async (id: string) => {
        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete goal');
            }

            setGoals(prevGoals => prevGoals.filter(goal => goal._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete goal');
        }
    };

    const handleUpdateProgress = async (id: string, increment: number) => {
        const goal = goals.find(g => g._id === id);
        if (!goal) return;

        const newCurrentValue = Math.min(goal.currentValue + increment, goal.targetValue);
        const newProgress = Math.round((newCurrentValue / goal.targetValue) * 100);
        const newStatus = newProgress >= 100 ? 'Completed' : 'In Progress';

        try {
            const response = await fetch(`/api/goals/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...goal,
                    currentValue: newCurrentValue,
                    progress: newProgress,
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update goal progress');
            }

            const data = await response.json();
            setGoals(prevGoals =>
                prevGoals.map(g =>
                    g._id === id ? data.goal : g
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update goal progress');
        }
    };

    const handleToggleFavorite = (id: string) => {
        const updatedGoals = goals.map(goal =>
            goal._id === id ? { ...goal, isFavorite: !goal.isFavorite } : goal
        );

        setGoals(updatedGoals);
    };

    const filteredGoals = goals.filter(goal => {
        if (activeCategory !== 'all' && goal.category !== activeCategory) return false;
        if (activeStatus !== 'all' && goal.status !== activeStatus) return false;
        return true;
    });

    const getCategoryIcon = (category: Goal['category']) => {
        switch (category) {
            case 'Weight Loss':
                return <ArrowTrendingDownIcon className="h-6 w-6 text-blue-500" />;
            case 'Muscle Gain':
                return <ArrowTrendingUpIcon className="h-6 w-6 text-green-500" />;
            case 'Cardio':
                return <HeartIcon className="h-6 w-6 text-red-500" />;
            case 'Strength':
                return <BoltIcon className="h-6 w-6 text-purple-500" />;
            case 'Nutrition':
                return <HeartIcon className="h-6 w-6 text-red-500" />;
            case 'Mental Health':
                return <SparklesIcon className="h-6 w-6 text-purple-500" />;
            default:
                return <StarIcon className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusIcon = (status: Goal['status']) => {
        switch (status) {
            case 'Completed':
                return <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />;
            default:
                return <ClockSolidIcon className="h-6 w-6 text-blue-500" />;
        }
    };

    const getFrequencyIcon = (frequency: 'daily' | 'weekly' | 'monthly' | 'none') => {
        switch (frequency) {
            case 'daily':
                return <CalendarIcon className="h-5 w-5 text-gray-500" />;
            case 'weekly':
                return <CalendarIcon className="h-5 w-5 text-gray-500" />;
            case 'monthly':
                return <CalendarIcon className="h-5 w-5 text-gray-500" />;
            default:
                return <ClockIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Goals</h1>
                    <p className="text-gray-500 mt-1">Set, track, and achieve your fitness and health goals</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddGoal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md hover:bg-primary-700 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Goal
                </motion.button>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Goals</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {goals.filter(g => g.status === 'In Progress').length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <BoltIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {goals.filter(g => g.status === 'Completed').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <TrophyIcon className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {goals.length > 0
                                    ? Math.round((goals.filter(g => g.status === 'Completed').length / goals.length) * 100)
                                    : 0}%
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <ChartBarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
            >
                <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={activeCategory}
                            onChange={(e) => setActiveCategory(e.target.value as Goal['category'] | 'all')}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="Weight Loss">Weight Loss</option>
                            <option value="Muscle Gain">Muscle Gain</option>
                            <option value="Cardio">Cardio</option>
                            <option value="Strength">Strength</option>
                            <option value="Nutrition">Nutrition</option>
                            <option value="Mental Health">Mental Health</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={activeStatus}
                            onChange={(e) => setActiveStatus(e.target.value as Goal['status'] | 'all')}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </motion.div>

            {/* Goals Grid */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredGoals.map((goal, index) => (
                    <motion.div
                        key={goal._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden border ${goal.status === 'Completed'
                            ? 'border-green-200'
                            : 'border-gray-100'
                            }`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-gray-100">
                                        {getCategoryIcon(goal.category)}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                                        <div className="flex items-center mt-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${goal.status === 'Completed'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {goal.status === 'Completed'
                                                    ? 'Completed'
                                                    : 'In Progress'}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500 flex items-center">
                                                {getFrequencyIcon(goal.reminders?.frequency || 'none')}
                                                <span className="ml-1">{goal.reminders?.frequency || 'None'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleFavorite(goal._id)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        {goal.isFavorite ? (
                                            <StarIcon className="h-5 w-5 text-yellow-500" />
                                        ) : (
                                            <StarIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedGoal(goal);
                                            setShowEditGoal(true);
                                        }}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <PencilIcon className="h-5 w-5 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGoal(goal._id)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <TrashIcon className="h-5 w-5 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <p className="mt-3 text-gray-600">{goal.description}</p>

                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="font-medium">{goal.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${goal.status === 'Completed'
                                            ? 'bg-green-500'
                                            : 'bg-primary-500'
                                            }`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                    <span>{goal.currentValue} {goal.unit}</span>
                                    <span>{goal.targetValue} {goal.unit}</span>
                                </div>
                            </div>

                            {goal.status === 'In Progress' && (
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateProgress(goal._id, -1)}
                                        className="flex-1 py-1 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => handleUpdateProgress(goal._id, 1)}
                                        className="flex-1 py-1 px-3 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>{new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.targetDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <FireIcon className="h-4 w-4 mr-1 text-orange-500" />
                                    <span>{goal.reminders?.frequency === 'daily' ? 'Daily' : ''}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Add Goal Modal */}
            <AnimatePresence>
                {showAddGoal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 transition-opacity"
                                aria-hidden="true"
                            >
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </motion.div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Add New Goal
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                        Goal Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="title"
                                                        value={newGoal.title}
                                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        placeholder="e.g., Run 5K"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="description"
                                                        value={newGoal.description}
                                                        onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                                        rows={3}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        placeholder="Describe your goal..."
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                            Category
                                                        </label>
                                                        <select
                                                            id="category"
                                                            value={newGoal.category}
                                                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="Weight Loss">Weight Loss</option>
                                                            <option value="Muscle Gain">Muscle Gain</option>
                                                            <option value="Cardio">Cardio</option>
                                                            <option value="Strength">Strength</option>
                                                            <option value="Nutrition">Nutrition</option>
                                                            <option value="Mental Health">Mental Health</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                                                            Frequency
                                                        </label>
                                                        <select
                                                            id="frequency"
                                                            value={newGoal.reminders?.frequency}
                                                            onChange={(e) => setNewGoal({ ...newGoal, reminders: { ...newGoal.reminders, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'none' } })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="none">None</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                                                            Target
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="target"
                                                            value={newGoal.targetValue}
                                                            onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseFloat(e.target.value) })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                            placeholder="e.g., 5"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                                            Unit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="unit"
                                                            value={newGoal.unit}
                                                            onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                            placeholder="e.g., km, kg, glasses"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="startDate"
                                                            value={newGoal.startDate}
                                                            onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="endDate"
                                                            value={newGoal.targetDate}
                                                            onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        id="isFavorite"
                                                        type="checkbox"
                                                        checked={newGoal.isFavorite}
                                                        onChange={(e) => setNewGoal({ ...newGoal, isFavorite: e.target.checked })}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-700">
                                                        Mark as favorite
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleAddGoal}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Add Goal
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowAddGoal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Goal Modal */}
            <AnimatePresence>
                {showEditGoal && selectedGoal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 transition-opacity"
                                aria-hidden="true"
                            >
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </motion.div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            >
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                                Edit Goal
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">
                                                        Goal Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="edit-title"
                                                        value={selectedGoal.title}
                                                        onChange={(e) => setSelectedGoal({ ...selectedGoal, title: e.target.value })}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        id="edit-description"
                                                        value={selectedGoal.description}
                                                        onChange={(e) => setSelectedGoal({ ...selectedGoal, description: e.target.value })}
                                                        rows={3}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                                                            Category
                                                        </label>
                                                        <select
                                                            id="edit-category"
                                                            value={selectedGoal.category}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, category: e.target.value as Goal['category'] })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="Weight Loss">Weight Loss</option>
                                                            <option value="Muscle Gain">Muscle Gain</option>
                                                            <option value="Cardio">Cardio</option>
                                                            <option value="Strength">Strength</option>
                                                            <option value="Nutrition">Nutrition</option>
                                                            <option value="Mental Health">Mental Health</option>
                                                            <option value="Other">Other</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="edit-frequency" className="block text-sm font-medium text-gray-700">
                                                            Frequency
                                                        </label>
                                                        <select
                                                            id="edit-frequency"
                                                            value={selectedGoal.reminders?.frequency}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, reminders: { ...selectedGoal.reminders, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' | 'none' } })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="none">None</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="edit-target" className="block text-sm font-medium text-gray-700">
                                                            Target
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="edit-target"
                                                            value={selectedGoal.targetValue}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, targetValue: parseFloat(e.target.value) })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="edit-unit" className="block text-sm font-medium text-gray-700">
                                                            Unit
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="edit-unit"
                                                            value={selectedGoal.unit}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, unit: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="edit-startDate" className="block text-sm font-medium text-gray-700">
                                                            Start Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="edit-startDate"
                                                            value={selectedGoal.startDate}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, startDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="edit-endDate" className="block text-sm font-medium text-gray-700">
                                                            End Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            id="edit-endDate"
                                                            value={selectedGoal.targetDate}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, targetDate: e.target.value })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        id="edit-isFavorite"
                                                        type="checkbox"
                                                        checked={selectedGoal.isFavorite}
                                                        onChange={(e) => setSelectedGoal({ ...selectedGoal, isFavorite: e.target.checked })}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                                    />
                                                    <label htmlFor="edit-isFavorite" className="ml-2 block text-sm text-gray-700">
                                                        Mark as favorite
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleEditGoal}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save Changes
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowEditGoal(false)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
} 