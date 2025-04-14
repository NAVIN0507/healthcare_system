'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    SunIcon,
    MoonIcon,
    ComputerDesktopIcon,
    SwatchIcon,
    BellIcon,
    BellSlashIcon,
    AdjustmentsHorizontalIcon,
    ArrowPathIcon,
    CheckIcon,
    XMarkIcon,
    PaintBrushIcon,
    ViewColumnsIcon,
    CursorArrowRaysIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    GlobeAltIcon,
    LanguageIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    SwatchIcon as SwatchSolidIcon,
    BellIcon as BellSolidIcon,
    BellSlashIcon as BellSlashSolidIcon,
    AdjustmentsHorizontalIcon as AdjustmentsHorizontalSolidIcon,
    PaintBrushIcon as PaintBrushSolidIcon,
    ViewColumnsIcon as ViewColumnsSolidIcon,
    CursorArrowRaysIcon as CursorArrowRaysSolidIcon,
    SpeakerWaveIcon as SpeakerWaveSolidIcon,
    SpeakerXMarkIcon as SpeakerXMarkSolidIcon,
    GlobeAltIcon as GlobeAltSolidIcon,
    LanguageIcon as LanguageSolidIcon,
    DocumentTextIcon as DocumentTextSolidIcon,
    ShieldCheckIcon as ShieldCheckSolidIcon,
    UserCircleIcon as UserCircleSolidIcon,
    Cog6ToothIcon as Cog6ToothSolidIcon,
} from '@heroicons/react/24/outline';
import {
    SunIcon as SunSolidIcon,
    MoonIcon as MoonSolidIcon,
    ComputerDesktopIcon as ComputerDesktopSolidIcon,
} from '@heroicons/react/24/solid';

// Define types for settings
type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
type LayoutStyle = 'default' | 'compact' | 'comfortable';
type FontSize = 'small' | 'medium' | 'large';
type AnimationLevel = 'none' | 'minimal' | 'full';

interface Settings {
    theme: ThemeMode;
    colorScheme: ColorScheme;
    layout: LayoutStyle;
    fontSize: FontSize;
    animations: AnimationLevel;
    notifications: boolean;
    sound: boolean;
    language: string;
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends';
        activitySharing: boolean;
        dataCollection: boolean;
    };
}

// Default settings
const defaultSettings: Settings = {
    theme: 'system',
    colorScheme: 'primary',
    layout: 'default',
    fontSize: 'medium',
    animations: 'full',
    notifications: true,
    sound: true,
    language: 'en',
    privacy: {
        profileVisibility: 'public',
        activitySharing: true,
        dataCollection: true,
    },
};

// Color scheme options
const colorSchemes: { name: ColorScheme; label: string; primary: string; secondary: string }[] = [
    { name: 'primary', label: 'Primary', primary: '#4F46E5', secondary: '#818CF8' },
    { name: 'secondary', label: 'Secondary', primary: '#7C3AED', secondary: '#A78BFA' },
    { name: 'accent', label: 'Accent', primary: '#EC4899', secondary: '#F472B6' },
    { name: 'success', label: 'Success', primary: '#10B981', secondary: '#34D399' },
    { name: 'warning', label: 'Warning', primary: '#F59E0B', secondary: '#FBBF24' },
    { name: 'danger', label: 'Danger', primary: '#EF4444', secondary: '#F87171' },
];

// Language options
const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
];

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [activeTab, setActiveTab] = useState<string>('appearance');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Load settings from localStorage on component mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                setSettings(JSON.parse(savedSettings));
            } catch (error) {
                console.error('Error parsing saved settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage
    const saveSettings = () => {
        setIsSaving(true);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            localStorage.setItem('userSettings', JSON.stringify(settings));

            // Apply theme changes
            if (settings.theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else if (settings.theme === 'light') {
                document.documentElement.classList.remove('dark');
            } else {
                // System preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }

            // Apply color scheme
            document.documentElement.style.setProperty('--primary-color', colorSchemes.find(scheme => scheme.name === settings.colorScheme)?.primary || '#4F46E5');
            document.documentElement.style.setProperty('--secondary-color', colorSchemes.find(scheme => scheme.name === settings.colorScheme)?.secondary || '#818CF8');

            // Apply font size
            document.documentElement.style.setProperty('--font-size-base',
                settings.fontSize === 'small' ? '14px' :
                    settings.fontSize === 'large' ? '18px' : '16px'
            );

            // Apply animations
            if (settings.animations === 'none') {
                document.documentElement.classList.add('reduce-motion');
            } else {
                document.documentElement.classList.remove('reduce-motion');
            }

            // Show success message
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setSaveError('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle setting changes
    const handleSettingChange = (category: string, setting: string, value: any) => {
        setSettings(prev => {
            if (category === 'privacy') {
                return {
                    ...prev,
                    privacy: {
                        ...prev.privacy,
                        [setting]: value
                    }
                };
            }
            return {
                ...prev,
                [setting]: value
            };
        });
    };

    // Reset settings to default
    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('userSettings');
        setTimeout(() => {
            saveSettings();
        }, 100);
    };

    // Navigation tabs
    const tabs = [
        { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon, activeIcon: PaintBrushSolidIcon },
        { id: 'layout', name: 'Layout', icon: ViewColumnsIcon, activeIcon: ViewColumnsSolidIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon, activeIcon: BellSolidIcon },
        { id: 'accessibility', name: 'Accessibility', icon: CursorArrowRaysIcon, activeIcon: CursorArrowRaysSolidIcon },
        { id: 'sound', name: 'Sound', icon: SpeakerWaveIcon, activeIcon: SpeakerWaveSolidIcon },
        { id: 'language', name: 'Language', icon: LanguageIcon, activeIcon: LanguageSolidIcon },
        { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon, activeIcon: ShieldCheckSolidIcon },
        { id: 'account', name: 'Account', icon: UserCircleIcon, activeIcon: UserCircleSolidIcon },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">Settings</h1>
                    <p className="mt-2 text-gray-600">
                        Customize your experience and manage your preferences
                    </p>
                </motion.div>

                {/* Success/Error Messages */}
                <AnimatePresence>
                    {saveSuccess && (
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
                                <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
                            </div>
                        </motion.div>
                    )}

                    {saveError && (
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
                                <p className="text-sm font-medium text-red-800">{saveError}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar Navigation */}
                        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100">
                            <nav className="p-4 space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = activeTab === tab.id ? tab.activeIcon : tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon className={`h-5 w-5 mr-3 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                                            <span className="font-medium">{tab.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-6">
                            <AnimatePresence mode="wait">
                                {/* Appearance Settings */}
                                {activeTab === 'appearance' && (
                                    <motion.div
                                        key="appearance"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Theme</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Choose your preferred color theme
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => handleSettingChange('', 'theme', 'light')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.theme === 'light'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <SunIcon className={`h-8 w-8 mb-2 ${settings.theme === 'light' ? 'text-primary-600' : 'text-gray-400'
                                                        }`} />
                                                    <span className={`text-sm font-medium ${settings.theme === 'light' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Light</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'theme', 'dark')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.theme === 'dark'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <MoonIcon className={`h-8 w-8 mb-2 ${settings.theme === 'dark' ? 'text-primary-600' : 'text-gray-400'
                                                        }`} />
                                                    <span className={`text-sm font-medium ${settings.theme === 'dark' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Dark</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'theme', 'system')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.theme === 'system'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <ComputerDesktopIcon className={`h-8 w-8 mb-2 ${settings.theme === 'system' ? 'text-primary-600' : 'text-gray-400'
                                                        }`} />
                                                    <span className={`text-sm font-medium ${settings.theme === 'system' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>System</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Color Scheme</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Choose your preferred color palette
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                                {colorSchemes.map((scheme) => (
                                                    <button
                                                        key={scheme.name}
                                                        onClick={() => handleSettingChange('', 'colorScheme', scheme.name)}
                                                        className={`flex flex-col items-center p-3 rounded-xl border ${settings.colorScheme === scheme.name
                                                                ? 'border-primary-500 ring-2 ring-primary-200'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="w-8 h-8 rounded-full mb-2" style={{
                                                            background: `linear-gradient(135deg, ${scheme.primary}, ${scheme.secondary})`
                                                        }} />
                                                        <span className={`text-xs font-medium ${settings.colorScheme === scheme.name ? 'text-primary-700' : 'text-gray-700'
                                                            }`}>{scheme.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Font Size</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Adjust the text size throughout the application
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => handleSettingChange('', 'fontSize', 'small')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.fontSize === 'small'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.fontSize === 'small' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Small</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'fontSize', 'medium')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.fontSize === 'medium'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.fontSize === 'medium' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Medium</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'fontSize', 'large')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.fontSize === 'large'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.fontSize === 'large' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Large</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Animations</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Control the level of animations in the application
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => handleSettingChange('', 'animations', 'none')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.animations === 'none'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.animations === 'none' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>None</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'animations', 'minimal')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.animations === 'minimal'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.animations === 'minimal' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Minimal</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'animations', 'full')}
                                                    className={`flex items-center justify-center p-3 rounded-xl border ${settings.animations === 'full'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <span className={`text-sm font-medium ${settings.animations === 'full' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Full</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Layout Settings */}
                                {activeTab === 'layout' && (
                                    <motion.div
                                        key="layout"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Layout Style</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Choose how content is displayed
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <button
                                                    onClick={() => handleSettingChange('', 'layout', 'default')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.layout === 'default'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                        <div className="w-3/4 h-8 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <span className={`text-sm font-medium ${settings.layout === 'default' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Default</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'layout', 'compact')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.layout === 'compact'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <span className={`text-sm font-medium ${settings.layout === 'compact' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Compact</span>
                                                </button>
                                                <button
                                                    onClick={() => handleSettingChange('', 'layout', 'comfortable')}
                                                    className={`flex flex-col items-center p-4 rounded-xl border ${settings.layout === 'comfortable'
                                                            ? 'border-primary-500 bg-primary-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-full h-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                                                        <div className="w-3/4 h-10 bg-gray-300 rounded"></div>
                                                    </div>
                                                    <span className={`text-sm font-medium ${settings.layout === 'comfortable' ? 'text-primary-700' : 'text-gray-700'
                                                        }`}>Comfortable</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Notifications Settings */}
                                {activeTab === 'notifications' && (
                                    <motion.div
                                        key="notifications"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Notification Preferences</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Control how you receive notifications
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Enable Notifications</p>
                                                        <p className="text-xs text-gray-500">Receive notifications for important updates</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={settings.notifications}
                                                            onChange={() => handleSettingChange('', 'notifications', !settings.notifications)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Accessibility Settings */}
                                {activeTab === 'accessibility' && (
                                    <motion.div
                                        key="accessibility"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Accessibility Options</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Customize the application for better accessibility
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">High Contrast Mode</p>
                                                        <p className="text-xs text-gray-500">Increase contrast for better visibility</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Screen Reader Optimization</p>
                                                        <p className="text-xs text-gray-500">Optimize for screen readers</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Sound Settings */}
                                {activeTab === 'sound' && (
                                    <motion.div
                                        key="sound"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Sound Settings</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Control sound effects and notifications
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Enable Sound</p>
                                                        <p className="text-xs text-gray-500">Play sound effects for interactions</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={settings.sound}
                                                            onChange={() => handleSettingChange('', 'sound', !settings.sound)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Language Settings */}
                                {activeTab === 'language' && (
                                    <motion.div
                                        key="language"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Language</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Select your preferred language
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {languages.map((language) => (
                                                    <button
                                                        key={language.code}
                                                        onClick={() => handleSettingChange('', 'language', language.code)}
                                                        className={`flex items-center p-3 rounded-xl border ${settings.language === language.code
                                                                ? 'border-primary-500 bg-primary-50'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <span className={`text-sm font-medium ${settings.language === language.code ? 'text-primary-700' : 'text-gray-700'
                                                            }`}>{language.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Privacy Settings */}
                                {activeTab === 'privacy' && (
                                    <motion.div
                                        key="privacy"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Privacy Settings</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Control your privacy and data sharing preferences
                                            </p>
                                            <div className="space-y-4">
                                                <div className="p-3 bg-white rounded-lg border border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Profile Visibility</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                        <button
                                                            onClick={() => handleSettingChange('privacy', 'profileVisibility', 'public')}
                                                            className={`p-2 rounded-lg text-center ${settings.privacy.profileVisibility === 'public'
                                                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                                                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                                                                }`}
                                                        >
                                                            Public
                                                        </button>
                                                        <button
                                                            onClick={() => handleSettingChange('privacy', 'profileVisibility', 'friends')}
                                                            className={`p-2 rounded-lg text-center ${settings.privacy.profileVisibility === 'friends'
                                                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                                                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                                                                }`}
                                                        >
                                                            Friends Only
                                                        </button>
                                                        <button
                                                            onClick={() => handleSettingChange('privacy', 'profileVisibility', 'private')}
                                                            className={`p-2 rounded-lg text-center ${settings.privacy.profileVisibility === 'private'
                                                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                                                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                                                                }`}
                                                        >
                                                            Private
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Activity Sharing</p>
                                                        <p className="text-xs text-gray-500">Share your activity with friends</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={settings.privacy.activitySharing}
                                                            onChange={() => handleSettingChange('privacy', 'activitySharing', !settings.privacy.activitySharing)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">Data Collection</p>
                                                        <p className="text-xs text-gray-500">Allow collection of usage data to improve the app</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            checked={settings.privacy.dataCollection}
                                                            onChange={() => handleSettingChange('privacy', 'dataCollection', !settings.privacy.dataCollection)}
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Account Settings */}
                                {activeTab === 'account' && (
                                    <motion.div
                                        key="account"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-lg border border-gray-100 shadow-sm">
                                            <h4 className="text-md font-medium text-gray-900 mb-2">Account Settings</h4>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Manage your account information and security
                                            </p>
                                            <div className="space-y-4">
                                                <div className="p-3 bg-white rounded-lg border border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Account Actions</p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        <button
                                                            onClick={() => router.push('/dashboard/profile')}
                                                            className="p-2 rounded-lg text-center bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                        >
                                                            Edit Profile
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-lg text-center bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                        >
                                                            Change Password
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-lg text-center bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                        >
                                                            Two-Factor Authentication
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-lg text-center bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                                        >
                                                            Delete Account
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <button
                            onClick={resetSettings}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                        >
                            Reset to Default
                        </button>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => router.back()}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSettings}
                                disabled={isSaving}
                                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <span className="flex items-center">
                                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Saving...
                                    </span>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 