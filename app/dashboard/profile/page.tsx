'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    MapPinIcon,
    HeartIcon,
    ScaleIcon,
    BeakerIcon,
    ShieldCheckIcon,
    KeyIcon,
    BellIcon,
    CogIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    PhotoIcon,
    ArrowPathIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import {
    UserCircleIcon as UserCircleSolidIcon,
    EnvelopeIcon as EnvelopeSolidIcon,
    PhoneIcon as PhoneSolidIcon,
    CalendarIcon as CalendarSolidIcon,
    MapPinIcon as MapPinSolidIcon,
    HeartIcon as HeartSolidIcon,
    ScaleIcon as ScaleSolidIcon,
    BeakerIcon as BeakerSolidIcon,
    ShieldCheckIcon as ShieldCheckSolidIcon,
    KeyIcon as KeySolidIcon,
    BellIcon as BellSolidIcon,
    CogIcon as CogSolidIcon
} from '@heroicons/react/24/solid';

export default function ProfilePage() {
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [avatarHover, setAvatarHover] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
                setEditForm(data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            setErrorMessage('');
            setSuccessMessage('');

            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setUserData(data.user);
            setSuccessMessage('Profile updated successfully!');
            setIsEditing(false);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error: any) {
            setErrorMessage(error.message);
        }
    };

    const handleCancelEdit = () => {
        setEditForm(userData);
        setIsEditing(false);
        setErrorMessage('');
    };

    const handleRefreshData = async () => {
        setIsRefreshing(true);
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                throw new Error('Failed to refresh data');
            }
            const data = await response.json();
            setUserData(data.user);
            setEditForm(data.user);
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            id: 'personal',
            name: 'Personal Info',
            icon: UserCircleIcon,
            activeIcon: UserCircleSolidIcon,
            description: 'Basic information about you'
        },
        {
            id: 'health',
            name: 'Health Details',
            icon: HeartIcon,
            activeIcon: HeartSolidIcon,
            description: 'Your health metrics and history'
        },
        {
            id: 'security',
            name: 'Security',
            icon: ShieldCheckIcon,
            activeIcon: ShieldCheckSolidIcon,
            description: 'Manage your account security'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 flex justify-between items-center"
                >
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Profile</h1>
                        <p className="mt-3 text-lg text-gray-600">
                            Manage your personal information and account settings
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefreshData}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                    >
                        <ArrowPathIcon className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </motion.button>
                </motion.div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center shadow-sm"
                        >
                            <div className="flex-shrink-0">
                                <CheckIcon className="h-5 w-5 text-green-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                        </motion.div>
                    )}

                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center shadow-sm"
                        >
                            <div className="flex-shrink-0">
                                <XMarkIcon className="h-5 w-5 text-red-500" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="p-8 bg-gradient-to-br from-primary-500/10 to-primary-600/5">
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className="relative"
                                        onHoverStart={() => setAvatarHover(true)}
                                        onHoverEnd={() => setAvatarHover(false)}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white text-6xl font-bold shadow-xl ring-4 ring-white">
                                            {userData?.firstName ? userData.firstName.charAt(0) : 'U'}
                                        </div>
                                        <AnimatePresence>
                                            {avatarHover && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50"
                                                >
                                                    <button className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform">
                                                        <PhotoIcon className="h-5 w-5 text-primary-600" />
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    <h2 className="text-2xl font-bold text-gray-900 mt-6">
                                        {userData?.firstName} {userData?.lastName}
                                    </h2>
                                    <p className="text-lg text-gray-500 mt-2">{userData?.email}</p>
                                    <div className="mt-6 flex items-center text-sm text-primary-600 bg-primary-50 px-4 py-2 rounded-full shadow-sm">
                                        <div className="w-2 h-2 rounded-full bg-primary-500 mr-2 animate-pulse"></div>
                                        Active Now
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-200">
                                <nav className="px-4 py-6">
                                    <ul className="space-y-4">
                                        {tabs.map((tab) => {
                                            const Icon = tab.icon;
                                            const ActiveIcon = tab.activeIcon;
                                            const isActive = activeTab === tab.id;

                                            return (
                                                <motion.li
                                                    key={tab.id}
                                                    whileHover={{ x: 5 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                >
                                                    <button
                                                        onClick={() => setActiveTab(tab.id)}
                                                        className={`w-full flex flex-col px-4 py-4 rounded-xl text-sm transition-all duration-200 ${isActive
                                                                ? 'bg-primary-50 text-primary-700 shadow-sm'
                                                                : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center">
                                                            {isActive ? (
                                                                <ActiveIcon className="h-5 w-5 mr-3 text-primary-600" />
                                                            ) : (
                                                                <Icon className="h-5 w-5 mr-3 text-gray-400" />
                                                            )}
                                                            <span className="font-medium">{tab.name}</span>
                                                        </div>
                                                        <p className={`mt-1 ml-8 text-xs ${isActive ? 'text-primary-600/70' : 'text-gray-500'}`}>
                                                            {tab.description}
                                                        </p>
                                                    </button>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {tabs.find(tab => tab.id === activeTab)?.name}
                                    </h3>
                                    <SparklesIcon className="h-6 w-6 text-primary-500 ml-2" />
                                </div>
                                {!isEditing ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                    >
                                        <PencilIcon className="h-4 w-4 mr-2" />
                                        Edit
                                    </motion.button>
                                ) : (
                                    <div className="flex space-x-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCancelEdit}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                        >
                                            <XMarkIcon className="h-4 w-4 mr-2" />
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSaveProfile}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                        >
                                            <CheckIcon className="h-4 w-4 mr-2" />
                                            Save
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                {/* Personal Info Tab */}
                                <AnimatePresence mode="wait">
                                    {activeTab === 'personal' && (
                                        <motion.div
                                            key="personal"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        First Name
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="firstName"
                                                            value={editForm.firstName || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.firstName || 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Last Name
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            name="lastName"
                                                            value={editForm.lastName || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.lastName || 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Email
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={editForm.email || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Phone
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="tel"
                                                            name="phone"
                                                            value={editForm.phone || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.phone || 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Date of Birth
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="date"
                                                            name="dateOfBirth"
                                                            value={editForm.dateOfBirth ? new Date(editForm.dateOfBirth).toISOString().split('T')[0] : ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">
                                                            {userData?.dateOfBirth
                                                                ? new Date(userData.dateOfBirth).toLocaleDateString()
                                                                : 'Not provided'}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Gender
                                                    </label>
                                                    {isEditing ? (
                                                        <select
                                                            name="gender"
                                                            value={editForm.gender || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        >
                                                            <option value="">Select gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                                        </select>
                                                    ) : (
                                                        <p className="text-gray-900">
                                                            {userData?.gender
                                                                ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1)
                                                                : 'Not provided'}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Health Details Tab */}
                                    {activeTab === 'health' && (
                                        <motion.div
                                            key="health"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Height (cm)
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            name="height"
                                                            value={editForm.height || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.height ? `${userData.height} cm` : 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Weight (kg)
                                                    </label>
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            name="weight"
                                                            value={editForm.weight || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.weight ? `${userData.weight} kg` : 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Blood Type
                                                    </label>
                                                    {isEditing ? (
                                                        <select
                                                            name="bloodType"
                                                            value={editForm.bloodType || ''}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        >
                                                            <option value="">Select blood type</option>
                                                            <option value="A+">A+</option>
                                                            <option value="A-">A-</option>
                                                            <option value="B+">B+</option>
                                                            <option value="B-">B-</option>
                                                            <option value="AB+">AB+</option>
                                                            <option value="AB-">AB-</option>
                                                            <option value="O+">O+</option>
                                                            <option value="O-">O-</option>
                                                        </select>
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.bloodType || 'Not provided'}</p>
                                                    )}
                                                </div>
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Allergies
                                                    </label>
                                                    {isEditing ? (
                                                        <textarea
                                                            name="allergies"
                                                            value={editForm.allergies || ''}
                                                            onChange={handleInputChange}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.allergies || 'None'}</p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Past Medical Issues
                                                    </label>
                                                    {isEditing ? (
                                                        <textarea
                                                            name="pastMedicalIssues"
                                                            value={editForm.pastMedicalIssues || ''}
                                                            onChange={handleInputChange}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.pastMedicalIssues || 'None'}</p>
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Current Health Issues
                                                    </label>
                                                    {isEditing ? (
                                                        <textarea
                                                            name="currentHealthIssues"
                                                            value={editForm.currentHealthIssues || ''}
                                                            onChange={handleInputChange}
                                                            rows={3}
                                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-900">{userData?.currentHealthIssues || 'None'}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === 'security' && (
                                        <motion.div
                                            key="security"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                                <h4 className="text-md font-medium text-gray-900 mb-2">Change Password</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Update your password to keep your account secure
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                                >
                                                    Change Password
                                                </motion.button>
                                            </div>
                                            <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                                <h4 className="text-md font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Add an extra layer of security to your account
                                                </p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300"
                                                >
                                                    Enable 2FA
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 