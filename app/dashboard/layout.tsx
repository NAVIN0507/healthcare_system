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
import AIAssistant from '@/app/components/AIAssistant';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, activeIcon: HomeSolidIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, activeIcon: UserSolidIcon },
    { name: 'Community', href: '/dashboard/community', icon: UserGroupIcon, activeIcon: UserGroupSolidIcon },
    { name: 'Goals', href: '/dashboard/goals', icon: TrophyIcon, activeIcon: TrophySolidIcon },
    { name: 'Fitness', href: '/dashboard/fitness', icon: FireIcon, activeIcon: FireSolidIcon },
    { name: 'Meal Prep', href: '/dashboard/meal-prep', icon: HeartIcon, activeIcon: HeartSolidIcon },
    { name: 'Workouts', href: '/dashboard/workouts', icon: BoltIcon, activeIcon: BoltSolidIcon }
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
        <div className="flex h-screen bg-transparent">
            {/* Sidebar Toggle Button (Mobile) */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg bg-white text-gray-700 shadow-sm"
                >
                    {isSidebarOpen ? (
                        <XMarkIcon className="h-5 w-5" />
                    ) : (
                        <Bars3Icon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 flex-shrink-0`}>
                <div className="h-full bg-white border-r border-gray-200">
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="px-6 py-5 border-b border-gray-200">
                            <div className="flex items-center">
                                <SparklesIcon className="h-6 w-6 text-primary-600" />
                                <span className="ml-3 text-lg font-semibold text-gray-900">HealthCare</span>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">{userName}</h3>
                                    <p className="text-xs text-gray-500">{userStatus}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-3 py-4">
                            <div className="space-y-1">
                                {navigation.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = isActive ? item.activeIcon : item.icon;

                                    return (
                                        <Link key={item.name} href={item.href}>
                                            <div className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}>
                                                <Icon className={`flex-shrink-0 h-5 w-5 mr-3 transition-colors ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                                                    }`} />
                                                {item.name}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Simple Health Tip */}
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <BoltIcon className="h-4 w-4 text-primary-600" />
                                    <h4 className="ml-2 text-xs font-medium text-gray-900">Daily Tip</h4>
                                </div>
                                <p className="text-xs text-gray-600">
                                    Stay hydrated! Drink at least 8 glasses of water daily.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:pl-64">
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* AI Assistant */}
            <AIAssistant />
        </div>
    );
} 