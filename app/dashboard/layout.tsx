'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    FireIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    ChartBarIcon,
    FlagIcon,
    UserCircleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Fitness', href: '/dashboard/fitness', icon: FireIcon },
        { name: 'Meal Prep', href: '/dashboard/meal-prep', icon: ClipboardDocumentListIcon },
        { name: 'Community', href: '/dashboard/community', icon: UserGroupIcon },
        { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
        { name: 'Goals', href: '/dashboard/goals', icon: FlagIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    type="button"
                    className="p-2 rounded-md text-gray-700 bg-white shadow-md"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? (
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Sidebar for mobile */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-xl">
                    <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
                        <h1 className="text-xl font-bold text-white">HealthCare</h1>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="px-2 space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                            ? 'bg-primary-100 text-primary-700'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                                            }`}
                                    >
                                        <item.icon
                                            className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                                                }`}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 p-4 border-t border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {user?.avatar ? (
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={user.avatar}
                                        alt={user.firstName}
                                    />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                        <UserCircleIcon className="h-8 w-8 text-primary-600" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-700">
                                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                                </p>
                                <Link
                                    href="/dashboard/profile"
                                    className="text-xs font-medium text-primary-600 hover:text-primary-500"
                                >
                                    View profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
                <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
                    <h1 className="text-xl font-bold text-white">HealthCare</h1>
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                                            }`}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex-shrink-0 p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {user?.avatar ? (
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatar}
                                    alt={user.firstName}
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                    <UserCircleIcon className="h-8 w-8 text-primary-600" />
                                </div>
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">
                                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                            </p>
                            <Link
                                href="/dashboard/profile"
                                className="text-xs font-medium text-primary-600 hover:text-primary-500"
                            >
                                View profile
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
} 