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

type GoalCategory = 'fitness' | 'nutrition' | 'weight' | 'health' | 'custom';
type GoalStatus = 'in-progress' | 'completed' | 'failed';
type GoalFrequency = 'daily' | 'weekly' | 'monthly' | 'one-time';

interface Goal {
    id: string;
    title: string;
    description: string;
    category: GoalCategory;
    status: GoalStatus;
    frequency: GoalFrequency;
    target: number;
    current: number;
    unit: string;
    startDate: string;
    endDate: string;
    progress: number;
    streak: number;
    isFavorite: boolean;
}

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showEditGoal, setShowEditGoal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
    const [activeCategory, setActiveCategory] = useState<GoalCategory | 'all'>('all');
    const [activeStatus, setActiveStatus] = useState<GoalStatus | 'all'>('all');
    const [newGoal, setNewGoal] = useState<Partial<Goal>>({
        title: '',
        description: '',
        category: 'fitness',
        frequency: 'daily',
        target: 0,
        unit: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isFavorite: false
    });

    // Sample goals data
    useEffect(() => {
        const sampleGoals: Goal[] = [
            {
                id: '1',
                title: 'Run 5K',
                description: 'Complete a 5K run without stopping',
                category: 'fitness',
                status: 'in-progress',
                frequency: 'one-time',
                target: 5,
                current: 3.2,
                unit: 'km',
                startDate: '2023-06-01',
                endDate: '2023-07-15',
                progress: 64,
                streak: 5,
                isFavorite: true
            },
            {
                id: '2',
                title: 'Drink Water',
                description: 'Drink 8 glasses of water daily',
                category: 'health',
                status: 'in-progress',
                frequency: 'daily',
                target: 8,
                current: 6,
                unit: 'glasses',
                startDate: '2023-06-01',
                endDate: '2023-12-31',
                progress: 75,
                streak: 12,
                isFavorite: false
            },
            {
                id: '3',
                title: 'Weight Loss',
                description: 'Lose 5kg in 3 months',
                category: 'weight',
                status: 'in-progress',
                frequency: 'monthly',
                target: 5,
                current: 2.3,
                unit: 'kg',
                startDate: '2023-05-01',
                endDate: '2023-07-31',
                progress: 46,
                streak: 2,
                isFavorite: true
            },
            {
                id: '4',
                title: 'Protein Intake',
                description: 'Consume 120g of protein daily',
                category: 'nutrition',
                status: 'in-progress',
                frequency: 'daily',
                target: 120,
                current: 95,
                unit: 'g',
                startDate: '2023-06-01',
                endDate: '2023-12-31',
                progress: 79,
                streak: 8,
                isFavorite: false
            },
            {
                id: '5',
                title: 'Meditation',
                description: 'Meditate for 10 minutes daily',
                category: 'health',
                status: 'completed',
                frequency: 'daily',
                target: 10,
                current: 10,
                unit: 'minutes',
                startDate: '2023-05-01',
                endDate: '2023-05-31',
                progress: 100,
                streak: 31,
                isFavorite: true
            },
            {
                id: '6',
                title: 'Push-ups',
                description: 'Do 50 push-ups daily',
                category: 'fitness',
                status: 'failed',
                frequency: 'daily',
                target: 50,
                current: 30,
                unit: 'push-ups',
                startDate: '2023-04-01',
                endDate: '2023-04-30',
                progress: 60,
                streak: 0,
                isFavorite: false
            }
        ];
        setGoals(sampleGoals);
    }, []);

    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.description || !newGoal.unit) return;

        const goal: Goal = {
            id: Date.now().toString(),
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category as GoalCategory,
            status: 'in-progress',
            frequency: newGoal.frequency as GoalFrequency,
            target: newGoal.target || 0,
            current: 0,
            unit: newGoal.unit,
            startDate: newGoal.startDate || new Date().toISOString().split('T')[0],
            endDate: newGoal.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            progress: 0,
            streak: 0,
            isFavorite: newGoal.isFavorite || false
        };

        setGoals([...goals, goal]);
        setShowAddGoal(false);
        setNewGoal({
            title: '',
            description: '',
            category: 'fitness',
            frequency: 'daily',
            target: 0,
            unit: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            isFavorite: false
        });
    };

    const handleEditGoal = () => {
        if (!selectedGoal) return;

        const updatedGoals = goals.map(goal =>
            goal.id === selectedGoal.id ? selectedGoal : goal
        );

        setGoals(updatedGoals);
        setShowEditGoal(false);
        setSelectedGoal(null);
    };

    const handleDeleteGoal = (id: string) => {
        setGoals(goals.filter(goal => goal.id !== id));
    };

    const handleUpdateProgress = (id: string, increment: number) => {
        const updatedGoals = goals.map(goal => {
            if (goal.id === id) {
                const newCurrent = Math.min(goal.current + increment, goal.target);
                const newProgress = Math.round((newCurrent / goal.target) * 100);
                const newStatus = newProgress >= 100 ? 'completed' : goal.status;

                return {
                    ...goal,
                    current: newCurrent,
                    progress: newProgress,
                    status: newStatus
                };
            }
            return goal;
        });

        setGoals(updatedGoals);
    };

    const handleToggleFavorite = (id: string) => {
        const updatedGoals = goals.map(goal =>
            goal.id === id ? { ...goal, isFavorite: !goal.isFavorite } : goal
        );

        setGoals(updatedGoals);
    };

    const filteredGoals = goals.filter(goal => {
        if (activeCategory !== 'all' && goal.category !== activeCategory) return false;
        if (activeStatus !== 'all' && goal.status !== activeStatus) return false;
        return true;
    });

    const getCategoryIcon = (category: GoalCategory) => {
        switch (category) {
            case 'fitness':
                return <FireIcon className="h-6 w-6 text-orange-500" />;
            case 'nutrition':
                return <HeartIcon className="h-6 w-6 text-red-500" />;
            case 'weight':
                return <ArrowTrendingDownIcon className="h-6 w-6 text-blue-500" />;
            case 'health':
                return <SparklesIcon className="h-6 w-6 text-purple-500" />;
            default:
                return <StarIcon className="h-6 w-6 text-yellow-500" />;
        }
    };

    const getStatusIcon = (status: GoalStatus) => {
        switch (status) {
            case 'completed':
                return <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />;
            case 'failed':
                return <XCircleIcon className="h-6 w-6 text-red-500" />;
            default:
                return <ClockSolidIcon className="h-6 w-6 text-blue-500" />;
        }
    };

    const getFrequencyIcon = (frequency: GoalFrequency) => {
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
                                {goals.filter(g => g.status === 'in-progress').length}
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
                                {goals.filter(g => g.status === 'completed').length}
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
                            <p className="text-sm font-medium text-gray-500">Longest Streak</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {Math.max(...goals.map(g => g.streak), 0)}
                            </p>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-full">
                            <FireSolidIcon className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Success Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {goals.length > 0
                                    ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100)
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
                            onChange={(e) => setActiveCategory(e.target.value as GoalCategory | 'all')}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="all">All Categories</option>
                            <option value="fitness">Fitness</option>
                            <option value="nutrition">Nutrition</option>
                            <option value="weight">Weight</option>
                            <option value="health">Health</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={activeStatus}
                            onChange={(e) => setActiveStatus(e.target.value as GoalStatus | 'all')}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
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
                        key={goal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden border ${goal.status === 'completed'
                            ? 'border-green-200'
                            : goal.status === 'failed'
                                ? 'border-red-200'
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
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${goal.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : goal.status === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {goal.status === 'completed'
                                                    ? 'Completed'
                                                    : goal.status === 'failed'
                                                        ? 'Failed'
                                                        : 'In Progress'}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500 flex items-center">
                                                {getFrequencyIcon(goal.frequency)}
                                                <span className="ml-1">{goal.frequency}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleFavorite(goal.id)}
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
                                        onClick={() => handleDeleteGoal(goal.id)}
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
                                        className={`h-2.5 rounded-full ${goal.status === 'completed'
                                            ? 'bg-green-500'
                                            : goal.status === 'failed'
                                                ? 'bg-red-500'
                                                : 'bg-primary-500'
                                            }`}
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                    <span>{goal.current} {goal.unit}</span>
                                    <span>{goal.target} {goal.unit}</span>
                                </div>
                            </div>

                            {goal.status === 'in-progress' && (
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleUpdateProgress(goal.id, -1)}
                                        className="flex-1 py-1 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        -
                                    </button>
                                    <button
                                        onClick={() => handleUpdateProgress(goal.id, 1)}
                                        className="flex-1 py-1 px-3 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-200 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    <span>{new Date(goal.startDate).toLocaleDateString()} - {new Date(goal.endDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <FireIcon className="h-4 w-4 mr-1 text-orange-500" />
                                    <span>{goal.streak} day streak</span>
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
                                                            onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as GoalCategory })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="fitness">Fitness</option>
                                                            <option value="nutrition">Nutrition</option>
                                                            <option value="weight">Weight</option>
                                                            <option value="health">Health</option>
                                                            <option value="custom">Custom</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                                                            Frequency
                                                        </label>
                                                        <select
                                                            id="frequency"
                                                            value={newGoal.frequency}
                                                            onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value as GoalFrequency })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="one-time">One-time</option>
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
                                                            value={newGoal.target}
                                                            onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) })}
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
                                                            value={newGoal.endDate}
                                                            onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
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
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, category: e.target.value as GoalCategory })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="fitness">Fitness</option>
                                                            <option value="nutrition">Nutrition</option>
                                                            <option value="weight">Weight</option>
                                                            <option value="health">Health</option>
                                                            <option value="custom">Custom</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label htmlFor="edit-frequency" className="block text-sm font-medium text-gray-700">
                                                            Frequency
                                                        </label>
                                                        <select
                                                            id="edit-frequency"
                                                            value={selectedGoal.frequency}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, frequency: e.target.value as GoalFrequency })}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                            <option value="one-time">One-time</option>
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
                                                            value={selectedGoal.target}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, target: parseFloat(e.target.value) })}
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
                                                            value={selectedGoal.endDate}
                                                            onChange={(e) => setSelectedGoal({ ...selectedGoal, endDate: e.target.value })}
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