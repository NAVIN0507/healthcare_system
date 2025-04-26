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
    StarIcon,
    PlusIcon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    ShoppingCartIcon,
    ScissorsIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Exercise {
    name: string;
    sets: number;
    reps: string;
    rest: string;
}

interface WorkoutStats {
    heartRate: number;
    steps: number;
    distance: number;
    calories: number;
}

interface Workout {
    _id?: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    duration: string;
    frequency: string;
    category: string;
    exercises: Exercise[];
    color?: string;
    completed?: boolean;
    date?: Date;
    image?: string;
    stats?: WorkoutStats;
    calories?: number;
}

interface MealPrepStep {
    step: string;
    duration: string;
    tasks: string[];
    tips: string;
    icon: string;
}

interface MealPreparation {
    _id: string;
    title: string;
    description: string;
    totalTime: string;
    scheduledDate: string;
    steps: MealPrepStep[];
    status: 'planned' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}

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

// Meal schedule
const mealSchedule = [
    {
        time: '7:00 AM',
        meal: 'Breakfast',
        calories: 450,
        protein: 25,
        carbs: 55,
        fat: 15,
        details: 'Oatmeal with berries, banana, and protein shake'
    },
    {
        time: '10:00 AM',
        meal: 'Morning Snack',
        calories: 200,
        protein: 12,
        carbs: 25,
        fat: 8,
        details: 'Greek yogurt with almonds'
    },
    {
        time: '1:00 PM',
        meal: 'Lunch',
        calories: 650,
        protein: 40,
        carbs: 70,
        fat: 22,
        details: 'Grilled chicken salad with quinoa'
    },
    {
        time: '4:00 PM',
        meal: 'Pre-Workout',
        calories: 250,
        protein: 15,
        carbs: 35,
        fat: 6,
        details: 'Banana and protein bar'
    },
    {
        time: '7:00 PM',
        meal: 'Dinner',
        calories: 550,
        protein: 35,
        carbs: 45,
        fat: 20,
        details: 'Salmon with sweet potato and vegetables'
    }
];

// Meal preparation steps
const mealPreparationSteps = [
    {
        step: 'Weekly Planning',
        duration: '30 mins',
        tasks: [
            'Review meal schedule',
            'Create shopping list',
            'Check pantry inventory'
        ],
        tips: 'Plan meals that share common ingredients to reduce waste',
        icon: 'ClipboardDocumentListIcon'
    },
    {
        step: 'Grocery Shopping',
        duration: '1 hour',
        tasks: [
            'Buy fresh produce',
            'Get protein sources',
            'Stock up on staples'
        ],
        tips: 'Shop the perimeter of the store first for fresh foods',
        icon: 'ShoppingCartIcon'
    },
    {
        step: 'Prep Work',
        duration: '1.5 hours',
        tasks: [
            'Wash and cut vegetables',
            'Portion proteins',
            'Cook grains and legumes'
        ],
        tips: 'Use different colored containers for different food groups',
        icon: 'ScissorsIcon'
    },
    {
        step: 'Batch Cooking',
        duration: '2 hours',
        tasks: [
            'Cook protein sources',
            'Roast vegetables',
            'Prepare sauces'
        ],
        tips: 'Use multiple cooking methods simultaneously to save time',
        icon: 'FireIcon'
    },
    {
        step: 'Portioning',
        duration: '45 mins',
        tasks: [
            'Divide into containers',
            'Label with dates',
            'Store properly'
        ],
        tips: 'Use the FIFO method (First In, First Out) for storage',
        icon: 'ArchiveBoxIcon'
    }
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
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming', 'completed', 'favorites'
    const [searchQuery, setSearchQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [workoutTimer, setWorkoutTimer] = useState(null);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Workout>({
        title: '',
        description: '',
        difficulty: 'Beginner',
        duration: '',
        frequency: '',
        category: 'Strength',
        exercises: [{ name: '', sets: 3, reps: '', rest: '60 sec' }]
    });
    const [mealPreps, setMealPreps] = useState<MealPreparation[]>([]);
    const [showMealPrepForm, setShowMealPrepForm] = useState(false);
    const [mealPrepFormData, setMealPrepFormData] = useState({
        title: '',
        description: '',
        totalTime: '',
        scheduledDate: new Date().toISOString().split('T')[0],
        steps: [
            {
                step: '',
                duration: '',
                tasks: [''],
                tips: '',
                icon: 'ClipboardDocumentListIcon'
            }
        ],
        status: 'planned' as const
    });

    const categories = [
        { name: 'All', count: workouts.length },
        { name: 'HIIT', count: workouts.filter(w => w.category === 'HIIT').length },
        { name: 'Strength', count: workouts.filter(w => w.category === 'Strength').length },
        { name: 'Core', count: workouts.filter(w => w.category === 'Core').length },
        { name: 'Cardio', count: workouts.filter(w => w.category === 'Cardio').length },
        { name: 'Flexibility', count: workouts.filter(w => w.category === 'Flexibility').length }
    ];

    const filteredWorkouts = workouts.filter(workout => {
        const categoryMatch = selectedCategory === 'All' || workout.category === selectedCategory;
        const searchMatch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workout.description.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && searchMatch;
    });

    const upcomingWorkouts = filteredWorkouts.filter(workout => !workout.completed);
    const completedWorkouts = filteredWorkouts.filter(workout => workout.completed);

    const handleWorkoutSelect = (workout: Workout) => {
        // Add default stats if they don't exist
        const workoutWithStats = {
            ...workout,
            stats: workout.stats || {
                heartRate: 0,
                steps: 0,
                distance: 0,
                calories: workout.calories || 0
            }
        };
        setSelectedWorkout(workoutWithStats);
        setIsWorkoutModalOpen(true);
    };

    const handleWorkoutComplete = (workoutId) => {
        const updatedWorkouts = workouts.map(workout =>
            workout._id === workoutId ? { ...workout, completed: !workout.completed } : workout
        );
        // In a real app, you would update the state or make an API call here
        console.log('Workout completed:', workoutId);
    };

    const startWorkoutTimer = () => {
        setIsPlaying(true);
        const timer = setInterval(() => {
            setCurrentTime(prevTime => prevTime + 1);
        }, 1000);
        setWorkoutTimer(timer);
    };

    const pauseWorkoutTimer = () => {
        setIsPlaying(false);
        clearInterval(workoutTimer);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        return () => {
            if (workoutTimer) {
                clearInterval(workoutTimer);
            }
        };
    }, [workoutTimer]);

    const fetchWorkouts = async () => {
        try {
            const response = await fetch('/api/workouts');
            if (!response.ok) throw new Error('Failed to fetch workouts');
            const data = await response.json();
            setWorkouts(data);
        } catch (error) {
            console.error('Error fetching workouts:', error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
        setFormData(prev => {
            const newExercises = [...prev.exercises];
            newExercises[index] = {
                ...newExercises[index],
                [field]: value
            };
            return {
                ...prev,
                exercises: newExercises
            };
        });
    };

    const addExercise = () => {
        setFormData(prev => ({
            ...prev,
            exercises: [...prev.exercises, { name: '', sets: 3, reps: '', rest: '60 sec' }]
        }));
    };

    const removeExercise = (index: number) => {
        setFormData(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/workouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create workout');

            await fetchWorkouts();
            setShowForm(false);
            setFormData({
                title: '',
                description: '',
                difficulty: 'Beginner',
                duration: '',
                frequency: '',
                category: 'Strength',
                exercises: [{ name: '', sets: 3, reps: '', rest: '60 sec' }]
            });
        } catch (error) {
            console.error('Error creating workout:', error);
        }
    };

    const fetchMealPreps = async () => {
        try {
            const response = await fetch('/api/meal-prep');
            if (!response.ok) throw new Error('Failed to fetch meal preparations');
            const data = await response.json();
            setMealPreps(data);
        } catch (error) {
            console.error('Error fetching meal preparations:', error);
        }
    };

    const handleMealPrepSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/meal-prep', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mealPrepFormData)
            });

            if (!response.ok) throw new Error('Failed to create meal preparation');

            await fetchMealPreps();
            setShowMealPrepForm(false);
            setMealPrepFormData({
                title: '',
                description: '',
                totalTime: '',
                scheduledDate: new Date().toISOString().split('T')[0],
                steps: [
                    {
                        step: '',
                        duration: '',
                        tasks: [''],
                        tips: '',
                        icon: 'ClipboardDocumentListIcon'
                    }
                ],
                status: 'planned'
            });
        } catch (error) {
            console.error('Error creating meal preparation:', error);
        }
    };

    const handleStepChange = (index: number, field: keyof MealPrepStep, value: any) => {
        setMealPrepFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[index] = {
                ...newSteps[index],
                [field]: value
            };
            return {
                ...prev,
                steps: newSteps
            };
        });
    };

    const addStep = () => {
        setMealPrepFormData(prev => ({
            ...prev,
            steps: [...prev.steps, {
                step: '',
                duration: '',
                tasks: [''],
                tips: '',
                icon: 'ClipboardDocumentListIcon'
            }]
        }));
    };

    const removeStep = (index: number) => {
        setMealPrepFormData(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const addTask = (stepIndex: number) => {
        setMealPrepFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex].tasks.push('');
            return {
                ...prev,
                steps: newSteps
            };
        });
    };

    const removeTask = (stepIndex: number, taskIndex: number) => {
        setMealPrepFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex].tasks = newSteps[stepIndex].tasks.filter((_, i) => i !== taskIndex);
            return {
                ...prev,
                steps: newSteps
            };
        });
    };

    const handleTaskChange = (stepIndex: number, taskIndex: number, value: string) => {
        setMealPrepFormData(prev => {
            const newSteps = [...prev.steps];
            newSteps[stepIndex].tasks[taskIndex] = value;
            return {
                ...prev,
                steps: newSteps
            };
        });
    };

    useEffect(() => {
        fetchMealPreps();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Workouts</h1>
                    <p className="text-gray-400">Track your fitness journey and discover new exercises</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-500 text-white rounded-lg shadow-lg"
                    onClick={() => setShowForm(true)}
                >
                    <span>New Workout</span>
                </motion.button>
            </div>

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

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-500/20"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Daily Meal Schedule</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-xs text-gray-400">Protein</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span className="text-xs text-gray-400">Carbs</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-xs text-gray-400">Fat</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {mealSchedule.map((meal, index) => (
                        <div key={meal.time} className="relative">
                            {index < mealSchedule.length - 1 && (
                                <div className="absolute left-[1.65rem] top-10 w-0.5 h-16 bg-gray-700"></div>
                            )}
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-14 text-sm text-gray-400 pt-2">
                                    {meal.time}
                                </div>
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                                    <ClockIcon className="w-6 h-6 text-violet-400" />
                                </div>
                                <div className="flex-grow bg-gray-800/50 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-white font-medium">{meal.meal}</h4>
                                        <span className="text-sm text-gray-400">{meal.calories} cal</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-3">{meal.details}</p>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full"
                                                style={{ width: `${(meal.protein / (meal.protein + meal.carbs + meal.fat)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(meal.carbs / (meal.protein + meal.carbs + meal.fat)) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-amber-500 h-2 rounded-full"
                                                style={{ width: `${(meal.fat / (meal.protein + meal.carbs + meal.fat)) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                        <span>P: {meal.protein}g</span>
                                        <span>C: {meal.carbs}g</span>
                                        <span>F: {meal.fat}g</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-500/20"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Meal Preparations</h3>
                    <button
                        onClick={() => setShowMealPrepForm(true)}
                        className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors flex items-center gap-2"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Meal Prep
                    </button>
                </div>

                {mealPreps.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400">No meal preparations found. Create your first meal prep plan!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {mealPreps.map((prep) => (
                            <div key={prep._id} className="bg-gray-800/50 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="text-white font-medium">{prep.title}</h4>
                                        <p className="text-sm text-gray-400">{prep.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${prep.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                            prep.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {prep.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-sm text-violet-400">{prep.totalTime}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {prep.steps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                <FireIcon className="w-5 h-5 text-violet-400" />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-white">{step.step}</h5>
                                                    <span className="text-sm text-violet-400">{step.duration}</span>
                                                </div>
                                                <div className="mt-2 space-y-1">
                                                    {step.tasks.map((task, taskIndex) => (
                                                        <div key={taskIndex} className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                                                            <span className="text-sm text-gray-300">{task}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-amber-400 mt-2">{step.tips}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Scheduled: {new Date(prep.scheduledDate).toLocaleDateString()}</span>
                                        <span>Last updated: {new Date(prep.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showMealPrepForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Create New Meal Preparation</h2>
                                <button
                                    onClick={() => setShowMealPrepForm(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <XCircleIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleMealPrepSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={mealPrepFormData.title}
                                        onChange={(e) => setMealPrepFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <textarea
                                        value={mealPrepFormData.description}
                                        onChange={(e) => setMealPrepFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Total Time</label>
                                        <input
                                            type="text"
                                            value={mealPrepFormData.totalTime}
                                            onChange={(e) => setMealPrepFormData(prev => ({ ...prev, totalTime: e.target.value }))}
                                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
                                            placeholder="e.g., 2.5 hours"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Scheduled Date</label>
                                        <input
                                            type="date"
                                            value={mealPrepFormData.scheduledDate}
                                            onChange={(e) => setMealPrepFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                                            className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Steps</label>
                                    <div className="space-y-4">
                                        {mealPrepFormData.steps.map((step, stepIndex) => (
                                            <div key={stepIndex} className="bg-gray-800/50 rounded-lg p-4">
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={step.step}
                                                            onChange={(e) => handleStepChange(stepIndex, 'step', e.target.value)}
                                                            placeholder="Step name"
                                                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={step.duration}
                                                            onChange={(e) => handleStepChange(stepIndex, 'duration', e.target.value)}
                                                            placeholder="Duration"
                                                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {step.tasks.map((task, taskIndex) => (
                                                        <div key={taskIndex} className="flex items-center gap-2">
                                                            <input
                                                                type="text"
                                                                value={task}
                                                                onChange={(e) => handleTaskChange(stepIndex, taskIndex, e.target.value)}
                                                                placeholder="Task description"
                                                                className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2"
                                                                required
                                                            />
                                                            {step.tasks.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTask(stepIndex, taskIndex)}
                                                                    className="text-red-400 hover:text-red-300"
                                                                >
                                                                    <XCircleIcon className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addTask(stepIndex)}
                                                        className="text-sm text-violet-400 hover:text-violet-300"
                                                    >
                                                        + Add Task
                                                    </button>
                                                </div>

                                                <div className="mt-4">
                                                    <input
                                                        type="text"
                                                        value={step.tips}
                                                        onChange={(e) => handleStepChange(stepIndex, 'tips', e.target.value)}
                                                        placeholder="Tips"
                                                        className="w-full bg-gray-700 text-white rounded-lg px-4 py-2"
                                                        required
                                                    />
                                                </div>

                                                {mealPrepFormData.steps.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStep(stepIndex)}
                                                        className="mt-4 text-red-400 hover:text-red-300"
                                                    >
                                                        Remove Step
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addStep}
                                        className="mt-4 text-violet-400 hover:text-violet-300"
                                    >
                                        + Add Step
                                    </button>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowMealPrepForm(false)}
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600"
                                    >
                                        Create Meal Prep
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(activeTab === 'upcoming' ? upcomingWorkouts :
                    activeTab === 'completed' ? completedWorkouts :
                        filteredWorkouts).map((workout) => (
                            <motion.div
                                key={workout._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
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
                                            <span>{workout.date ? format(new Date(workout.date), 'MMM d, yyyy') : 'No date set'}</span>
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
                                            onClick={() => handleWorkoutComplete(workout._id)}
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
                        onClick={() => setShowForm(true)}
                    >
                        <span>Create Workout</span>
                    </motion.button>
                </motion.div>
            )}

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Create New Workout</h2>
                            <button
                                onClick={() => setShowForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Difficulty
                                        </label>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="HIIT">HIIT</option>
                                            <option value="Strength">Strength</option>
                                            <option value="Core">Core</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Flexibility">Flexibility</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Duration (e.g., "45 min")
                                        </label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Frequency (e.g., "3x per week")
                                        </label>
                                        <input
                                            type="text"
                                            name="frequency"
                                            value={formData.frequency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exercises
                                    </label>
                                    {formData.exercises.map((exercise, index) => (
                                        <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Exercise name"
                                                value={exercise.name}
                                                onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                                                className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="Sets x Reps"
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                                                className="px-3 py-2 border border-gray-300 rounded-lg"
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Rest"
                                                    value={exercise.rest}
                                                    onChange={(e) => handleExerciseChange(index, 'rest', e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                    required
                                                />
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExercise(index)}
                                                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addExercise}
                                        className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                    >
                                        Add Exercise
                                    </button>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        Create Workout
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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