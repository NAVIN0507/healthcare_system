import { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import CreateGoalForm from './CreateGoalModal';
import toast from 'react-hot-toast';

interface Goal {
    _id: string;
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    progress: number;
    status: string;
    startDate: string;
    targetDate: string;
}

export default function GoalSection() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/goals');
            if (!response.ok) {
                throw new Error('Failed to fetch goals');
            }
            const data = await response.json();
            setGoals(data.goals);
        } catch (error) {
            toast.error('Failed to load goals');
            console.error('Error fetching goals:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Weight Loss': 'bg-pink-100 text-pink-800',
            'Muscle Gain': 'bg-purple-100 text-purple-800',
            'Cardio': 'bg-blue-100 text-blue-800',
            'Strength': 'bg-orange-100 text-orange-800',
            'Nutrition': 'bg-green-100 text-green-800',
            'Mental Health': 'bg-yellow-100 text-yellow-800',
            'Other': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['Other'];
    };

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'Not Started': 'bg-gray-100 text-gray-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            'On Track': 'bg-green-100 text-green-800',
            'Behind Schedule': 'bg-yellow-100 text-yellow-800',
            'Completed': 'bg-purple-100 text-purple-800',
            'Abandoned': 'bg-red-100 text-red-800'
        };
        return colors[status] || colors['Not Started'];
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Goals</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        {showForm ? 'Hide Form' : 'Add Goal'}
                    </button>
                </div>

                {showForm && (
                    <CreateGoalForm
                        onGoalCreated={() => {
                            fetchGoals();
                            setShowForm(false);
                        }}
                        onCancel={() => setShowForm(false)}
                    />
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : goals.length === 0 && !showForm ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No goals yet. Click the button above to create your first goal!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {goals.map((goal) => (
                            <div key={goal._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                                        {goal.category}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{goal.description}</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Progress</span>
                                        <span className="font-medium">{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 rounded-full h-2"
                                            style={{ width: `${goal.progress}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                                            {goal.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 