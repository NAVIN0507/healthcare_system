'use client';

import { useState, useRef, useEffect } from 'react';
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
    FunnelIcon,
    ChevronRightIcon,
    ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import {
    Users, MessageSquare, Heart, Share2,
    Search, Filter, Plus, ChevronRight,
    Calendar, Clock, MapPin, Tag
} from 'lucide-react';
import { createApi } from 'unsplash-js';

// Initialize Unsplash API
const unsplash = createApi({
    accessKey: 'YOUR_UNSPLASH_ACCESS_KEY', // Replace with your actual Unsplash access key
});

// Function to get random image from Unsplash
const getRandomImage = async (query: string) => {
    try {
        const result = await unsplash.photos.getRandom({
            query,
            orientation: 'landscape',
        });

        if (result.type === 'success') {
            // Handle both single photo and array of photos
            if (Array.isArray(result.response)) {
                return result.response[0]?.urls?.regular || null;
            } else {
                return result.response.urls?.regular || null;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
};

type User = {
    id: string;
    name: string;
    icon: React.ReactNode;
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
    shares: number;
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
    icon: React.ReactNode;
};

// Update the OnlineUser type to use icon instead of avatar
type OnlineUser = {
    id: string;
    name: string;
    icon: React.ReactNode;
    status: 'online' | 'away' | 'busy';
    lastActive: string;
};

// Sample communities data with icons
const communities: Community[] = [
    {
        id: '1',
        name: 'Fitness Enthusiasts',
        description: 'A community for fitness lovers to share tips and motivation',
        category: 'Fitness',
        memberCount: 1234,
        isJoined: false,
        icon: <FireIcon className="w-12 h-12 text-orange-500" />
    },
    {
        id: '2',
        name: 'Healthy Eating',
        description: 'Share healthy recipes and nutrition tips',
        category: 'Nutrition',
        memberCount: 856,
        isJoined: true,
        icon: <ClipboardDocumentListIcon className="w-12 h-12 text-green-500" />
    },
    {
        id: '3',
        name: 'Weight Loss Journey',
        description: 'Support group for people on their weight loss journey',
        category: 'Weight Loss',
        memberCount: 2341,
        isJoined: false,
        icon: <ChartBarIcon className="w-12 h-12 text-blue-500" />
    }
];

// Update sample online users data with icons
const onlineUsers: OnlineUser[] = [
    {
        id: '1',
        name: 'Sarah Johnson',
        icon: <UserCircleIcon className="w-10 h-10 text-blue-500" />,
        status: 'online',
        lastActive: 'Now'
    },
    {
        id: '2',
        name: 'Michael Chen',
        icon: <UserCircleIcon className="w-10 h-10 text-green-500" />,
        status: 'away',
        lastActive: '5 min ago'
    },
    {
        id: '3',
        name: 'Emma Rodriguez',
        icon: <UserCircleIcon className="w-10 h-10 text-purple-500" />,
        status: 'busy',
        lastActive: '10 min ago'
    },
    {
        id: '4',
        name: 'David Wilson',
        icon: <UserCircleIcon className="w-10 h-10 text-orange-500" />,
        status: 'online',
        lastActive: 'Now'
    },
    {
        id: '5',
        name: 'Lisa Anderson',
        icon: <UserCircleIcon className="w-10 h-10 text-pink-500" />,
        status: 'online',
        lastActive: 'Now'
    }
];

type CommunitySection = 'all' | 'discussions' | 'events' | 'resources';

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
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeSection, setActiveSection] = useState<CommunitySection>('all');
    const { register, handleSubmit } = useForm();
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    const [heroImage, setHeroImage] = useState('');
    const [isLoadingHeroImage, setIsLoadingHeroImage] = useState(true);

    // Sample users data
    const users: User[] = [
        {
            id: '1',
            name: 'Sarah Johnson',
            icon: <UserCircleIcon className="w-10 h-10 text-blue-500" />,
            bio: 'Fitness enthusiast | Healthy eating advocate | Marathon runner',
            followers: 1240,
            following: 342,
            isFollowing: true
        },
        {
            id: '2',
            name: 'Michael Chen',
            icon: <UserCircleIcon className="w-10 h-10 text-green-500" />,
            bio: 'Personal trainer | Nutrition coach | Helping others achieve their fitness goals',
            followers: 876,
            following: 521,
            isFollowing: false
        },
        {
            id: '3',
            name: 'Emma Rodriguez',
            icon: <UserCircleIcon className="w-10 h-10 text-purple-500" />,
            bio: 'Yoga instructor | Plant-based foodie | Mindfulness advocate',
            followers: 2103,
            following: 432,
            isFollowing: true
        }
    ];

    // Sample posts data with Unsplash images
    const [posts, setPosts] = useState<Post[]>([
        {
            id: '1',
            userId: '1',
            type: 'progress',
            title: '30-Day Transformation Challenge Complete!',
            content: 'Just finished my 30-day transformation challenge! Lost 5kg and gained so much strength. Consistency is key! 💪',
            image: '',
            likes: 124,
            comments: 23,
            shares: 12,
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
            image: '',
            likes: 87,
            comments: 15,
            shares: 8,
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
            image: '',
            likes: 156,
            comments: 31,
            shares: 24,
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
            image: '',
            likes: 92,
            comments: 18,
            shares: 9,
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
            image: '',
            likes: 203,
            comments: 42,
            shares: 31,
            isLiked: true,
            timestamp: '3 days ago',
            user: users[1]
        }
    ]);

    // Fetch random images from Unsplash for posts
    useEffect(() => {
        const fetchImages = async () => {
            setIsLoadingImages(true);

            const updatedPosts = await Promise.all(
                posts.map(async (post) => {
                    let query = 'fitness';

                    if (post.type === 'meal') {
                        query = 'healthy food';
                    } else if (post.type === 'workout') {
                        query = 'workout';
                    } else if (post.type === 'progress') {
                        query = 'fitness transformation';
                    }

                    const imageUrl = await getRandomImage(query);
                    return {
                        ...post,
                        image: imageUrl || ''
                    };
                })
            );

            setPosts(updatedPosts);
            setIsLoadingImages(false);
        };

        fetchImages();
    }, []);

    // Fetch random hero image from Unsplash
    useEffect(() => {
        const fetchHeroImage = async () => {
            setIsLoadingHeroImage(true);
            const imageUrl = await getRandomImage('fitness community');
            setHeroImage(imageUrl || '');
            setIsLoadingHeroImage(false);
        };

        fetchHeroImage();
    }, []);

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

    const handleFollowUser = (userId: string) => {
        const updatedUsers = users.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    isFollowing: !user.isFollowing,
                    followers: user.isFollowing ? user.followers - 1 : user.followers + 1
                };
            }
            return user;
        });
        // Update the users array (in a real app, this would be handled by an API call)
        Object.assign(users, updatedUsers);
    };

    const sections = [
        { id: 'all', label: 'All Posts', icon: Users },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'resources', label: 'Resources', icon: Tag }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
                    {isLoadingHeroImage ? (
                        <div className="absolute inset-0 bg-indigo-800 animate-pulse"></div>
                    ) : heroImage ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        ></div>
                    ) : (
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                    )}
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-8 md:mb-0">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl md:text-5xl font-bold mb-4"
                            >
                                Connect with Your Health Community
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-xl text-indigo-100 mb-6"
                            >
                                Share your journey, get inspired, and support others on their path to better health.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-wrap gap-4"
                            >
                                <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium shadow-lg hover:bg-indigo-50 transition-all">
                                    Join a Community
                                </button>
                                <button className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-800 transition-all">
                                    Create a Post
                                </button>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="md:w-1/2"
                        >
                            <div className="relative">
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-20"></div>
                                <div className="flex justify-center items-center">
                                    <UserGroupIcon className="w-48 h-48 text-white opacity-90" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Section Tabs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-xl shadow-sm p-4"
                        >
                            <div className="flex space-x-4 overflow-x-auto">
                                {sections.map(({ id, label, icon: Icon }) => (
                                    <motion.button
                                        key={id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setActiveSection(id as CommunitySection)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSection === id
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Posts */}
                        <div className="space-y-6">
                            {filteredBySearch.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                {post.user.icon}
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                                                        <p className="text-sm text-gray-500">{post.user.bio}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{post.timestamp}</span>
                                                </div>
                                                <h4 className="mt-3 text-lg font-medium text-gray-900">{post.title}</h4>
                                                <p className="mt-2 text-gray-700">{post.content}</p>
                                                {post.image && (
                                                    <div className="mt-4 rounded-lg overflow-hidden">
                                                        {isLoadingImages ? (
                                                            <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                                                                <PhotoIcon className="w-12 h-12 text-gray-400" />
                                                            </div>
                                                        ) : (
                                                            <img
                                                                src={post.image}
                                                                alt="Post content"
                                                                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {post.user.bio.split(' ').map((word) => (
                                                        <span
                                                            key={word}
                                                            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                                                        >
                                                            #{word}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100">
                                        <div className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-6">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleLike(post.id)}
                                                    className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-indigo-600'}`}
                                                >
                                                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                                    <span>{post.likes}</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600"
                                                >
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span>{post.comments}</span>
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600"
                                                >
                                                    <Share2 className="w-5 h-5" />
                                                    <span>{post.shares}</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white rounded-xl shadow-sm p-4"
                        >
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search community..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    {...register('search')}
                                />
                            </div>
                        </motion.div>

                        {/* Featured Communities */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Communities</h2>
                            <div className="space-y-4">
                                {communities.map((community) => (
                                    <motion.div
                                        key={community.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            {community.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{community.name}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{community.description}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                                                    {community.memberCount} members
                                                </span>
                                                <button
                                                    onClick={() => handleJoinCommunity(community.id)}
                                                    className={`text-sm px-3 py-1 rounded-full ${community.isJoined
                                                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                        }`}
                                                >
                                                    {community.isJoined ? 'Joined' : 'Join'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Upcoming Events */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white rounded-xl shadow-sm p-6"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                            <div className="space-y-4">
                                {onlineUsers.map((user) => (
                                    <motion.div
                                        key={user.id}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="relative">
                                            {user.icon}
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-400' :
                                                user.status === 'away' ? 'bg-yellow-400' : 'bg-red-400'
                                                }`}></div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                                            <div className="mt-1 space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{user.lastActive}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'online' ? 'bg-green-50 text-green-600' :
                                                    user.status === 'away' ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                    {user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Busy'}
                                                </span>
                                                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                                    Join
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
} 