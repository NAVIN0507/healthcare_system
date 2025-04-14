'use client';

import { useState } from 'react';
import {
    CalendarIcon,
    ClockIcon,
    PlusIcon,
    TrashIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

type Meal = {
    id: string;
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string[];
    completed: boolean;
};

type DayPlan = {
    date: string;
    meals: Meal[];
};

export default function MealPrepPage() {
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [newMeal, setNewMeal] = useState<Partial<Meal>>({
        name: '',
        time: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        ingredients: [],
        instructions: [],
        completed: false
    });

    // Sample meal plans data
    const [mealPlans, setMealPlans] = useState<DayPlan[]>([
        {
            date: new Date().toISOString().split('T')[0],
            meals: [
                {
                    id: '1',
                    name: 'Breakfast Bowl',
                    time: '08:00',
                    calories: 450,
                    protein: 25,
                    carbs: 45,
                    fat: 15,
                    ingredients: [
                        'Oatmeal',
                        'Banana',
                        'Almonds',
                        'Honey',
                        'Greek yogurt'
                    ],
                    instructions: [
                        'Cook oatmeal with water',
                        'Top with sliced banana',
                        'Add almonds and honey',
                        'Serve with Greek yogurt'
                    ],
                    completed: false
                },
                {
                    id: '2',
                    name: 'Grilled Chicken Salad',
                    time: '12:30',
                    calories: 550,
                    protein: 35,
                    carbs: 25,
                    fat: 20,
                    ingredients: [
                        'Chicken breast',
                        'Mixed greens',
                        'Cherry tomatoes',
                        'Cucumber',
                        'Olive oil',
                        'Balsamic vinegar'
                    ],
                    instructions: [
                        'Grill chicken breast',
                        'Chop vegetables',
                        'Mix greens and vegetables',
                        'Slice chicken and add to salad',
                        'Drizzle with olive oil and balsamic'
                    ],
                    completed: false
                },
                {
                    id: '3',
                    name: 'Salmon with Vegetables',
                    time: '19:00',
                    calories: 600,
                    protein: 40,
                    carbs: 30,
                    fat: 25,
                    ingredients: [
                        'Salmon fillet',
                        'Broccoli',
                        'Sweet potato',
                        'Lemon',
                        'Herbs'
                    ],
                    instructions: [
                        'Preheat oven to 400°F',
                        'Season salmon with herbs and lemon',
                        'Chop vegetables',
                        'Bake salmon and vegetables for 20 minutes',
                        'Serve hot'
                    ],
                    completed: false
                }
            ]
        }
    ]);

    const handleAddMeal = () => {
        if (!newMeal.name || !newMeal.time) return;

        const updatedPlans = mealPlans.map(plan => {
            if (plan.date === selectedDate) {
                return {
                    ...plan,
                    meals: [...plan.meals, {
                        ...newMeal,
                        id: Date.now().toString(),
                        completed: false
                    } as Meal]
                };
            }
            return plan;
        });

        setMealPlans(updatedPlans);
        setShowAddMeal(false);
        setNewMeal({
            name: '',
            time: '',
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            ingredients: [],
            instructions: [],
            completed: false
        });
    };

    const handleToggleMeal = (mealId: string) => {
        const updatedPlans = mealPlans.map(plan => {
            if (plan.date === selectedDate) {
                return {
                    ...plan,
                    meals: plan.meals.map(meal =>
                        meal.id === mealId
                            ? { ...meal, completed: !meal.completed }
                            : meal
                    )
                };
            }
            return plan;
        });

        setMealPlans(updatedPlans);
    };

    const handleDeleteMeal = (mealId: string) => {
        const updatedPlans = mealPlans.map(plan => {
            if (plan.date === selectedDate) {
                return {
                    ...plan,
                    meals: plan.meals.filter(meal => meal.id !== mealId)
                };
            }
            return plan;
        });

        setMealPlans(updatedPlans);
    };

    const currentDayPlan = mealPlans.find(plan => plan.date === selectedDate) || {
        date: selectedDate,
        meals: []
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <h1 className="text-2xl font-bold text-gray-900">Meal Preparation</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddMeal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Meal
                </motion.button>
            </motion.div>

            {/* Date Selector */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center space-x-4"
            >
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </motion.div>

            {/* Meal List */}
            <div className="grid gap-6">
                <AnimatePresence>
                    {currentDayPlan.meals.map((meal, index) => (
                        <motion.div
                            key={meal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`bg-white rounded-lg shadow p-6 ${meal.completed ? 'opacity-75' : ''
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                                    <div className="flex items-center mt-1 text-sm text-gray-500">
                                        <ClockIcon className="h-4 w-4 mr-1" />
                                        {meal.time}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleToggleMeal(meal.id)}
                                        className={`p-2 rounded-full ${meal.completed
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        {meal.completed ? (
                                            <CheckCircleIcon className="h-5 w-5" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5" />
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleDeleteMeal(meal.id)}
                                        className="p-2 text-red-600 rounded-full hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Nutritional Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="grid grid-cols-4 gap-4 mt-4"
                            >
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Calories</div>
                                    <div className="font-semibold">{meal.calories}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Protein</div>
                                    <div className="font-semibold">{meal.protein}g</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Carbs</div>
                                    <div className="font-semibold">{meal.carbs}g</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">Fat</div>
                                    <div className="font-semibold">{meal.fat}g</div>
                                </div>
                            </motion.div>

                            {/* Ingredients */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="mt-4"
                            >
                                <h4 className="text-sm font-medium text-gray-900">Ingredients</h4>
                                <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                                    {meal.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Instructions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mt-4"
                            >
                                <h4 className="text-sm font-medium text-gray-900">Instructions</h4>
                                <ol className="mt-2 list-decimal list-inside text-sm text-gray-600">
                                    {meal.instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ol>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Meal Modal */}
            <AnimatePresence>
                {showAddMeal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white rounded-lg p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-semibold mb-4">Add New Meal</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meal Name</label>
                                    <input
                                        type="text"
                                        value={newMeal.name}
                                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        value={newMeal.time}
                                        onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Calories</label>
                                        <input
                                            type="number"
                                            value={newMeal.calories}
                                            onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                                        <input
                                            type="number"
                                            value={newMeal.protein}
                                            onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                                        <input
                                            type="number"
                                            value={newMeal.carbs}
                                            onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                                    <textarea
                                        value={newMeal.ingredients?.join('\n')}
                                        onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value.split('\n') })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Instructions</label>
                                    <textarea
                                        value={newMeal.instructions?.join('\n')}
                                        onChange={(e) => setNewMeal({ ...newMeal, instructions: e.target.value.split('\n') })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowAddMeal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleAddMeal}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                >
                                    Add Meal
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 