'use client';

import { useState } from 'react';
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Here you would typically make an API call to your AI backend
            // For now, we'll simulate a response
            const response = await simulateAIResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        } catch (error) {
            console.error('Error getting AI response:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateAIResponse = async (userInput: string): Promise<string> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const lowerInput = userInput.toLowerCase();

        // Basic response logic
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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
            >
                {isOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                ) : (
                    <ChatBubbleLeftIcon className="h-6 w-6" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
                    {/* Header */}
                    <div className="p-4 bg-primary-600 text-white rounded-t-lg">
                        <h3 className="font-semibold">AI Health Assistant</h3>
                        <p className="text-sm text-primary-100">Ask me about fitness and meal planning</p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about fitness or meal planning..."
                                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
} 