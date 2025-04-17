'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, BoltIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

const FloatingIcon = ({ icon: Icon, delay = 0, duration = 3, x = 0, y = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
                x: [x, x + 20, x],
                y: [y, y - 20, y],
            }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute"
        >
            <Icon className="w-8 h-8 text-primary-600" />
        </motion.div>
    );
};

const PulseCircle = ({ size = 100, delay = 0 }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
            }}
            transition={{
                duration: 3,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute rounded-full border-2 border-primary-600"
            style={{ width: size, height: size }}
        />
    );
};

const AnimatedLine = ({ delay = 0 }) => {
    return (
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0],
            }}
            transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-primary-600 to-transparent"
            style={{ width: '100%' }}
        />
    );
};

export default function HealthVisualization() {
    const [activeAnimation, setActiveAnimation] = useState('pulse');
    const containerRef = useRef(null);

    const animations = {
        pulse: {
            title: "Health Pulse",
            description: "Your wellness journey in motion",
            icons: [
                { icon: HeartIcon, x: 20, y: 20, delay: 0 },
                { icon: BoltIcon, x: -20, y: -20, delay: 0.5 },
                { icon: SparklesIcon, x: 20, y: -20, delay: 1 },
                { icon: StarIcon, x: -20, y: 20, delay: 1.5 },
            ]
        },
        waves: {
            title: "Energy Waves",
            description: "Flowing through your daily activities",
            lines: Array(5).fill(null).map((_, i) => ({ delay: i * 0.4 }))
        },
        circles: {
            title: "Vitality Circles",
            description: "Expanding your health horizons",
            circles: Array(3).fill(null).map((_, i) => ({ size: 100 + i * 50, delay: i * 0.5 }))
        }
    };

    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center z-10">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-2xl font-bold text-white mb-2"
                    >
                        {animations[activeAnimation].title}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-300"
                    >
                        {animations[activeAnimation].description}
                    </motion.p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeAnimation === 'pulse' && (
                    <motion.div
                        key="pulse"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        {animations.pulse.icons.map((icon, index) => (
                            <FloatingIcon key={index} {...icon} />
                        ))}
                    </motion.div>
                )}

                {activeAnimation === 'waves' && (
                    <motion.div
                        key="waves"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        {animations.waves.lines.map((line, index) => (
                            <AnimatedLine key={index} {...line} />
                        ))}
                    </motion.div>
                )}

                {activeAnimation === 'circles' && (
                    <motion.div
                        key="circles"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {animations.circles.circles.map((circle, index) => (
                            <PulseCircle key={index} {...circle} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 flex space-x-2">
                {Object.keys(animations).map((animation) => (
                    <motion.button
                        key={animation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveAnimation(animation)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeAnimation === animation
                            ? 'bg-primary-600 text-white'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {animation.charAt(0).toUpperCase() + animation.slice(1)}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
} 