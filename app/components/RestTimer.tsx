'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    PlayIcon,
    PauseIcon,
    ArrowPathIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';

interface RestTimerProps {
    defaultTime?: number; // in seconds
    onComplete?: () => void;
}

export default function RestTimer({ defaultTime = 60, onComplete }: RestTimerProps) {
    const [time, setTime] = useState(defaultTime);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for timer completion sound
        audioRef.current = new Audio('/timer-complete.mp3'); // You'll need to add this sound file
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isActive && time > 0) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        if (!isMuted && audioRef.current) {
                            audioRef.current.play();
                        }
                        if (onComplete) {
                            onComplete();
                        }
                        setIsActive(false);
                        clearInterval(timerRef.current!);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isActive, isMuted, onComplete]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setTime(defaultTime);
        setIsActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = (time / defaultTime) * 100;

    return (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-500/20">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Rest Timer</h3>
                <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-300"
                >
                    {isMuted ? (
                        <SpeakerXMarkIcon className="h-5 w-5" />
                    ) : (
                        <SpeakerWaveIcon className="h-5 w-5" />
                    )}
                </button>
            </div>

            <div className="relative w-48 h-48 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        className="stroke-current text-gray-700"
                        strokeWidth="12"
                        fill="none"
                    />
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        className="stroke-current text-violet-500"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={553}
                        strokeDashoffset={553 - (553 * progress) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-4xl font-bold text-white">{formatTime(time)}</span>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`p-3 rounded-full ${
                        isActive
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                    } text-white`}
                >
                    {isActive ? (
                        <PauseIcon className="h-6 w-6" />
                    ) : (
                        <PlayIcon className="h-6 w-6" />
                    )}
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetTimer}
                    className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                >
                    <ArrowPathIcon className="h-6 w-6" />
                </motion.button>
            </div>

            <div className="mt-6 flex justify-center space-x-2">
                {[30, 60, 90, 120].map((seconds) => (
                    <button
                        key={seconds}
                        onClick={() => {
                            setTime(seconds);
                            setIsActive(false);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm ${
                            time === seconds
                                ? 'bg-violet-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        {seconds}s
                    </button>
                ))}
            </div>
        </div>
    );
} 