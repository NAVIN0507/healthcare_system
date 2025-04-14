'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    HeartIcon,
    ChatBubbleLeftIcon,
    ShareIcon,
    FireIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,

    ChevronDownIcon,
    PlusIcon,
    UserGroupIcon,
    XMarkIcon,
    PhotoIcon,
    LinkIcon,
    ClipboardIcon,
    CheckIcon,
    MagnifyingGlassIcon,
    FunnelIcon
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

type Community = {
    id: string;
    name: string;
    description: string;
    category: string;
    memberCount: number;
    isJoined: boolean;
    coverImage?: string;
};

// Sample communities data
const communities: Community[] = [
    {
        id: '1',
        name: 'Fitness Enthusiasts',
        description: 'A community for fitness lovers to share tips and motivation',
        category: 'Fitness',
        memberCount: 1234,
        isJoined: false,
        coverImage: '/images/community/fitness.jpg'
    },
    {
        id: '2',
        name: 'Healthy Eating',
        description: 'Share healthy recipes and nutrition tips',
        category: 'Nutrition',
        memberCount: 856,
        isJoined: true,
        coverImage: '/images/community/nutrition.jpg'
    },
    {
        id: '3',
        name: 'Weight Loss Journey',
        description: 'Support group for people on their weight loss journey',
        category: 'Weight Loss',
        memberCount: 2341,
        isJoined: false,
        coverImage: '/images/community/weight-loss.jpg'
    }
];

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'progress' | 'meal' | 'workout'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);
    const [showCommunities, setShowCommunities] = useState(true);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [copied, setCopied] = useState(false);
    const inviteLinkRef = useRef<HTMLInputElement>(null);

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

    // Filter communities based on search query
    const filteredCommunities = communities.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle joining/leaving a community
    const handleJoinCommunity = (communityId: string) => {
        const updatedCommunities = communities.map(community => {
            if (community.id === communityId) {
                return {
                    ...community,
                    isJoined: !community.isJoined,
                    memberCount: community.isJoined ? community.memberCount - 1 : community.memberCount + 1
                };
            }
            return community;
        });
        // Update the communities array (in a real app, this would be handled by an API call)
        Object.assign(communities, updatedCommunities);
    };

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

    const handleShareCommunity = (community: Community) => {
        setSelectedCommunity(community);
        setShowShareModal(true);
    };

    const copyInviteLink = () => {
        if (inviteLinkRef.current) {
            inviteLinkRef.current.select();
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
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

            {/* Communities Section */}
            <AnimatePresence>
                {showCommunities && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Communities</h2>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCreateCommunity(true)}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Create Community
                                </motion.button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredCommunities.map((community) => (
                                    <motion.div
                                        key={community.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                    >
                                        <div className="h-24 bg-gray-200 relative">
                                            {community.coverImage ? (
                                                <img
                                                    src={community.coverImage}
                                                    alt={community.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                                                    <UserGroupIcon className="h-12 w-12 text-primary-500" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${community.category === 'fitness' ? 'bg-blue-100 text-blue-800' :
                                                    community.category === 'nutrition' ? 'bg-green-100 text-green-800' :
                                                        community.category === 'wellness' ? 'bg-purple-100 text-purple-800' :
                                                            community.category === 'weight-loss' ? 'bg-yellow-100 text-yellow-800' :
                                                                community.category === 'muscle-gain' ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {community.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="text-lg font-medium text-gray-900">{community.name}</h3>
                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{community.description}</p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <UserGroupIcon className="h-4 w-4 mr-1" />
                                                    <span>{community.memberCount} members</span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleShareCommunity(community)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                                        title="Share Community"
                                                    >
                                                        <LinkIcon className="h-5 w-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleJoinCommunity(community.id)}
                                                        className={`px-3 py-1 text-sm font-medium rounded-md ${community.isJoined
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                                            }`}
                                                    >
                                                        {community.isJoined ? 'Joined' : 'Join'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredCommunities.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No communities found. Try adjusting your search or create a new community.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share Community Modal */}
            <AnimatePresence>
                {showShareModal && selectedCommunity && (
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
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">Share Community</h3>
                                        <button
                                            onClick={() => setShowShareModal(false)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="invite-link" className="block text-sm font-medium text-gray-700">
                                                Invitation Link
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    id="invite-link"
                                                    ref={inviteLinkRef}
                                                    readOnly
                                                    value={`https://healthcare.com/community/${selectedCommunity.id}/join`}
                                                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300"
                                                />
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={copyInviteLink}
                                                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                                >
                                                    {copied ? (
                                                        <CheckIcon className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <ClipboardIcon className="h-5 w-5" />
                                                    )}
                                                </motion.button>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Share this link with others to invite them to join the {selectedCommunity.name} community.
                                            </p>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Share via</h4>
                                            <div className="flex space-x-4">
                                                <button className="text-gray-500 hover:text-gray-700">
                                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-500 hover:text-gray-700">
                                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-500 hover:text-gray-700">
                                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                                    </svg>
                                                </button>
                                                <button className="text-gray-500 hover:text-gray-700">
                                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowShareModal(false)}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Close
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