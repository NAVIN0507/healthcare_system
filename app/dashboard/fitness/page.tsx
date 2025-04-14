'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FireIcon,
    BoltIcon,
    HeartIcon,
    ChartBarIcon,
    CalendarIcon,
    ClockIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    StarIcon,
    TrophyIcon,
    UserGroupIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    FireIcon as FireSolidIcon,
    BoltIcon as BoltSolidIcon,
    HeartIcon as HeartSolidIcon,
    ChartBarIcon as ChartBarSolidIcon,
    CalendarIcon as CalendarSolidIcon,
    ClockIcon as ClockSolidIcon,
    ArrowTrendingUpIcon as ArrowTrendingUpSolidIcon,
    ArrowTrendingDownIcon as ArrowTrendingDownSolidIcon,
    StarIcon as StarSolidIcon,
    TrophyIcon as TrophySolidIcon,
    UserGroupIcon as UserGroupSolidIcon,
    SparklesIcon as SparklesSolidIcon
} from '@heroicons/react/24/solid';

// Types
type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type Workout = {
    id: string;
    name: string;
    type: WorkoutType;
    difficulty: Difficulty;
    duration: number; // in minutes
    calories: number;
    description: string;
    exercises: Exercise[];
    image: string;
    isFavorite: boolean;
    completedCount: number;
    lastCompleted?: string;
};

type Exercise = {
    id: string;
    name: string;
    sets: number;
    reps: string;
    rest: number; // in seconds
    notes?: string;
};

type FitnessStats = {
    totalWorkouts: number;
    totalMinutes: number;
    totalCalories: number;
    streakDays: number;
    favoriteWorkout: string;
    lastWorkout: string;
};

// Exercise categories
const categories = [
    { id: 'cardio', name: 'Cardio', icon: HeartIcon, color: 'text-red-500' },
    { id: 'strength', name: 'Strength Training', icon: BoltIcon, color: 'text-blue-500' },
    { id: 'flexibility', name: 'Flexibility', icon: ArrowTrendingUpSolidIcon, color: 'text-green-500' },
    { id: 'hiit', name: 'HIIT', icon: FireIcon, color: 'text-orange-500' },
];

// Sample exercises data
const exercises = {
    cardio: [
        {
            id: 'running',
            name: 'Running',
            duration: '30 min',
            calories: 300,
            difficulty: 'Medium',
            description: 'A great cardiovascular exercise that improves endurance and burns calories.',
            equipment: 'None',
            targetMuscles: ['Legs', 'Core', 'Cardiovascular System'],
            instructions: [
                'Start with a 5-minute warm-up walk',
                'Maintain a steady pace for 20 minutes',
                'Cool down with a 5-minute walk'
            ]
        },
        {
            id: 'cycling',
            name: 'Cycling',
            duration: '45 min',
            calories: 400,
            difficulty: 'Low',
            description: 'Low-impact cardio that strengthens legs and improves cardiovascular health.',
            equipment: 'Bicycle or Stationary Bike',
            targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Glutes'],
            instructions: [
                'Adjust seat height to proper position',
                'Start with a 5-minute warm-up at low resistance',
                'Maintain a steady pace for 30 minutes',
                'Cool down with 5-10 minutes of easy pedaling'
            ]
        },
        {
            id: 'jumping-rope',
            name: 'Jumping Rope',
            duration: '15 min',
            calories: 200,
            difficulty: 'Medium',
            description: 'An efficient full-body workout that improves coordination and burns calories quickly.',
            equipment: 'Jump Rope',
            targetMuscles: ['Calves', 'Shoulders', 'Core'],
            instructions: [
                'Start with basic jumps for 2 minutes',
                'Alternate between different jump patterns',
                'Rest for 30 seconds between sets'
            ]
        },
        {
            id: 'swimming',
            name: 'Swimming',
            duration: '45 min',
            calories: 350,
            difficulty: 'Medium',
            description: "A full-body workout that's easy on joints and improves cardiovascular fitness.",
            equipment: 'Swimsuit, Goggles',
            targetMuscles: ['Full Body', 'Shoulders', 'Back', 'Legs'],
            instructions: [
                'Start with a 5-minute warm-up',
                'Practice different strokes (freestyle, breaststroke, backstroke)',
                'Include intervals of different intensities',
                'Cool down with easy swimming'
            ]
        },
        {
            id: 'rowing',
            name: 'Rowing',
            duration: '30 min',
            calories: 300,
            difficulty: 'Medium',
            description: 'A low-impact, full-body workout that builds strength and endurance.',
            equipment: 'Rowing Machine',
            targetMuscles: ['Back', 'Shoulders', 'Legs', 'Core'],
            instructions: [
                'Start with proper form: legs, back, arms sequence',
                'Maintain a steady pace for 20 minutes',
                'Include intervals of higher intensity',
                'Cool down with easy rowing'
            ]
        }
    ],
    strength: [
        {
            id: 'push-ups',
            name: 'Push-ups',
            duration: '10 min',
            calories: 100,
            difficulty: 'Medium',
            description: 'A classic bodyweight exercise that builds upper body strength.',
            equipment: 'None',
            targetMuscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
            instructions: [
                'Start in a plank position with hands slightly wider than shoulders',
                'Lower your body until your chest nearly touches the floor',
                'Push back up to the starting position',
                'Keep your core tight throughout the movement'
            ]
        },
        {
            id: 'squats',
            name: 'Squats',
            duration: '10 min',
            calories: 120,
            difficulty: 'Low',
            description: 'A fundamental lower body exercise that builds leg strength and stability.',
            equipment: 'None (or weights for progression)',
            targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Core'],
            instructions: [
                'Stand with feet shoulder-width apart',
                'Lower your body by bending your knees and hips',
                'Keep your chest up and back straight',
                'Return to the starting position'
            ]
        },
        {
            id: 'deadlift',
            name: 'Deadlift',
            duration: '15 min',
            calories: 150,
            difficulty: 'High',
            description: 'A compound exercise that targets multiple muscle groups and builds overall strength.',
            equipment: 'Barbell, Weight Plates',
            targetMuscles: ['Lower Back', 'Hamstrings', 'Glutes', 'Upper Back'],
            instructions: [
                'Stand with feet hip-width apart, barbell in front of you',
                'Bend at the hips and knees to grip the bar',
                'Keep your back straight and chest up',
                'Lift the bar by extending your hips and knees',
                'Lower the bar with control'
            ]
        },
        {
            id: 'bench-press',
            name: 'Bench Press',
            duration: '15 min',
            calories: 130,
            difficulty: 'High',
            description: 'A classic upper body exercise that builds chest and shoulder strength.',
            equipment: 'Bench, Barbell, Weight Plates',
            targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
            instructions: [
                'Lie on the bench with feet flat on the ground',
                'Grip the bar slightly wider than shoulder width',
                'Lower the bar to your chest with control',
                'Press the bar back up to the starting position'
            ]
        },
        {
            id: 'pull-ups',
            name: 'Pull-ups',
            duration: '10 min',
            calories: '100',
            difficulty: 'High',
            description: 'An advanced upper body exercise that builds back and arm strength.',
            equipment: 'Pull-up Bar',
            targetMuscles: ['Back', 'Biceps', 'Shoulders', 'Core'],
            instructions: [
                'Hang from the bar with hands slightly wider than shoulders',
                'Pull your body up until your chin clears the bar',
                'Lower yourself with control',
                'Keep your core engaged throughout'
            ]
        }
    ],
    flexibility: [
        {
            id: 'yoga',
            name: 'Yoga',
            duration: '30 min',
            calories: 150,
            difficulty: 'Low',
            description: 'A practice that combines physical postures, breathing techniques, and meditation.',
            equipment: 'Yoga Mat',
            targetMuscles: ['Full Body', 'Core', 'Balance'],
            instructions: [
                'Start with basic poses like Mountain Pose and Downward Dog',
                'Flow through a sequence of poses',
                'Focus on your breath throughout the practice',
                'End with a relaxation pose like Corpse Pose'
            ]
        },
        {
            id: 'stretching',
            name: 'Dynamic Stretching',
            duration: '15 min',
            calories: 80,
            difficulty: 'Low',
            description: 'Active movements that prepare your body for exercise and improve range of motion.',
            equipment: 'None',
            targetMuscles: ['Full Body', 'Joints'],
            instructions: [
                'Start with gentle movements like arm circles and leg swings',
                'Progress to more dynamic stretches',
                'Keep movements controlled and smooth',
                'Focus on major muscle groups'
            ]
        },
        {
            id: 'pilates',
            name: 'Pilates',
            duration: '45 min',
            calories: 200,
            difficulty: 'Medium',
            description: 'A low-impact exercise that strengthens core muscles and improves flexibility.',
            equipment: 'Mat (optional equipment available)',
            targetMuscles: ['Core', 'Back', 'Hips', 'Shoulders'],
            instructions: [
                'Focus on controlled, precise movements',
                'Engage your core throughout each exercise',
                'Breathe deeply and rhythmically',
                'Start with basic exercises and progress to more challenging ones'
            ]
        },
        {
            id: 'mobility-work',
            name: 'Mobility Work',
            duration: '20 min',
            calories: 100,
            difficulty: 'Low',
            description: 'Exercises that improve joint range of motion and movement patterns.',
            equipment: 'Foam Roller, Mobility Bands',
            targetMuscles: ['Joints', 'Connective Tissue', 'Muscles'],
            instructions: [
                'Start with foam rolling to release tension',
                'Perform joint circles and rotations',
                'Include dynamic stretches',
                'Focus on problem areas'
            ]
        },
        {
            id: 'tai-chi',
            name: 'Tai Chi',
            duration: '30 min',
            calories: 120,
            difficulty: 'Low',
            description: 'A gentle form of exercise that combines movement, breathing, and meditation.',
            equipment: 'None',
            targetMuscles: ['Full Body', 'Balance', 'Core'],
            instructions: [
                'Start with basic movements and stances',
                'Focus on slow, controlled movements',
                'Coordinate breathing with movements',
                'Practice regularly for best results'
            ]
        }
    ],
    hiit: [
        {
            id: 'burpees',
            name: 'Burpees',
            duration: '10 min',
            calories: 150,
            difficulty: 'High',
            description: 'A full-body exercise that combines strength and cardio in one movement.',
            equipment: 'None',
            targetMuscles: ['Full Body', 'Cardiovascular System'],
            instructions: [
                'Start in a standing position',
                'Drop into a squat position with hands on the ground',
                'Kick your feet back into a plank position',
                'Perform a push-up',
                'Jump your feet back to the squat position',
                'Jump up from the squatting position'
            ]
        },
        {
            id: 'mountain-climbers',
            name: 'Mountain Climbers',
            duration: '10 min',
            calories: 120,
            difficulty: 'Medium',
            description: 'A dynamic exercise that targets the core and improves cardiovascular fitness.',
            equipment: 'None',
            targetMuscles: ['Core', 'Shoulders', 'Hip Flexors', 'Cardiovascular System'],
            instructions: [
                'Start in a plank position',
                'Drive one knee toward your chest',
                'Quickly switch legs, alternating in a running motion',
                'Keep your core tight and hips level throughout'
            ]
        },
        {
            id: 'jumping-jacks',
            name: 'Jumping Jacks',
            duration: '5 min',
            calories: 100,
            difficulty: 'Low',
            description: 'A simple but effective cardio exercise that gets your heart rate up quickly.',
            equipment: 'None',
            targetMuscles: ['Full Body', 'Cardiovascular System'],
            instructions: [
                'Stand with feet together and arms at your sides',
                'Jump and spread your legs while raising your arms above your head',
                'Jump back to the starting position',
                'Repeat at a quick pace'
            ]
        },
        {
            id: 'box-jumps',
            name: 'Box Jumps',
            duration: '10 min',
            calories: 130,
            difficulty: 'High',
            description: 'A plyometric exercise that builds power and explosiveness.',
            equipment: 'Plyometric Box or Stable Platform',
            targetMuscles: ['Legs', 'Glutes', 'Core', 'Cardiovascular System'],
            instructions: [
                'Stand in front of the box with feet shoulder-width apart',
                'Squat down and swing your arms back',
                'Explosively jump onto the box, landing softly',
                'Step down and repeat'
            ]
        },
        {
            id: 'kettlebell-swings',
            name: 'Kettlebell Swings',
            duration: '15 min',
            calories: 140,
            difficulty: 'Medium',
            description: 'A dynamic full-body exercise that builds power and endurance.',
            equipment: 'Kettlebell',
            targetMuscles: ['Hips', 'Glutes', 'Back', 'Shoulders', 'Core'],
            instructions: [
                'Stand with feet shoulder-width apart, kettlebell between your feet',
                'Hinge at the hips and grab the kettlebell with both hands',
                'Drive your hips forward to swing the kettlebell up to shoulder height',
                'Let the kettlebell swing back down between your legs',
                'Repeat the movement'
            ]
        }
    ]
};

// Sample data
const sampleWorkouts: Workout[] = [
    {
        id: '1',
        name: 'Full Body Power',
        type: 'strength',
        difficulty: 'intermediate',
        duration: 45,
        calories: 320,
        description: 'A comprehensive full-body workout targeting all major muscle groups with compound movements.',
        exercises: [
            { id: '1-1', name: 'Barbell Squats', sets: 4, reps: '8-10', rest: 90 },
            { id: '1-2', name: 'Deadlifts', sets: 4, reps: '6-8', rest: 120 },
            { id: '1-3', name: 'Bench Press', sets: 3, reps: '8-12', rest: 90 },
            { id: '1-4', name: 'Pull-ups', sets: 3, reps: '8-12', rest: 90 },
            { id: '1-5', name: 'Shoulder Press', sets: 3, reps: '10-12', rest: 60 }
        ],
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        isFavorite: true,
        completedCount: 12,
        lastCompleted: '2023-06-15'
    },
    {
        id: '2',
        name: 'HIIT Blast',
        type: 'hiit',
        difficulty: 'advanced',
        duration: 30,
        calories: 400,
        description: 'High-intensity interval training to maximize calorie burn and improve cardiovascular fitness.',
        exercises: [
            { id: '2-1', name: 'Burpees', sets: 4, reps: '15', rest: 30 },
            { id: '2-2', name: 'Mountain Climbers', sets: 4, reps: '20', rest: 30 },
            { id: '2-3', name: 'Jump Squats', sets: 4, reps: '15', rest: 30 },
            { id: '2-4', name: 'Plank to Downward Dog', sets: 4, reps: '10', rest: 30 },
            { id: '2-5', name: 'Jump Rope', sets: 4, reps: '60 seconds', rest: 30 }
        ],
        image: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
        isFavorite: false,
        completedCount: 8,
        lastCompleted: '2023-06-10'
    },
    {
        id: '3',
        name: 'Yoga Flow',
        type: 'yoga',
        difficulty: 'beginner',
        duration: 60,
        calories: 180,
        description: 'A gentle yoga flow to improve flexibility, balance, and mental well-being.',
        exercises: [
            { id: '3-1', name: 'Sun Salutation A', sets: 3, reps: '1 flow', rest: 0 },
            { id: '3-2', name: 'Warrior Poses', sets: 2, reps: '30 seconds each side', rest: 30 },
            { id: '3-3', name: 'Tree Pose', sets: 2, reps: '30 seconds each side', rest: 30 },
            { id: '3-4', name: 'Downward Dog', sets: 3, reps: '30 seconds', rest: 30 },
            { id: '3-5', name: 'Child\'s Pose', sets: 1, reps: '1 minute', rest: 0 }
        ],
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1520&q=80',
        isFavorite: true,
        completedCount: 15,
        lastCompleted: '2023-06-12'
    },
    {
        id: '4',
        name: 'Cardio Endurance',
        type: 'cardio',
        difficulty: 'intermediate',
        duration: 40,
        calories: 350,
        description: 'A cardio-focused workout to improve endurance and heart health.',
        exercises: [
            { id: '4-1', name: 'Treadmill Run', sets: 1, reps: '20 minutes', rest: 0 },
            { id: '4-2', name: 'Jump Rope', sets: 3, reps: '2 minutes', rest: 60 },
            { id: '4-3', name: 'High Knees', sets: 3, reps: '1 minute', rest: 30 },
            { id: '4-4', name: 'Jumping Jacks', sets: 3, reps: '1 minute', rest: 30 },
            { id: '4-5', name: 'Cool Down Walk', sets: 1, reps: '5 minutes', rest: 0 }
        ],
        image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
        isFavorite: false,
        completedCount: 6,
        lastCompleted: '2023-06-08'
    },
    {
        id: '5',
        name: 'Core Crusher',
        type: 'strength',
        difficulty: 'advanced',
        duration: 25,
        calories: 200,
        description: 'Target your core muscles with this intense ab workout.',
        exercises: [
            { id: '5-1', name: 'Plank', sets: 3, reps: '60 seconds', rest: 30 },
            { id: '5-2', name: 'Russian Twists', sets: 3, reps: '20 each side', rest: 30 },
            { id: '5-3', name: 'Leg Raises', sets: 3, reps: '15', rest: 30 },
            { id: '5-4', name: 'Crunches', sets: 3, reps: '20', rest: 30 },
            { id: '5-5', name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest: 30 }
        ],
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        isFavorite: false,
        completedCount: 4,
        lastCompleted: '2023-06-05'
    }
];

const sampleStats: FitnessStats = {
    totalWorkouts: 45,
    totalMinutes: 1875,
    totalCalories: 15200,
    streakDays: 7,
    favoriteWorkout: 'Full Body Power',
    lastWorkout: '2023-06-15'
};

export default function FitnessPage() {
    const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
    const [stats, setStats] = useState<FitnessStats>(sampleStats);
    const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
    const [showWorkoutModal, setShowWorkoutModal] = useState(false);
    const [showNewWorkoutModal, setShowNewWorkoutModal] = useState(false);
    const [filter, setFilter] = useState<WorkoutType | 'all'>('all');
    const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'workouts' | 'progress' | 'community'>('workouts');
    const [isLoading, setIsLoading] = useState(false);

    // Filter workouts based on search, type, and difficulty
    const filteredWorkouts = workouts.filter(workout => {
        const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filter === 'all' || workout.type === filter;
        const matchesDifficulty = difficulty === 'all' || workout.difficulty === difficulty;
        return matchesSearch && matchesType && matchesDifficulty;
    });

    // Handle workout selection
    const handleWorkoutSelect = (workout: Workout) => {
        setSelectedWorkout(workout);
        setShowWorkoutModal(true);
    };

    // Handle workout completion
    const handleWorkoutComplete = (workoutId: string) => {
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setWorkouts(prevWorkouts =>
                prevWorkouts.map(workout =>
                    workout.id === workoutId
                        ? {
                            ...workout,
                            completedCount: workout.completedCount + 1,
                            lastCompleted: new Date().toISOString().split('T')[0]
                        }
                        : workout
                )
            );

            // Update stats
            const completedWorkout = workouts.find(w => w.id === workoutId);
            if (completedWorkout) {
                setStats(prevStats => ({
                    ...prevStats,
                    totalWorkouts: prevStats.totalWorkouts + 1,
                    totalMinutes: prevStats.totalMinutes + completedWorkout.duration,
                    totalCalories: prevStats.totalCalories + completedWorkout.calories,
                    lastWorkout: completedWorkout.name
                }));
            }

            setIsLoading(false);
            setShowWorkoutModal(false);
        }, 1000);
    };

    // Toggle favorite status
    const toggleFavorite = (workoutId: string) => {
        setWorkouts(prevWorkouts =>
            prevWorkouts.map(workout =>
                workout.id === workoutId
                    ? { ...workout, isFavorite: !workout.isFavorite }
                    : workout
            )
        );
    };

    // Get icon for workout type
    const getWorkoutTypeIcon = (type: WorkoutType) => {
        switch (type) {
            case 'strength':
                return <FireIcon className="h-5 w-5" />;
            case 'cardio':
                return <HeartIcon className="h-5 w-5" />;
            case 'flexibility':
                return <SparklesIcon className="h-5 w-5" />;
            case 'hiit':
                return <BoltIcon className="h-5 w-5" />;
            case 'yoga':
                return <SparklesIcon className="h-5 w-5" />;
            default:
                return <FireIcon className="h-5 w-5" />;
        }
    };

    // Get color for workout type
    const getWorkoutTypeColor = (type: WorkoutType) => {
        switch (type) {
            case 'strength':
                return 'bg-red-100 text-red-800';
            case 'cardio':
                return 'bg-blue-100 text-blue-800';
            case 'flexibility':
                return 'bg-purple-100 text-purple-800';
            case 'hiit':
                return 'bg-yellow-100 text-yellow-800';
            case 'yoga':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Get color for difficulty
    const getDifficultyColor = (difficulty: Difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-gray-900">Fitness</h1>
                <p className="text-gray-600 mt-1">Track your workouts, monitor progress, and achieve your fitness goals</p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Workouts</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</h3>
                        </div>
                        <div className="bg-primary-100 p-3 rounded-full">
                            <FireIcon className="h-6 w-6 text-primary-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span>+12% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Minutes Active</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalMinutes}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span>+8% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Calories Burned</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalCalories}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <BoltIcon className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span>+15% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Current Streak</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.streakDays} days</h3>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                            <TrophyIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span>Personal best: 14 days</span>
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex border-b border-gray-200 mb-6"
            >
                <button
                    onClick={() => setActiveTab('workouts')}
                    className={`py-3 px-4 font-medium text-sm ${activeTab === 'workouts'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Workouts
                </button>
                <button
                    onClick={() => setActiveTab('progress')}
                    className={`py-3 px-4 font-medium text-sm ${activeTab === 'progress'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Progress
                </button>
                <button
                    onClick={() => setActiveTab('community')}
                    className={`py-3 px-4 font-medium text-sm ${activeTab === 'community'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Community
                </button>
            </motion.div>

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex flex-wrap gap-2">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value as WorkoutType | 'all')}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Types</option>
                                <option value="strength">Strength</option>
                                <option value="cardio">Cardio</option>
                                <option value="flexibility">Flexibility</option>
                                <option value="hiit">HIIT</option>
                                <option value="yoga">Yoga</option>
                            </select>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Difficulties</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search workouts..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-64"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNewWorkoutModal(true)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors"
                            >
                                <PlusIcon className="h-5 w-5" />
                                <span>New Workout</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Workout Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredWorkouts.map((workout, index) => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="relative h-48">
                                    <img
                                        src={workout.image}
                                        alt={workout.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => toggleFavorite(workout.id)}
                                            className="bg-white p-2 rounded-full shadow-md"
                                        >
                                            {workout.isFavorite ? (
                                                <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                                            ) : (
                                                <StarIcon className="h-5 w-5 text-gray-400" />
                                            )}
                                        </motion.button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h3 className="text-white font-bold text-lg">{workout.name}</h3>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkoutTypeColor(workout.type)}`}>
                                                {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(workout.difficulty)}`}>
                                                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <ClockIcon className="h-4 w-4 mr-1" />
                                            <span>{workout.duration} min</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{workout.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FireIcon className="h-4 w-4 mr-1" />
                                            <span>{workout.calories} cal</span>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleWorkoutSelect(workout)}
                                            className="text-primary-600 font-medium text-sm flex items-center"
                                        >
                                            Start Workout
                                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Your Fitness Progress</h2>
                    <p className="text-gray-600 mb-6">Track your fitness journey and see your improvements over time.</p>

                    {/* Placeholder for charts */}
                    <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Fitness progress charts will be displayed here</p>
                    </div>
                </motion.div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Fitness Community</h2>
                    <p className="text-gray-600 mb-6">Connect with others, share your progress, and get motivated.</p>

                    {/* Placeholder for community content */}
                    <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Community features will be displayed here</p>
                    </div>
                </motion.div>
            )}

            {/* Workout Detail Modal */}
            <AnimatePresence>
                {showWorkoutModal && selectedWorkout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowWorkoutModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative h-64">
                                <img
                                    src={selectedWorkout.image}
                                    alt={selectedWorkout.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setShowWorkoutModal(false)}
                                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
                                >
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedWorkout.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkoutTypeColor(selectedWorkout.type)}`}>
                                            {selectedWorkout.type.charAt(0).toUpperCase() + selectedWorkout.type.slice(1)}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedWorkout.difficulty)}`}>
                                            {selectedWorkout.difficulty.charAt(0).toUpperCase() + selectedWorkout.difficulty.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-6">{selectedWorkout.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <ClockIcon className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm text-gray-500">Duration</span>
                                        </div>
                                        <p className="text-lg font-semibold">{selectedWorkout.duration} minutes</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FireIcon className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm text-gray-500">Calories</span>
                                        </div>
                                        <p className="text-lg font-semibold">{selectedWorkout.calories} cal</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TrophyIcon className="h-5 w-5 text-gray-500" />
                                            <span className="text-sm text-gray-500">Completed</span>
                                        </div>
                                        <p className="text-lg font-semibold">{selectedWorkout.completedCount} times</p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-4">Exercises</h3>
                                <div className="space-y-4">
                                    {selectedWorkout.exercises.map((exercise, index) => (
                                        <div key={exercise.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium">{index + 1}. {exercise.name}</h4>
                                                <span className="text-sm text-gray-500">{exercise.sets} sets × {exercise.reps}</span>
                                            </div>
                                            {exercise.notes && (
                                                <p className="text-sm text-gray-600">{exercise.notes}</p>
                                            )}
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                <span>Rest: {exercise.rest} seconds</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleWorkoutComplete(selectedWorkout.id)}
                                        disabled={isLoading}
                                        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-700 transition-colors disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Completing...
                                            </>
                                        ) : (
                                            <>
                                                <FireIcon className="h-5 w-5" />
                                                Complete Workout
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Workout Modal */}
            <AnimatePresence>
                {showNewWorkoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewWorkoutModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900">Create New Workout</h2>
                                    <button
                                        onClick={() => setShowNewWorkoutModal(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-6">Create a custom workout to track your fitness journey.</p>

                                {/* Placeholder for new workout form */}
                                <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Workout creation form will be displayed here</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 