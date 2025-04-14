'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    const router = useRouter();
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
                const response = await fetch('/api/auth/me');
                if (!response.ok) {
                    router.push('/login');
                    return;
                }
                const data = await response.json();
                setUserData(data.user);

                // Set user name from API response
                if (data.user.firstName) {
                    setUserName(data.user.firstName);
                } else if (data.user.name) {
                    setUserName(data.user.name);
                } else if (data.user.email) {
                    setUserName(data.user.email.split('@')[0]);
                } else {
                    setUserName('User');
                }

                setUserStatus('Active Now');
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-transparent ml-10 pt-10 relative overflow-hidden">
            {/* Sidebar Toggle Button (Mobile) */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="p-2 rounded-full bg-white text-black shadow-lg backdrop-blur-sm"
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
                        className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(17, 24, 39, 0.95) 100%)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <div className="flex flex-col h-full">
                            {/* Logo and Toggle */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        className="p-2 bg-white rounded-xl shadow-lg relative overflow-hidden"
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-white to-gray-200"
                                            animate={{
                                                backgroundPosition: ['0% 0%', '100% 100%'],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                            }}
                                            style={{
                                                backgroundSize: '200% 200%',
                                            }}
                                        />
                                        <SparklesIcon className="h-7 w-7 text-black relative z-10" />
                                    </motion.div>
                                    <span className="text-2xl font-bold text-white tracking-tight">HealthCare</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={toggleSidebar}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 text-white" />
                                </motion.button>
                            </div>

                            {/* User Profile */}
                            <div className="p-6 border-b border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        {userData?.avatar ? (
                                            <img
                                                src={userData.avatar}
                                                alt={userName}
                                                className="w-14 h-14 rounded-xl object-cover shadow-lg"
                                            />
                                        ) : (
                                            <motion.div
                                                className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-lg relative overflow-hidden"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-white to-gray-200"
                                                    animate={{
                                                        backgroundPosition: ['0% 0%', '100% 100%'],
                                                    }}
                                                    transition={{
                                                        duration: 3,
                                                        repeat: Infinity,
                                                        repeatType: "reverse",
                                                    }}
                                                    style={{
                                                        backgroundSize: '200% 200%',
                                                    }}
                                                />
                                                <UserIcon className="h-7 w-7 text-black relative z-10" />
                                            </motion.div>
                                        )}
                                        <motion.div
                                            className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-white rounded-full border-2 border-gray-800 shadow-lg"
                                            animate={{
                                                boxShadow: ['0 0 0 rgba(255,255,255,0)', '0 0 10px rgba(255,255,255,0.8)', '0 0 0 rgba(255,255,255,0)'],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        {isLoading ? (
                                            <div className="h-6 w-36 bg-gray-700/50 rounded-lg animate-pulse"></div>
                                        ) : (
                                            <h3 className="text-lg font-semibold text-white">{userName}</h3>
                                        )}
                                        <p className="text-sm text-white font-medium">{userStatus}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="flex-1 px-4 py-4 space-y-2">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = isActive ? item.activeIcon : item.icon;

                                    return (
                                        <Link key={item.name} href={item.href}>
                                            <motion.div
                                                whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-white to-gray-100 text-black shadow-lg border border-white/20 relative overflow-hidden'
                                                    : 'text-gray-300 hover:bg-white/10'
                                                    }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                                        style={{ boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.3)' }}
                                                    />
                                                )}
                                                <Icon className={`h-5 w-5 mr-3 ${isActive ? 'text-black' : 'text-gray-400'
                                                    }`} />
                                                <span className={`font-medium ${isActive ? 'text-black' : 'text-gray-300'
                                                    }`}>
                                                    {item.name}
                                                </span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeIndicator"
                                                        className="ml-auto w-2 h-2 rounded-full bg-black"
                                                        animate={{
                                                            scale: [1, 1.2, 1],
                                                            boxShadow: ['0 0 0 rgba(0,0,0,0)', '0 0 5px rgba(0,0,0,0.5)', '0 0 0 rgba(0,0,0,0)']
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut"
                                                        }}
                                                    />
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Bottom Section */}
                            <div className="p-6 border-t border-gray-700/50">
                                <motion.div
                                    className="bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm relative overflow-hidden"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"
                                        animate={{
                                            x: ['-100%', '100%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            repeatType: "loop",
                                        }}
                                    />
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-white">Health Tips</h4>
                                        <motion.div
                                            animate={{ rotate: [0, 15, 0] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                        >
                                            <BoltIcon className="h-5 w-5 text-white" />
                                        </motion.div>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-4">
                                        Stay hydrated! Drink at least 8 glasses of water daily for optimal health.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Updated daily</span>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-sm text-white hover:text-gray-300 font-medium"
                                        >
                                            More tips
                                        </motion.button>
                                    </div>
                                </motion.div>
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
                    className="fixed top-4 left-4 z-40 p-2 rounded-full bg-white text-black shadow-lg backdrop-blur-sm"
                >
                    <ChevronRightIcon className="h-5 w-5" />
                </motion.button>
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col overflow-hidden ${isSidebarOpen ? 'md:ml-72' : ''}`}>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>

            {/* AI Assistant */}
            <AIAssistant />
        </div>
    );
} 