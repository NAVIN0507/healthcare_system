'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FireIcon,
    ClockIcon,
    ChartBarIcon,
    HeartIcon,
    BoltIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    ChevronRightIcon,
    PlayIcon,
    PauseIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon as PendingIcon,
    CalendarIcon,
    UserGroupIcon,
    TrophyIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Sample workout data
const workouts = [
    {
        id: 1,
        title: 'Full Body HIIT',
        description: 'High-intensity interval training targeting all major muscle groups',
        duration: 45,
        calories: 450,
        difficulty: 'Advanced',
        category: 'HIIT',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: true,
        date: new Date(2023, 5, 15),
        stats: {
            heartRate: 145,
            steps: 8500,
            distance: 3.2
        }
    },
    {
        id: 2,
        title: 'Upper Body Strength',
        description: 'Focus on chest, shoulders, and arms with weighted exercises',
        duration: 60,
        calories: 380,
        difficulty: 'Intermediate',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: false,
        date: new Date(2023, 5, 18),
        stats: {
            heartRate: 120,
            steps: 4200,
            distance: 1.8
        }
    },
    {
        id: 3,
        title: 'Core Crusher',
        description: 'Intensive ab and core workout with planks and crunches',
        duration: 30,
        calories: 250,
        difficulty: 'Intermediate',
        category: 'Core',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: true,
        date: new Date(2023, 5, 20),
        stats: {
            heartRate: 130,
            steps: 3500,
            distance: 1.5
        }
    },
    {
        id: 4,
        title: 'Lower Body Power',
        description: 'Squats, lunges, and deadlifts for strong legs',
        duration: 50,
        calories: 420,
        difficulty: 'Advanced',
        category: 'Strength',
        image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: false,
        date: new Date(2023, 5, 22),
        stats: {
            heartRate: 135,
            steps: 5200,
            distance: 2.5
        }
    },
    {
        id: 5,
        title: 'Cardio Blast',
        description: 'Running, jumping rope, and burpees for maximum cardio',
        duration: 40,
        calories: 500,
        difficulty: 'Advanced',
        category: 'Cardio',
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: true,
        date: new Date(2023, 5, 25),
        stats: {
            heartRate: 160,
            steps: 9200,
            distance: 4.2
        }
    },
    {
        id: 6,
        title: 'Yoga Flow',
        description: 'Relaxing yoga session for flexibility and mindfulness',
        duration: 60,
        calories: 200,
        difficulty: 'Beginner',
        category: 'Flexibility',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        completed: false,
        date: new Date(2023, 5, 28),
        stats: {
            heartRate: 95,
            steps: 2800,
            distance: 1.2
        }
    }
];

// Workout categories
const categories = [
    { name: 'All', count: workouts.length },
    { name: 'HIIT', count: workouts.filter(w => w.category === 'HIIT').length },
    { name: 'Strength', count: workouts.filter(w => w.category === 'Strength').length },
    { name: 'Core', count: workouts.filter(w => w.category === 'Core').length },
    { name: 'Cardio', count: workouts.filter(w => w.category === 'Cardio').length },
    { name: 'Flexibility', count: workouts.filter(w => w.category === 'Flexibility').length }
];

// Difficulty colors
const difficultyColors = {
    'Beginner': 'bg-emerald-100 text-emerald-800',
    'Intermediate': 'bg-amber-100 text-amber-800',
    'Advanced': 'bg-rose-100 text-rose-800'
};

// Category colors
const categoryColors = {
    'HIIT': 'bg-violet-100 text-violet-800',
    'Strength': 'bg-cyan-100 text-cyan-800',
    'Core': 'bg-amber-100 text-amber-800',
    'Cardio': 'bg-rose-100 text-rose-800',
    'Flexibility': 'bg-emerald-100 text-emerald-800'
};

// Weekly progress data
const weeklyProgress = [
    { day: 'Mon', workouts: 2, minutes: 90, calories: 650 },
    { day: 'Tue', workouts: 1, minutes: 45, calories: 350 },
    { day: 'Wed', workouts: 3, minutes: 120, calories: 950 },
    { day: 'Thu', workouts: 0, minutes: 0, calories: 0 },
    { day: 'Fri', workouts: 2, minutes: 80, calories: 600 },
    { day: 'Sat', workouts: 1, minutes: 60, calories: 400 },
    { day: 'Sun', workouts: 0, minutes: 0, calories: 0 }
];

// Monthly stats
const monthlyStats = {
    totalWorkouts: 24,
    totalMinutes: 1080,
    totalCalories: 8500,
    streak: 5,
    improvement: 12
};

export default function WorkoutsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'favorites'
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [workoutTimer, setWorkoutTimer] = useState(null);

    // Filter workouts based on selected category and search query
    const filteredWorkouts = workouts.filter(workout => {
        const categoryMatch = selectedCategory === 'All' || workout.category === selectedCategory;
        const searchMatch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workout.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

    // Get upcoming workouts
    const upcomingWorkouts = filteredWorkouts.filter(workout => !workout.completed);

    // Get completed workouts
    const completedWorkouts = filteredWorkouts.filter(workout => workout.completed);

    // Handle workout selection
    const handleWorkoutSelect = (workout) => {
        setSelectedWorkout(workout);
        setIsWorkoutModalOpen(true);
    };

    // Handle workout completion
    const handleWorkoutComplete = (workoutId) => {
        const updatedWorkouts = workouts.map(workout =>
            workout.id === workoutId ? { ...workout, completed: !workout.completed } : workout
        );
        // In a real app, you would update the state or make an API call here
        console.log('Workout completed:', workoutId);
    };

    // Start workout timer
    const startWorkoutTimer = () => {
        setIsPlaying(true);
        const timer = setInterval(() => {
            setCurrentTime(prevTime => prevTime + 1);
        }, 1000);
        setWorkoutTimer(timer);
    };

    // Pause workout timer
    const pauseWorkoutTimer = () => {
        setIsPlaying(false);
        clearInterval(workoutTimer);
    };

    // Format time (seconds to MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (workoutTimer) {
                clearInterval(workoutTimer);
            }
        };
    }, [workoutTimer]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workouts</h1>
                    <p className="text-gray-400">Track your fitness journey and discover new exercises</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg shadow-lg"
                >
                    <span>New Workout</span>
                </motion.button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-violet-500/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Workouts</p>
                            <h3 className="text-2xl font-bold text-white">{monthlyStats.totalWorkouts}</h3>
                        </div>
                        <div className="p-3 bg-violet-500/20 rounded-lg">
                            <FireIcon className="h-6 w-6 text-violet-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">+{monthlyStats.improvement}% from last month</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-cyan-500/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Minutes Active</p>
                            <h3 className="text-2xl font-bold text-white">{monthlyStats.totalMinutes}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/20 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-cyan-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">+{Math.floor(monthlyStats.improvement / 2)}% from last month</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-amber-500/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Calories Burned</p>
                            <h3 className="text-2xl font-bold text-white">{monthlyStats.totalCalories}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/20 rounded-lg">
                            <BoltIcon className="h-6 w-6 text-amber-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">+{Math.floor(monthlyStats.improvement * 1.5)}% from last month</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-emerald-500/20"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Current Streak</p>
                            <h3 className="text-2xl font-bold text-white">{monthlyStats.streak} days</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                            <TrophyIcon className="h-6 w-6 text-emerald-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-xs text-green-400">Personal best: {monthlyStats.streak + 3} days</span>
                    </div>
                </motion.div>
            </div>

            {/* Weekly Progress Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-violet-500/20"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Weekly Activity</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Workouts</span>
                        <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        <span className="text-xs text-gray-400">Minutes</span>
                        <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                    </div>
                </div>
                <div className="h-64 flex items-end justify-between">
                    {weeklyProgress.map((day, index) => (
                        <div key={day.day} className="flex flex-col items-center w-full">
                            <div className="flex items-end justify-center space-x-1 w-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.workouts / 3) * 100}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    className="w-6 bg-violet-500 rounded-t-lg"
                                    style={{ maxHeight: '100%' }}
                                ></motion.div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.minutes / 120) * 100}%` }}
                                    transition={{ duration: 0.5, delay: 0.1 * index }}
                                    className="w-6 bg-cyan-500 rounded-t-lg"
                                    style={{ maxHeight: '100%' }}
                                ></motion.div>
                            </div>
                            <span className="text-xs text-gray-400 mt-2">{day.day}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Tabs and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Tabs */}
                <div className="flex items-center bg-gray-900/80 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`flex items-center justify-center px-4 py-2 rounded-md ${activeTab === 'upcoming' ? 'bg-white/10 text-white' : 'text-gray-400'
                            }`}
                    >
                        <CalendarIcon className="h-5 w-5 mr-2" />
                        <span>Upcoming</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`flex items-center justify-center px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-white/10 text-white' : 'text-gray-400'
                            }`}
                    >
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span>Completed</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center justify-center px-4 py-2 rounded-md ${activeTab === 'favorites' ? 'bg-white/10 text-white' : 'text-gray-400'
                            }`}
                    >
                        <StarIcon className="h-5 w-5 mr-2" />
                        <span>Favorites</span>
                    </button>
                </div>

                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search workouts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900/80 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => setSelectedCategory(category.name)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${selectedCategory === category.name
                                ? 'bg-gray-100 text-gray-900'
                                : 'bg-gray-900/80 text-gray-300'
                                }`}
                        >
                            {category.name} ({category.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Workout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === 'upcoming' ? upcomingWorkouts :
                    activeTab === 'completed' ? completedWorkouts :
                        filteredWorkouts).map((workout) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-900/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/30"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={workout.image}
                                        alt={workout.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[workout.difficulty]
                                            }`}>
                                            {workout.difficulty}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[workout.category]
                                            }`}>
                                            {workout.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white">{workout.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1">{workout.description}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center text-sm text-gray-300">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            <span>{workout.duration} min</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <FireIcon className="h-4 w-4 mr-1" />
                                            <span>{workout.calories} cal</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            <span>{format(workout.date, 'MMM d')}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleWorkoutSelect(workout)}
                                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg shadow-lg"
                                        >
                                            <PlayIcon className="h-4 w-4 mr-2" />
                                            <span>Start</span>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleWorkoutComplete(workout.id)}
                                            className={`p-2 rounded-full ${workout.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-300'
                                                }`}
                                        >
                                            {workout.completed ? (
                                                <CheckCircleIcon className="h-5 w-5" />
                                            ) : (
                                                <PendingIcon className="h-5 w-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
            </div>

            {/* Empty State */}
            {filteredWorkouts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-8 text-center"
                >
                    <FireIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No workouts found</h3>
                    <p className="text-gray-400">Try adjusting your filters or create a new workout</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg shadow-lg mx-auto"
                    >
                        <span>Create Workout</span>
                    </motion.button>
                </motion.div>
            )}

            {/* Workout Modal */}
            {isWorkoutModalOpen && selectedWorkout && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setIsWorkoutModalOpen(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-gray-900/90 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-gray-700/30 w-full max-w-4xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-64">
                            <img
                                src={selectedWorkout.image}
                                alt={selectedWorkout.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                            <div className="absolute top-4 right-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsWorkoutModalOpen(false)}
                                    className="p-2 rounded-full bg-black/50 text-white"
                                >
                                    <XCircleIcon className="h-6 w-6" />
                                </motion.button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                                <h2 className="text-2xl font-bold text-white">{selectedWorkout.title}</h2>
                                <div className="flex items-center mt-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[selectedWorkout.difficulty]
                                        }`}>
                                        {selectedWorkout.difficulty}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${categoryColors[selectedWorkout.category]
                                        }`}>
                                        {selectedWorkout.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                    <p className="text-gray-300">{selectedWorkout.description}</p>

                                    <h3 className="text-lg font-semibold text-white mt-6 mb-2">Workout Stats</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900/80 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">Heart Rate</p>
                                                <HeartIcon className="h-5 w-5 text-red-400" />
                                            </div>
                                            <p className="text-2xl font-bold text-white mt-1">{selectedWorkout.stats.heartRate} BPM</p>
                                        </div>
                                        <div className="bg-gray-900/80 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">Steps</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-white mt-1">{selectedWorkout.stats.steps}</p>
                                        </div>
                                        <div className="bg-gray-900/80 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">Distance</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                                </svg>
                                            </div>
                                            <p className="text-2xl font-bold text-white mt-1">{selectedWorkout.stats.distance} km</p>
                                        </div>
                                        <div className="bg-gray-900/80 rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-400">Calories</p>
                                                <FireIcon className="h-5 w-5 text-orange-400" />
                                            </div>
                                            <p className="text-2xl font-bold text-white mt-1">{selectedWorkout.calories}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="bg-gray-900/80 rounded-lg p-4 mb-4">
                                        <h3 className="text-lg font-semibold text-white mb-4">Workout Timer</h3>
                                        <div className="text-center">
                                            <p className="text-4xl font-bold text-white mb-4">{formatTime(currentTime)}</p>
                                            <div className="flex justify-center space-x-2">
                                                {isPlaying ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={pauseWorkoutTimer}
                                                        className="p-3 rounded-full bg-red-500 text-white"
                                                    >
                                                        <PauseIcon className="h-6 w-6" />
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={startWorkoutTimer}
                                                        className="p-3 rounded-full bg-green-500 text-white"
                                                    >
                                                        <PlayIcon className="h-6 w-6" />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setCurrentTime(0)}
                                                    className="p-3 rounded-full bg-gray-600 text-white"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg shadow-lg"
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        <span>Complete Workout</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
} 