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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ClientOnly from '@/app/components/ClientOnly';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import CreatePostForm from '@/app/components/CreatePostForm';
import PostsList from '@/app/components/PostsList';

// Update dynamic imports to use proper type casting
const OutlineIcons = dynamic(() => import('@heroicons/react/24/outline').then(mod => mod as unknown as ComponentType<{}>), {
    ssr: false
});

const SolidIcons = dynamic(() => import('@heroicons/react/24/solid').then(mod => mod as unknown as ComponentType<{}>), {
    ssr: false
});

// Initialize Unsplash API with environment variable
const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

// Function to get random image from Unsplash with error handling
const getRandomImage = async (query: string) => {
    if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
        console.warn('Unsplash access key not found');
        return null;
    }

    try {
        const result = await unsplash.photos.getRandom({
            query,
            orientation: 'landscape',
        });

        if (result.type === 'success') {
            return Array.isArray(result.response)
                ? result.response[0]?.urls?.regular
                : result.response.urls?.regular;
        }
        return null;
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
        return null;
    }
};

// Update the User type to include all required fields
type User = {
    _id: string;
    name: string;
    image?: string;
    bio: string;
    icon?: React.ReactNode;
    followers: number;
    following: number;
    isFollowing: boolean;
};

// Update the Post type to include extended author fields
type Post = {
    _id: string;
    author: {
        _id: string;
        name: string;
        image?: string;
        bio?: string;
        icon?: React.ReactNode;
        followers: number;
        isFollowing: boolean;
    };
    title: string;
    content: string;
    images: string[];
    category: 'progress' | 'meal' | 'workout' | 'general';
    likes: string[];
    comments: string[];
    tags: string[];
    isPublished: boolean;
    createdAt: string;
    likeCount: number;
    commentCount: number;
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

type CreatePostFormData = {
    title: string;
    content: string;
    category: 'progress' | 'meal' | 'workout' | 'general';
    tags: string;
    images: FileList | null;
};

// Add custom session type
interface CustomSession extends Session {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface ShareData {
    title: string;
    text: string;
    url: string;
}

export default function CommunityPage() {
    const { data: session } = useSession();
    const [activeSection, setActiveSection] = useState<'all' | 'discussions' | 'events' | 'resources'>('all');
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [key, setKey] = useState(0);

    const handlePostCreated = () => {
        setKey(prev => prev + 1);
        setShowCreatePost(false);
        toast.success('Post created successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Community</h1>
                    <button
                        onClick={() => setShowCreatePost(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Create Post
                    </button>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar - Communities */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Communities</h2>
                            <div className="space-y-4">
                                {communities.map((community) => (
                                    <div key={community.id} className="flex items-start space-x-3">
                                        {community.icon}
                                        <div>
                                            <h3 className="font-medium">{community.name}</h3>
                                            <p className="text-sm text-gray-500">{community.memberCount} members</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-6">
                        {/* Create Post Modal */}
                        <AnimatePresence>
                            {showCreatePost && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                                >
                                    <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
                                        <div className="flex justify-between items-center p-4 border-b">
                                            <h2 className="text-xl font-semibold">Create Post</h2>
                                            <button
                                                onClick={() => setShowCreatePost(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <CreatePostForm onSuccess={handlePostCreated} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {['all', 'discussions', 'events', 'resources'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveSection(tab as any)}
                                            className={`
                                                py-4 px-1 border-b-2 font-medium text-sm
                                                ${activeSection === tab
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Posts List */}
                        <PostsList key={key} />
                    </div>

                    {/* Right Sidebar - Online Users */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Online Users</h2>
                            <div className="space-y-4">
                                {onlineUsers.map((user) => (
                                    <div key={user.id} className="flex items-center space-x-3">
                                        {user.icon}
                                        <div>
                                            <h3 className="font-medium">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.lastActive}</p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${user.status === 'online' ? 'bg-green-500' :
                                                user.status === 'away' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 