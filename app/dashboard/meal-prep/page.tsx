'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarIcon,
    ClockIcon,
    FireIcon,
    HeartIcon,
    PlusIcon,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    ArrowPathIcon,
    SparklesIcon,
    StarIcon,
    ChartBarIcon,
    ShoppingCartIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    BookmarkIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    FunnelIcon
} from '@heroicons/react/24/outline';
import {
    CalendarIcon as CalendarSolidIcon,
    ClockIcon as ClockSolidIcon,
    FireIcon as FireSolidIcon,
    HeartIcon as HeartSolidIcon,
    StarIcon as StarSolidIcon,
    BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid';

export default function MealPrepPage() {
    const [meals, setMeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMeal, setSelectedMeal] = useState<any>(null);
    const [isAddingMeal, setIsAddingMeal] = useState(false);
    const [newMeal, setNewMeal] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        prepTime: '',
        ingredients: '',
        instructions: '',
        image: ''
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        maxCalories: '',
        minProtein: '',
        maxPrepTime: '',
        mealType: 'all'
    });

    // Sample meal data
    const sampleMeals = [
        {
            id: 1,
            name: 'Grilled Chicken Quinoa Bowl',
            calories: 450,
            protein: 35,
            carbs: 45,
            fat: 12,
            prepTime: 25,
            ingredients: 'Chicken breast, quinoa, avocado, cherry tomatoes, cucumber, olive oil, lemon juice, herbs',
            instructions: '1. Cook quinoa according to package instructions\n2. Grill chicken breast and slice\n3. Chop vegetables\n4. Combine all ingredients in a bowl\n5. Drizzle with olive oil and lemon juice',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'lunch',
            isFavorite: true,
            isBookmarked: false
        },
        {
            id: 2,
            name: 'Salmon with Roasted Vegetables',
            calories: 520,
            protein: 40,
            carbs: 30,
            fat: 25,
            prepTime: 35,
            ingredients: 'Salmon fillet, broccoli, carrots, bell peppers, olive oil, garlic, lemon, herbs',
            instructions: '1. Preheat oven to 400°F\n2. Chop vegetables and place on baking sheet\n3. Season salmon and vegetables with olive oil, garlic, and herbs\n4. Bake for 25-30 minutes\n5. Serve with lemon wedges',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'dinner',
            isFavorite: false,
            isBookmarked: true
        },
        {
            id: 3,
            name: 'Overnight Oats with Berries',
            calories: 320,
            protein: 12,
            carbs: 55,
            fat: 8,
            prepTime: 5,
            ingredients: 'Rolled oats, almond milk, chia seeds, honey, mixed berries, almonds',
            instructions: '1. Mix oats, almond milk, chia seeds, and honey in a jar\n2. Refrigerate overnight\n3. Top with berries and almonds before serving',
            image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'breakfast',
            isFavorite: true,
            isBookmarked: false
        },
        {
            id: 4,
            name: 'Mediterranean Chickpea Salad',
            calories: 380,
            protein: 15,
            carbs: 45,
            fat: 18,
            prepTime: 15,
            ingredients: 'Chickpeas, cucumber, tomatoes, red onion, olives, feta cheese, olive oil, lemon juice, herbs',
            instructions: '1. Drain and rinse chickpeas\n2. Chop vegetables\n3. Combine all ingredients in a bowl\n4. Drizzle with olive oil and lemon juice\n5. Season with herbs to taste',
            image: 'https://images.unsplash.com/photo-1512621776951-a571440c45dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'lunch',
            isFavorite: false,
            isBookmarked: false
        },
        {
            id: 5,
            name: 'Turkey and Sweet Potato Bowl',
            calories: 420,
            protein: 30,
            carbs: 40,
            fat: 15,
            prepTime: 30,
            ingredients: 'Ground turkey, sweet potato, kale, quinoa, avocado, olive oil, spices',
            instructions: '1. Cook quinoa according to package instructions\n2. Peel and cube sweet potato, roast until tender\n3. Cook ground turkey with spices\n4. Massage kale with olive oil\n5. Combine all ingredients in a bowl',
            image: 'https://images.unsplash.com/photo-1543340713-5bf56ea3f964?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'dinner',
            isFavorite: false,
            isBookmarked: true
        },
        {
            id: 6,
            name: 'Green Smoothie Bowl',
            calories: 280,
            protein: 10,
            carbs: 50,
            fat: 5,
            prepTime: 10,
            ingredients: 'Spinach, banana, apple, almond milk, chia seeds, granola, berries, honey',
            instructions: '1. Blend spinach, banana, apple, and almond milk until smooth\n2. Pour into a bowl\n3. Top with chia seeds, granola, and berries\n4. Drizzle with honey',
            image: 'https://images.unsplash.com/photo-1626078295191-7b1e8c1c5b8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
            type: 'breakfast',
            isFavorite: false,
            isBookmarked: false
        }
    ];

    useEffect(() => {
        // Simulate API call to fetch meals
        const fetchMeals = async () => {
            setIsLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setMeals(sampleMeals);
            } catch (error) {
                console.error('Error fetching meals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeals();
    }, []);

    const handleRefreshData = async () => {
        setIsRefreshing(true);
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));
            setMeals(sampleMeals);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleAddMeal = () => {
        setIsAddingMeal(true);
        setNewMeal({
            name: '',
            calories: '',
            protein: '',
            carbs: '',
            fat: '',
            prepTime: '',
            ingredients: '',
            instructions: '',
            image: ''
        });
    };

    const handleSaveMeal = () => {
        if (!newMeal.name) return;

        const mealToAdd = {
            id: meals.length + 1,
            ...newMeal,
            calories: parseInt(newMeal.calories) || 0,
            protein: parseInt(newMeal.protein) || 0,
            carbs: parseInt(newMeal.carbs) || 0,
            fat: parseInt(newMeal.fat) || 0,
            prepTime: parseInt(newMeal.prepTime) || 0,
            type: 'custom',
            isFavorite: false,
            isBookmarked: false
        };

        setMeals([mealToAdd, ...meals]);
        setIsAddingMeal(false);
    };

    const handleCancelAdd = () => {
        setIsAddingMeal(false);
    };

    const handleToggleFavorite = (id: number) => {
        setMeals(meals.map(meal =>
            meal.id === id ? { ...meal, isFavorite: !meal.isFavorite } : meal
        ));
    };

    const handleToggleBookmark = (id: number) => {
        setMeals(meals.map(meal =>
            meal.id === id ? { ...meal, isBookmarked: !meal.isBookmarked } : meal
        ));
    };

    const handleViewMeal = (meal: any) => {
        setSelectedMeal(meal);
    };

    const handleCloseMealDetails = () => {
        setSelectedMeal(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewMeal(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredMeals = meals.filter(meal => {
        // Filter by search query
        if (searchQuery && !meal.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Filter by tab
        if (activeTab !== 'all' && meal.type !== activeTab) {
            return false;
        }

        // Apply additional filters
        if (filters.maxCalories && meal.calories > parseInt(filters.maxCalories)) {
            return false;
        }
        if (filters.minProtein && meal.protein < parseInt(filters.minProtein)) {
            return false;
        }
        if (filters.maxPrepTime && meal.prepTime > parseInt(filters.maxPrepTime)) {
            return false;
        }
        if (filters.mealType !== 'all' && meal.type !== filters.mealType) {
            return false;
        }

        return true;
    });

    const tabs = [
        { id: 'all', name: 'All Meals', icon: ChartBarIcon, activeIcon: ChartBarIcon },
        { id: 'breakfast', name: 'Breakfast', icon: FireIcon, activeIcon: FireSolidIcon },
        { id: 'lunch', name: 'Lunch', icon: CalendarIcon, activeIcon: CalendarSolidIcon },
        { id: 'dinner', name: 'Dinner', icon: ClockIcon, activeIcon: ClockSolidIcon },
        { id: 'favorites', name: 'Favorites', icon: HeartIcon, activeIcon: HeartSolidIcon }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your meal prep options...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Meal Prep</h1>
                        <p className="mt-2 text-gray-600">
                            Plan and prepare your healthy meals for the week
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleRefreshData}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                        >
                            <ArrowPathIcon className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddMeal}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Meal
                        </motion.button>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-4"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search meals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                            >
                                <FunnelIcon className="h-5 w-5 mr-2" />
                                Filters
                            </motion.button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 pt-4 border-t border-gray-200"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Calories
                                        </label>
                                        <input
                                            type="number"
                                            name="maxCalories"
                                            value={filters.maxCalories}
                                            onChange={handleFilterChange}
                                            placeholder="e.g. 500"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Protein (g)
                                        </label>
                                        <input
                                            type="number"
                                            name="minProtein"
                                            value={filters.minProtein}
                                            onChange={handleFilterChange}
                                            placeholder="e.g. 20"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Prep Time (min)
                                        </label>
                                        <input
                                            type="number"
                                            name="maxPrepTime"
                                            value={filters.maxPrepTime}
                                            onChange={handleFilterChange}
                                            placeholder="e.g. 30"
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Meal Type
                                        </label>
                                        <select
                                            name="mealType"
                                            value={filters.mealType}
                                            onChange={handleFilterChange}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="all">All Types</option>
                                            <option value="breakfast">Breakfast</option>
                                            <option value="lunch">Lunch</option>
                                            <option value="dinner">Dinner</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                >
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const ActiveIcon = tab.activeIcon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <motion.button
                                        key={tab.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap ${isActive
                                            ? 'text-primary-700 border-b-2 border-primary-600'
                                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        {isActive ? (
                                            <ActiveIcon className="h-5 w-5 mr-2 text-primary-600" />
                                        ) : (
                                            <Icon className="h-5 w-5 mr-2 text-gray-400" />
                                        )}
                                        {tab.name}
                                    </motion.button>
                                );
                            })}
                        </nav>
                    </div>
                </motion.div>

                {/* Meal Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredMeals.length > 0 ? (
                        filteredMeals.map((meal) => (
                            <motion.div
                                key={meal.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={meal.image}
                                        alt={meal.name}
                                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 flex space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleToggleFavorite(meal.id)}
                                            className="p-2 bg-white rounded-full shadow-md"
                                        >
                                            {meal.isFavorite ? (
                                                <HeartSolidIcon className="h-5 w-5 text-red-500" />
                                            ) : (
                                                <HeartIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleToggleBookmark(meal.id)}
                                            className="p-2 bg-white rounded-full shadow-md"
                                        >
                                            {meal.isBookmarked ? (
                                                <BookmarkSolidIcon className="h-5 w-5 text-primary-600" />
                                            ) : (
                                                <BookmarkIcon className="h-5 w-5 text-gray-500" />
                                            )}
                                        </motion.button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                        <h3 className="text-xl font-bold text-white">{meal.name}</h3>
                                        <div className="flex items-center mt-1">
                                            <span className="text-sm text-white bg-primary-600 px-2 py-1 rounded-full">
                                                {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Calories</p>
                                            <p className="text-lg font-bold text-gray-900">{meal.calories}</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Protein</p>
                                            <p className="text-lg font-bold text-gray-900">{meal.protein}g</p>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Prep Time</p>
                                            <p className="text-lg font-bold text-gray-900">{meal.prepTime} min</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleViewMeal(meal)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                        >
                                            View Details
                                        </motion.button>
                                        <div className="flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-gray-500 hover:text-primary-600"
                                            >
                                                <ShareIcon className="h-5 w-5" />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="p-2 text-gray-500 hover:text-primary-600"
                                            >
                                                <ShoppingCartIcon className="h-5 w-5" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <SparklesIcon className="h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No meals found</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    setSearchQuery('');
                                    setFilters({
                                        maxCalories: '',
                                        minProtein: '',
                                        maxPrepTime: '',
                                        mealType: 'all'
                                    });
                                    setActiveTab('all');
                                }}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                            >
                                Clear Filters
                            </motion.button>
                        </div>
                    )}
                </motion.div>

                {/* Add Meal Modal */}
                <AnimatePresence>
                    {isAddingMeal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-gray-900">Add New Meal</h3>
                                        <button
                                            onClick={handleCancelAdd}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Meal Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newMeal.name}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. Grilled Chicken Salad"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Image URL
                                            </label>
                                            <input
                                                type="text"
                                                name="image"
                                                value={newMeal.image}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Calories
                                            </label>
                                            <input
                                                type="number"
                                                name="calories"
                                                value={newMeal.calories}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. 450"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Protein (g)
                                            </label>
                                            <input
                                                type="number"
                                                name="protein"
                                                value={newMeal.protein}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. 30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Carbs (g)
                                            </label>
                                            <input
                                                type="number"
                                                name="carbs"
                                                value={newMeal.carbs}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. 45"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fat (g)
                                            </label>
                                            <input
                                                type="number"
                                                name="fat"
                                                value={newMeal.fat}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. 15"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Prep Time (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                name="prepTime"
                                                value={newMeal.prepTime}
                                                onChange={handleInputChange}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="e.g. 25"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ingredients
                                            </label>
                                            <textarea
                                                name="ingredients"
                                                value={newMeal.ingredients}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="List ingredients separated by commas"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Instructions
                                            </label>
                                            <textarea
                                                name="instructions"
                                                value={newMeal.instructions}
                                                onChange={handleInputChange}
                                                rows={4}
                                                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                placeholder="Step-by-step cooking instructions"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleCancelAdd}
                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSaveMeal}
                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                    >
                                        Save Meal
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Meal Details Modal */}
                <AnimatePresence>
                    {selectedMeal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={selectedMeal.image}
                                        alt={selectedMeal.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h2 className="text-2xl font-bold text-white">{selectedMeal.name}</h2>
                                        <div className="flex items-center mt-2">
                                            <span className="text-sm text-white bg-primary-600 px-3 py-1 rounded-full">
                                                {selectedMeal.type.charAt(0).toUpperCase() + selectedMeal.type.slice(1)}
                                            </span>
                                            <span className="ml-3 text-sm text-white flex items-center">
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                {selectedMeal.prepTime} minutes
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCloseMealDetails}
                                        className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full text-gray-800 hover:bg-white"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-500 mb-1">Calories</p>
                                            <p className="text-2xl font-bold text-gray-900">{selectedMeal.calories}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-500 mb-1">Protein</p>
                                            <p className="text-2xl font-bold text-gray-900">{selectedMeal.protein}g</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                                            <p className="text-sm text-gray-500 mb-1">Prep Time</p>
                                            <p className="text-2xl font-bold text-gray-900">{selectedMeal.prepTime} min</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Ingredients</h3>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-700 whitespace-pre-line">{selectedMeal.ingredients}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Instructions</h3>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="text-gray-700 whitespace-pre-line">{selectedMeal.instructions}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-2">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleToggleFavorite(selectedMeal.id)}
                                                className="p-2 text-gray-500 hover:text-red-500"
                                            >
                                                {selectedMeal.isFavorite ? (
                                                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                                                ) : (
                                                    <HeartIcon className="h-6 w-6" />
                                                )}
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleToggleBookmark(selectedMeal.id)}
                                                className="p-2 text-gray-500 hover:text-primary-600"
                                            >
                                                {selectedMeal.isBookmarked ? (
                                                    <BookmarkSolidIcon className="h-6 w-6 text-primary-600" />
                                                ) : (
                                                    <BookmarkIcon className="h-6 w-6" />
                                                )}
                                            </motion.button>
                                        </div>
                                        <div className="flex space-x-3">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                            >
                                                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                                Add to Shopping List
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                            >
                                                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                                Save Recipe
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
} 