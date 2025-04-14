'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HomeIcon,
    UserIcon,
    CalendarIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    BellIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    FireIcon,
    HeartIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    SparklesIcon,
    BoltIcon,
    TrophyIcon,
    StarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeSolidIcon,
    UserIcon as UserSolidIcon,
    CalendarIcon as CalendarSolidIcon,
    ChartBarIcon as ChartBarSolidIcon,
    Cog6ToothIcon as Cog6ToothSolidIcon,
    BellIcon as BellSolidIcon,
    ChatBubbleLeftRightIcon as ChatBubbleLeftRightSolidIcon,
    UserGroupIcon as UserGroupSolidIcon,
    FireIcon as FireSolidIcon,
    HeartIcon as HeartSolidIcon,
    ArrowTrendingUpIcon as ArrowTrendingUpSolidIcon,
    ArrowTrendingDownIcon as ArrowTrendingDownSolidIcon,
    SparklesIcon as SparklesSolidIcon,
    BoltIcon as BoltSolidIcon,
    TrophyIcon as TrophySolidIcon,
    StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import AIAssistant from '@/components/AIAssistant';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, activeIcon: UserSolidIcon },
    { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarIcon, activeIcon: CalendarSolidIcon },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, activeIcon: ChartBarSolidIcon },
    { name: 'Community', href: '/dashboard/community', icon: UserGroupIcon, activeIcon: UserGroupSolidIcon },
    { name: 'Goals', href: '/dashboard/goals', icon: TrophyIcon, activeIcon: TrophySolidIcon },
    { name: 'Fitness', href: '/dashboard/fitness', icon: FireIcon, activeIcon: FireSolidIcon },
    { name: 'Meal Prep', href: '/dashboard/meal-prep', icon: HeartIcon, activeIcon: HeartSolidIcon },
    { name: 'Workouts', href: '/dashboard/workouts', icon: BoltIcon, activeIcon: BoltSolidIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon, activeIcon: ChatBubbleLeftRightSolidIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, activeIcon: BellSolidIcon },
    { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothSolidIcon },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [userName, setUserName] = useState('Loading...');
    const [userStatus, setUserStatus] = useState('Online');
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const path = pathname.split('/')[2] || 'dashboard';
        setActiveSection(path);
    }, [pathname]);

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);

                // Fetch user data from the API
                const response = await fetch('/api/auth/me');

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setUserData(data);

                // Set user name from API response
                if (data.name) {
                    setUserName(data.name);
                } else if (data.firstName && data.lastName) {
                    setUserName(`${data.firstName} ${data.lastName}`);
                } else if (data.email) {
                    setUserName(data.email.split('@')[0]);
                } else {
                    setUserName('User');
                }

                // Set user status
                if (data.status) {
                    setUserStatus(data.status);
                } else if (data.isOnline) {
                    setUserStatus('Online');
                } else {
                    setUserStatus('Offline');
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserName('User');
                setUserStatus('Offline');
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 ml-10 mt-10">
            {/* Sidebar Toggle Button (Mobile) */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="p-2 rounded-full bg-primary-600 text-white shadow-lg"
                >
                    {isSidebarOpen ? (
                        <XMarkIcon className="h-6 w-6" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" />
                    )}
                </motion.button>
            </div>

            {/* Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto"
                        style={{
                            background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Logo and Toggle */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <div className="p-2 bg-white rounded-lg">
                                        <SparklesIcon className="h-6 w-6 text-primary-600" />
                                    </div>
                                    <span className="text-xl font-bold text-white">HealthCare</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleSidebar}
                                    className="p-1 rounded-full hover:bg-gray-700"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 text-white" />
                                </motion.button>
                            </div>

                            {/* User Profile */}
                            <div className="p-4 border-b border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        {userData?.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt={userName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
                                                <UserIcon className="h-6 w-6 text-white" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                                    </div>
                                    <div>
                                        {isLoading ? (
                                            <div className="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>
                                        ) : (
                                            <h3 className="font-medium text-white">{userName}</h3>
                                        )}
                                        <p className="text-xs text-green-400">{userStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = isActive ? item.activeIcon : item.icon;

                                    return (
                                        <Link key={item.name} href={item.href}>
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center px-3 py-3 rounded-lg transition-all duration-200 ${isActive
                                                    ? 'bg-white text-primary-900 shadow-md'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                                    }`}
                                            >
                                                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-primary-600' : 'text-gray-400'
                                                    }`} />
                                                <span className={`font-medium ${isActive ? 'text-primary-900' : 'text-gray-300'
                                                    }`}>
                                                    {item.name}
                                                </span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Bottom Section */}
                            <div className="p-4 border-t border-gray-700">
                                <div className="bg-gray-800 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-white">Health Tips</h4>
                                        <BoltIcon className="h-4 w-4 text-yellow-400" />
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">
                                        Stay hydrated! Drink at least 8 glasses of water daily for optimal health.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Updated daily</span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-xs text-blue-400 hover:text-blue-300"
                                        >
                                            More tips
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar Toggle Button (Desktop) */}
            {!isSidebarOpen && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-40 p-2 rounded-full bg-primary-600 text-white shadow-lg"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </motion.button>
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'md:ml-64' : ''}`}>
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* AI Assistant */}
            <AIAssistant />
        </div>
    );
} 