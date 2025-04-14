'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftIcon, XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesSolidIcon } from '@heroicons/react/24/solid';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showWelcome, setShowWelcome] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setShowWelcome(false);
        setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
        setIsLoading(true);

        try {
            const response = await simulateAIResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateAIResponse = async (userInput: string): Promise<string> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const lowerInput = userInput.toLowerCase();

        if (lowerInput.includes('workout') || lowerInput.includes('exercise')) {
            return `Based on your request about fitness, here's a suggested workout plan:
1. Start with a 5-minute warm-up
2. Do 3 sets of 12 reps for each exercise
3. Include exercises like push-ups, squats, and planks
4. Cool down with stretching

Would you like me to provide more specific exercises or focus on a particular area?`;
        }

        if (lowerInput.includes('meal') || lowerInput.includes('food') || lowerInput.includes('diet')) {
            return `Here's a balanced meal plan suggestion:
1. Breakfast: Oatmeal with fruits and nuts
2. Lunch: Grilled chicken salad with olive oil dressing
3. Dinner: Baked salmon with quinoa and vegetables
4. Snacks: Greek yogurt, fruits, or nuts

Would you like me to adjust this plan based on your dietary preferences or goals?`;
        }

        if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
            return `I can help you with:
1. Creating personalized workout plans
2. Suggesting meal plans and recipes
3. Providing nutrition advice
4. Tracking fitness goals
5. Offering exercise modifications

Just ask me about any of these topics!`;
        }

        return `I can help you with fitness and meal planning. Would you like to:
1. Get a workout plan
2. Get a meal plan
3. Learn about nutrition
4. Get exercise recommendations

Just let me know what you're interested in!`;
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 z-50"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                            <div className="flex items-center gap-2">
                                <SparklesSolidIcon className="h-6 w-6 text-yellow-300" />
                                <h3 className="font-semibold">AI Health Assistant</h3>
                            </div>
                            <p className="text-sm text-primary-100 mt-1">Ask me about fitness and meal planning</p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {showWelcome && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-lg"
                                >
                                    <h4 className="font-medium text-primary-900 mb-2">👋 Welcome!</h4>
                                    <p className="text-sm text-primary-700">
                                        I'm your AI health assistant. I can help you with:
                                    </p>
                                    <ul className="mt-2 text-sm text-primary-700 space-y-1">
                                        <li>• Personalized workout plans</li>
                                        <li>• Meal planning and nutrition advice</li>
                                        <li>• Fitness tracking and goals</li>
                                        <li>• Exercise modifications</li>
                                    </ul>
                                </motion.div>
                            )}

                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${message.role === 'user'
                                                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                                                : 'bg-gray-50 text-gray-800 border border-gray-100'
                                            }`}
                                    >
                                        <p className="text-sm">{message.content}</p>
                                        <span className="text-xs opacity-70 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-50 text-gray-800 p-3 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" />
                                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-100" />
                                            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about fitness or meal planning..."
                                    className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                />
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
} 