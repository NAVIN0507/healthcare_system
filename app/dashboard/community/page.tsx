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
    // Session and Router hooks
    const { data: session } = useSession() as { data: CustomSession | null };
    const router = useRouter();

    // State hooks
    const [isClient, setIsClient] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'progress' | 'meal' | 'workout'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);
    const [showCommunities, setShowCommunities] = useState(true);
    const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
    const [copied, setCopied] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const [activeSection, setActiveSection] = useState<CommunitySection>('all');
    const [isLoadingImages, setIsLoadingImages] = useState(true);
    const [heroImage, setHeroImage] = useState('');
    const [isLoadingHeroImage, setIsLoadingHeroImage] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([
        {
            _id: '1',
            author: {
                _id: '1',
                name: 'Sarah Johnson',
                image: '',
                bio: 'Fitness enthusiast | Healthy eating advocate | Marathon runner',
                icon: <UserCircleIcon className="w-10 h-10 text-blue-500" />,
                followers: 0,
                isFollowing: false
            },
            title: '30-Day Transformation Challenge Complete!',
            content: 'Just finished my 30-day transformation challenge! Lost 5kg and gained so much strength. Consistency is key! 💪',
            images: [],
            category: 'progress',
            likes: ['1'],
            comments: ['1'],
            tags: [],
            isPublished: true,
            createdAt: '2 hours ago',
            likeCount: 124,
            commentCount: 23
        },
        {
            _id: '2',
            author: {
                _id: '2',
                name: 'Michael Chen',
                image: '',
                bio: 'Personal trainer | Nutrition coach | Helping others achieve their fitness goals',
                icon: <UserCircleIcon className="w-10 h-10 text-green-500" />,
                followers: 0,
                isFollowing: false
            },
            title: 'New HIIT Workout Routine',
            content: 'Here\'s my new HIIT workout routine that I\'ve been using with clients. It\'s challenging but effective! Try it out and let me know what you think.',
            images: [],
            category: 'workout',
            likes: [],
            comments: [],
            tags: [],
            isPublished: true,
            createdAt: '5 hours ago',
            likeCount: 87,
            commentCount: 15
        },
        {
            _id: '3',
            author: {
                _id: '3',
                name: 'Emma Rodriguez',
                image: '',
                bio: 'Yoga instructor | Plant-based foodie | Mindfulness advocate',
                icon: <UserCircleIcon className="w-10 h-10 text-purple-500" />,
                followers: 0,
                isFollowing: false
            },
            title: 'Plant-Based Buddha Bowl',
            content: 'My go-to lunch: quinoa, roasted vegetables, avocado, chickpeas, and tahini dressing. Simple, nutritious, and delicious!',
            images: [],
            category: 'meal',
            likes: [],
            comments: [],
            tags: [],
            isPublished: true,
            createdAt: '1 day ago',
            likeCount: 156,
            commentCount: 31
        },
        {
            _id: '4',
            author: {
                _id: '1',
                name: 'Sarah Johnson',
                image: '',
                bio: 'Fitness enthusiast | Healthy eating advocate | Marathon runner',
                icon: <UserCircleIcon className="w-10 h-10 text-blue-500" />,
                followers: 0,
                isFollowing: false
            },
            title: 'Meal Prep Sunday',
            content: 'Prepped my meals for the week! Grilled chicken, sweet potatoes, broccoli, and brown rice. Ready to crush my fitness goals!',
            images: [],
            category: 'meal',
            likes: [],
            comments: [],
            tags: [],
            isPublished: true,
            createdAt: '2 days ago',
            likeCount: 92,
            commentCount: 18
        },
        {
            _id: '5',
            author: {
                _id: '2',
                name: 'Michael Chen',
                image: '',
                bio: 'Personal trainer | Nutrition coach | Helping others achieve their fitness goals',
                icon: <UserCircleIcon className="w-10 h-10 text-green-500" />,
                followers: 0,
                isFollowing: false
            },
            title: 'Client Success Story',
            content: 'Proud of my client who lost 15kg in 3 months through consistent training and proper nutrition. Hard work pays off!',
            images: [],
            category: 'progress',
            likes: ['2'],
            comments: ['2'],
            tags: [],
            isPublished: true,
            createdAt: '3 days ago',
            likeCount: 203,
            commentCount: 42
        }
    ]);

    // Ref hooks
    const inviteLinkRef = useRef<HTMLInputElement>(null);

    // Form hook
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostFormData>();

    // Effect hooks
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoadingImages(true);
            const updatedPosts = await Promise.all(
                posts.map(async (post) => {
                    let query = 'fitness';
                    if (post.category === 'meal') {
                        query = 'healthy food';
                    } else if (post.category === 'workout') {
                        query = 'workout';
                    } else if (post.category === 'progress') {
                        query = 'fitness transformation';
                    }
                    const imageUrl = await getRandomImage(query);
                    return {
                        ...post,
                        images: imageUrl ? [imageUrl] : []
                    };
                })
            );
            setPosts(updatedPosts);
            setIsLoadingImages(false);
        };
        fetchImages();
    }, []);

    useEffect(() => {
        const fetchHeroImage = async () => {
            setIsLoadingHeroImage(true);
            const imageUrl = await getRandomImage('fitness community');
            setHeroImage(imageUrl || '');
            setIsLoadingHeroImage(false);
        };
        fetchHeroImage();
    }, []);

    // Don't render anything until we're on the client
    if (!isClient) {
        return null;
    }

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

    // Handle liking posts
    const handleLike = (postId: string) => {
        if (!session?.user?.id) {
            toast.error('Please sign in to like posts');
            return;
        }

        setPosts(posts.map(post =>
            post._id === postId
                ? {
                    ...post,
                    likes: post.likes.includes(session.user.id || '')
                        ? post.likes.filter(id => id !== session.user.id)
                        : [...post.likes, session.user.id],
                    likeCount: post.likes.includes(session.user.id || '')
                        ? post.likeCount - 1
                        : post.likeCount + 1
                }
                : post
        ));
    };

    const filteredPosts = posts.filter(post => {
        if (activeTab === 'all') return true;
        return post.category === activeTab;
    });

    const filteredBySearch = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        const updatedUsers = posts.map(post => post.author).map(author => {
            if (author._id === userId) {
                return {
                    ...author,
                    isFollowing: !author.isFollowing,
                    followers: author.isFollowing ? author.followers - 1 : author.followers + 1
                };
            }
            return author;
        });
        // Update the posts array (in a real app, this would be handled by an API call)
        setPosts(posts.map(post => ({
            ...post,
            author: updatedUsers.find(u => u._id === post.author._id) || post.author
        })));
    };

    const sections = [
        { id: 'all', label: 'All Posts', icon: Users },
        { id: 'discussions', label: 'Discussions', icon: MessageSquare },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'resources', label: 'Resources', icon: Tag }
    ];

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            if (response.ok) {
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Failed to load posts');
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const validFiles = Array.from(files).filter(file => {
                const isValid = file.type.startsWith('image/');
                const isWithinSize = file.size <= 10 * 1024 * 1024; // 10MB
                return isValid && isWithinSize;
            });

            if (validFiles.length !== files.length) {
                toast.error('Some files were skipped. Please upload images under 10MB.');
            }

            const imageUrls = validFiles.map(file => URL.createObjectURL(file));
            setSelectedImages(prev => [...prev, ...imageUrls]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmitPost = async (data: CreatePostFormData) => {
        if (!session?.user) {
            toast.error('Please sign in to create a post');
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('category', data.category);
        formData.append('tags', data.tags);

        if (data.images) {
            Array.from(data.images).forEach((file) => {
                formData.append('images', file);
            });
        }

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Post created successfully!');
                setShowCreatePost(false);
                reset();
                setSelectedImages([]);
                await fetchPosts(); // Refresh posts
            } else {
                throw new Error(result.error || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update the user followers display to handle optional values
    const renderFollowers = (user: User) => {
        return user.followers?.toLocaleString() || '0';
    };

    // Update the search input to use state instead of form registration
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Update handleShare function to handle undefined values
    const handleShare = (postId: string) => {
        const post = posts.find(p => p._id === postId);
        if (!post) return;

        const url = `${window.location.origin}/community/post/${postId}`;
        const title = post.title || 'Health Community Post';
        const text = post.content || 'Check out this post from the Health Community!';

        if (navigator.share) {
            navigator.share({
                title,
                text,
                url
            } as ShareData)
                .then(() => toast.success('Post shared successfully!'))
                .catch(() => toast.error('Failed to share post'));
        } else {
            navigator.clipboard.writeText(url)
                .then(() => toast.success('Link copied to clipboard!'))
                .catch(() => toast.error('Failed to copy link'));
        }
    };

    return (
        <ClientOnly>
            <div className="flex flex-col min-h-screen h-screen overflow-y-auto">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex-shrink-0">
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
                                    <button
                                        onClick={() => setShowCreatePost(true)}
                                        className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium shadow-lg hover:bg-indigo-800 transition-all"
                                    >
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

                <div className="flex-1 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
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
                                            key={post._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative">
                                                        {post.author.icon}
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                                                                <p className="text-sm text-gray-500">{post.author.bio}</p>
                                                            </div>
                                                            <span className="text-sm text-gray-500">{post.createdAt}</span>
                                                        </div>
                                                        <h4 className="mt-3 text-lg font-medium text-gray-900">{post.title}</h4>
                                                        <p className="mt-2 text-gray-700">{post.content}</p>
                                                        {post.images.length > 0 && (
                                                            <div className="mt-4 rounded-lg overflow-hidden">
                                                                {isLoadingImages ? (
                                                                    <div className="w-full h-64 bg-gray-200 animate-pulse flex items-center justify-center">
                                                                        <PhotoIcon className="w-12 h-12 text-gray-400" />
                                                                    </div>
                                                                ) : (
                                                                    <img
                                                                        src={post.images[0]}
                                                                        alt="Post content"
                                                                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                                                                    />
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="mt-4 flex flex-wrap gap-2">
                                                            {post.tags?.map((tag, index) => (
                                                                <span
                                                                    key={`${tag}-${index}`}
                                                                    className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm"
                                                                >
                                                                    #{tag}
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
                                                            onClick={() => handleLike(post._id)}
                                                            className={`flex items-center gap-2 ${post.likes.includes(session?.user?.id || '')
                                                                ? 'text-red-500'
                                                                : 'text-gray-500 hover:text-indigo-600'
                                                                }`}
                                                        >
                                                            <Heart className={`w-5 h-5 ${post.likes.includes(session?.user?.id || '')
                                                                ? 'fill-current'
                                                                : ''
                                                                }`} />
                                                            <span>{post.likeCount}</span>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600"
                                                        >
                                                            <MessageSquare className="w-5 h-5" />
                                                            <span>{post.commentCount}</span>
                                                        </motion.button>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600"
                                                        >
                                                            <Share2 className="w-5 h-5" />
                                                            <span>{post.images.length}</span>
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
                                            value={searchQuery}
                                            onChange={handleSearch}
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

                {/* Create Post Modal */}
                <AnimatePresence>
                    {showCreatePost && (
                        <div className="fixed inset-0 z-50 overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative"
                                >
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
                                        <button
                                            onClick={() => setShowCreatePost(false)}
                                            className="text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmitPost)} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Title
                                            </label>
                                            <input
                                                {...register('title', { required: 'Title is required' })}
                                                type="text"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter post title"
                                            />
                                            {errors.title && (
                                                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Content
                                            </label>
                                            <textarea
                                                {...register('content', { required: 'Content is required' })}
                                                rows={5}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Write your post content..."
                                            />
                                            {errors.content && (
                                                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category
                                            </label>
                                            <select
                                                {...register('category')}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                defaultValue="general"
                                            >
                                                <option value="general">General</option>
                                                <option value="progress">Progress</option>
                                                <option value="meal">Meal</option>
                                                <option value="workout">Workout</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tags (comma separated)
                                            </label>
                                            <input
                                                {...register('tags')}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="fitness, health, workout"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Images
                                            </label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                {...register('images')}
                                                onChange={handleImageSelect}
                                                className="w-full"
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedImages.map((url, index) => (
                                                    <div key={index} className="relative">
                                                        <Image
                                                            src={url}
                                                            alt={`Selected image ${index + 1}`}
                                                            width={100}
                                                            height={100}
                                                            className="rounded-lg object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                        >
                                                            <XMarkIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowCreatePost(false)}
                                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                                    }`}

                                            >
                                                {isSubmitting ? 'Creating...' : 'Create Post'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Create Post Button */}
                <button
                    onClick={() => setShowCreatePost(true)}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors z-40"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
        </ClientOnly>
    );
} 