'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    ShareIcon,
    FireIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

type User = {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    followers: number;
    following: number;
    isFollowing: boolean;
};

type Post = {
    id: string;
    userId: string;
    type: 'progress' | 'meal' | 'workout';
    title: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    timestamp: string;
    user: User;
};

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'progress' | 'meal' | 'workout'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Sample users data
    const users: User[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            avatar: '/avatars/sarah.jpg',
            bio: 'Fitness enthusiast | Healthy eating advocate | Marathon runner',
            followers: 1240,
            following: 342,
            isFollowing: true
        },
        {
            id: '2',
            name: 'Michael Chen',
            avatar: '/avatars/michael.jpg',
            bio: 'Personal trainer | Nutrition coach | Helping others achieve their fitness goals',
            followers: 876,
            following: 521,
            isFollowing: false
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            avatar: '/avatars/emma.jpg',
            bio: 'Yoga instructor | Plant-based foodie | Mindfulness advocate',
            followers: 2103,
            following: 432,
            isFollowing: true
        }
    ];

    // Sample posts data
    const [posts, setPosts] = useState<Post[]>([
        {
            id: '1',
            userId: '1',
            type: 'progress',
            title: '30-Day Transformation Challenge Complete!',
            content: 'Just finished my 30-day transformation challenge! Lost 5kg and gained so much strength. Consistency is key! 💪',
            image: '/images/transformation.jpg',
            likes: 124,
            comments: 23,
            isLiked: true,
            timestamp: '2 hours ago',
            user: users[0]
        },
        {
            id: '2',
            userId: '2',
            type: 'workout',
            title: 'New HIIT Workout Routine',
            content: 'Here\'s my new HIIT workout routine that I\'ve been using with clients. It\'s challenging but effective! Try it out and let me know what you think.',
            image: '/images/hiit-workout.jpg',
            likes: 87,
            comments: 15,
            isLiked: false,
            timestamp: '5 hours ago',
            user: users[1]
        },
        {
            id: '3',
            userId: '3',
            type: 'meal',
            title: 'Plant-Based Buddha Bowl',
            content: 'My go-to lunch: quinoa, roasted vegetables, avocado, chickpeas, and tahini dressing. Simple, nutritious, and delicious!',
            image: '/images/buddha-bowl.jpg',
            likes: 156,
            comments: 31,
            isLiked: true,
            timestamp: '1 day ago',
            user: users[2]
        },
        {
            id: '4',
            userId: '1',
            type: 'meal',
            title: 'Meal Prep Sunday',
            content: 'Prepped my meals for the week! Grilled chicken, sweet potatoes, broccoli, and brown rice. Ready to crush my fitness goals!',
            image: '/images/meal-prep.jpg',
            likes: 92,
            comments: 18,
            isLiked: false,
            timestamp: '2 days ago',
            user: users[0]
        },
        {
            id: '5',
            userId: '2',
            type: 'progress',
            title: 'Client Success Story',
            content: 'Proud of my client who lost 15kg in 3 months through consistent training and proper nutrition. Hard work pays off!',
            image: '/images/client-success.jpg',
            likes: 203,
            comments: 42,
            isLiked: true,
            timestamp: '3 days ago',
            user: users[1]
        }
    ]);

    const handleLike = (postId: string) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                : post
        ));
    };

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'all') return true;
        return post.type === activeTab;
    });

    const filteredBySearch = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                <div className="flex items-center space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        {/* <FilterIcon className="h-5 w-5" /> */}
                    </motion.button>
                </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
            >
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <SearchIcon className="h-5 w-5 text-gray-400" /> */}
                </div>
                <input
                    type="text"
                    placeholder="Search posts, users, or topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
            </motion.div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Type</h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${activeTab === 'all'
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setActiveTab('progress')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${activeTab === 'progress'
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ChartBarIcon className="h-4 w-4 mr-1" />
                                    Progress
                                </button>
                                <button
                                    onClick={() => setActiveTab('meal')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${activeTab === 'meal'
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <ClipboardDocumentListIcon className="h-4 w-4 mr-1" />
                                    Meal Prep
                                </button>
                                <button
                                    onClick={() => setActiveTab('workout')}
                                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${activeTab === 'workout'
                                        ? 'bg-primary-100 text-primary-800'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <FireIcon className="h-4 w-4 mr-1" />
                                    Workouts
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Posts */}
            <div className="space-y-6">
                <AnimatePresence mode="wait">
                    {filteredBySearch.map((post, index) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow overflow-hidden"
                        >
                            {/* Post Header */}
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {post.user.avatar ? (
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={post.user.avatar}
                                                alt={post.user.name}
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                <UserCircleIcon className="h-8 w-8 text-primary-600" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{post.user.name}</p>
                                        <p className="text-xs text-gray-500">{post.timestamp}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.type === 'progress' ? 'bg-blue-100 text-blue-800' :
                                        post.type === 'meal' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {post.type === 'progress' ? 'Progress' :
                                            post.type === 'meal' ? 'Meal Prep' : 'Workout'}
                                    </span>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="px-4 pb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                                <p className="mt-1 text-gray-600">{post.content}</p>

                                {post.image && (
                                    <div className="mt-3 rounded-lg overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Post Actions */}
                            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleLike(post.id)}
                                        className={`flex items-center space-x-1 ${post.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                                            }`}
                                    >
                                        <HeartIcon className={`h-5 w-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                        <span className="text-sm">{post.likes}</span>
                                    </motion.button>
                                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                                        <ChatBubbleLeftIcon className="h-5 w-5" />
                                        <span className="text-sm">{post.comments}</span>
                                    </button>
                                </div>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <ShareIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredBySearch.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-gray-500">No posts found. Try adjusting your filters or search.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
} 