import React from 'react';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    className?: string;
}

export default function Logo({ size = 'medium', className = '' }: LogoProps) {
    // Size classes for different logo sizes
    const sizeClasses = {
        small: 'text-xl',
        medium: 'text-2xl',
        large: 'text-3xl',
    };

    return (
        <div className={`flex items-center ${sizeClasses[size]} ${className}`}>
            <div className="relative mr-2 border-2 border-white rounded-full">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 "></div>
            </div>
            <span className="font-bold text-white">Wellnest</span>
        </div>
    );
} 