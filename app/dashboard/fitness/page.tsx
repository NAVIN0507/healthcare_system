'use client';

import { useState } from 'react';
import {
    FireIcon,
    BoltIcon,
    HeartIcon,
    ArrowPathIcon,
    ChevronRightIcon,
    StarIcon,
    ClockIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

// Exercise categories
const categories = [
    { id: 'cardio', name: 'Cardio', icon: HeartIcon, color: 'text-red-500' },
    { id: 'strength', name: 'Strength Training', icon: BoltIcon, color: 'text-blue-500' },
    { id: 'flexibility', name: 'Flexibility', icon: ArrowPathIcon, color: 'text-green-500' },
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

export default function FitnessPage() {
    const [selectedCategory, setSelectedCategory] = useState('cardio');
    const [selectedExercise, setSelectedExercise] = useState(null);

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedExercise(null);
    };

    const handleExerciseSelect = (exercise) => {
        setSelectedExercise(exercise);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Fitness Exercises</h1>
                <p className="mt-1 text-sm text-gray-500">
                    Browse and select exercises to add to your workout routine
                </p>
            </div>

            {/* Categories */}
            <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Exercise Categories</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`flex items-center p-4 rounded-lg border ${selectedCategory === category.id
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-primary-300'
                                    }`}
                            >
                                <Icon className={`h-6 w-6 ${category.color} mr-3`} />
                                <span className="font-medium text-gray-900">{category.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Exercise List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Exercise List */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Available Exercises</h2>
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {exercises[selectedCategory].map((exercise) => (
                                <li
                                    key={exercise.id}
                                    className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedExercise?.id === exercise.id ? 'bg-primary-50' : ''
                                        }`}
                                    onClick={() => handleExerciseSelect(exercise)}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">{exercise.name}</h3>
                                            <div className="mt-1 flex items-center text-xs text-gray-500">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                <span>{exercise.duration}</span>
                                                <span className="mx-2">•</span>
                                                <FireIcon className="h-4 w-4 mr-1" />
                                                <span>{exercise.calories} cal</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${exercise.difficulty === 'Low' ? 'bg-green-100 text-green-800' :
                                                exercise.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {exercise.difficulty}
                                            </span>
                                            <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-2" />
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Exercise Details */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Exercise Details</h2>
                    {selectedExercise ? (
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedExercise.name}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedExercise.difficulty === 'Low' ? 'bg-green-100 text-green-800' :
                                        selectedExercise.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedExercise.difficulty}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
                                        <span>{selectedExercise.duration}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FireIcon className="h-5 w-5 mr-1 text-gray-400" />
                                        <span>{selectedExercise.calories} calories</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <ChartBarIcon className="h-5 w-5 mr-1 text-gray-400" />
                                        <span>{selectedExercise.equipment}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900">Description</h4>
                                    <p className="mt-1 text-sm text-gray-500">{selectedExercise.description}</p>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900">Target Muscles</h4>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedExercise.targetMuscles.map((muscle, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {muscle}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-medium text-gray-900">Instructions</h4>
                                    <ol className="mt-2 text-sm text-gray-500 list-decimal pl-5 space-y-1">
                                        {selectedExercise.instructions.map((instruction, index) => (
                                            <li key={index}>{instruction}</li>
                                        ))}
                                    </ol>
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Add to Workout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-full">
                            <div className="text-center">
                                <StarIcon className="h-12 w-12 text-gray-300 mx-auto" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No exercise selected</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Select an exercise from the list to view details
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 