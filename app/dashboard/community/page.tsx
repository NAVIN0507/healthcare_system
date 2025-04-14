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
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
                        <button className="btn-primary flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            Create Post
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Section Tabs */}
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="flex space-x-4 overflow-x-auto">
                                {sections.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveSection(id as CommunitySection)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeSection === id
                                                ? 'bg-indigo-50 text-indigo-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="space-y-6">
                            {filteredBySearch.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={post.user.icon ? (post.user.icon as string) : '/images/placeholder.jpg'}
                                                alt={post.user.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                                                        <p className="text-sm text-gray-500">{post.user.bio}</p>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{post.timestamp}</span>
                                                </div>
                                                <p className="mt-4 text-gray-700">{post.content}</p>
                                                {post.image && (
                                                    <img
                                                        src={post.image}
                                                        alt="Post content"
                                                        className="mt-4 rounded-lg w-full h-64 object-cover"
                                                    />
                                                )}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {post.user.bio.split(' ').map((word) => (
                                                        <span
                                                            key={word}
                                                            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                                                        >
                                                            {word}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100">
                                        <div className="flex items-center justify-between px-6 py-4">
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => handleLike(post.id)}
                                                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600"
                                                >
                                                    <Heart className="w-5 h-5" />
                                                    <span>{post.likes}</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span>{post.comments}</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">
                                                    <ShareIcon className="w-5 h-5" />
                                                    <span>{post.shares}</span>
                                                </button>
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
                        <div className="bg-white rounded-xl shadow-sm p-4">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search community..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    {...register('search')}
                                />
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
                            <div className="space-y-4">
                                {onlineUsers.map((user) => (
                                    <div key={user.id} className="flex gap-4">
                                        <img
                                            src={user.icon as string}
                                            alt={user.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                                            <div className="mt-1 space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{user.lastActive}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-sm text-indigo-600">{user.status === 'online' ? 'Online' : user.status === 'away' ? 'Away' : 'Busy'}</span>
                                                <button className="text-sm text-indigo-600 hover:text-indigo-700">
                                                    Join
                                                </button>
                                            </div>
                                        </div>
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