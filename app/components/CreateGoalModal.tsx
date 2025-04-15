import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createGoalSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters'),
    category: z.enum(['Weight Loss', 'Muscle Gain', 'Cardio', 'Strength', 'Nutrition', 'Mental Health', 'Other']),
    targetValue: z.number().positive('Target value must be positive'),
    currentValue: z.number().min(0, 'Current value must be non-negative').optional(),
    unit: z.string().min(1, 'Unit is required'),
    startDate: z.string(),
    targetDate: z.string(),
    reminders: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly', 'none']),
        time: z.string(),
        enabled: z.boolean()
    })
});

type CreateGoalForm = z.infer<typeof createGoalSchema>;

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGoalCreated?: () => void;
}

export default function CreateGoalModal({ isOpen, onClose, onGoalCreated }: CreateGoalModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateGoalForm>({
        resolver: zodResolver(createGoalSchema),
        defaultValues: {
            category: 'Other',
            currentValue: 0,
            reminders: {
                frequency: 'none',
                time: '09:00',
                enabled: false
            }
        }
    });

    const onSubmit = async (data: CreateGoalForm) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create goal');
            }

            toast.success('Goal created successfully!');
            reset();
            onClose();
            onGoalCreated?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create goal');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
                        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl relative"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Create New Goal</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        {...register('title')}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Enter goal title"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        {...register('description')}
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Describe your goal"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            {...register('category')}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Muscle Gain">Muscle Gain</option>
                                            <option value="Cardio">Cardio</option>
                                            <option value="Strength">Strength</option>
                                            <option value="Nutrition">Nutrition</option>
                                            <option value="Mental Health">Mental Health</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                                        <input
                                            type="text"
                                            {...register('unit')}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="e.g., kg, miles, minutes"
                                        />
                                        {errors.unit && (
                                            <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Target Value</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('targetValue', { valueAsNumber: true })}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.targetValue && (
                                            <p className="mt-1 text-sm text-red-600">{errors.targetValue.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Current Value</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            {...register('currentValue', { valueAsNumber: true })}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {errors.currentValue && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currentValue.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                        <input
                                            type="date"
                                            {...register('startDate')}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Target Date</label>
                                        <input
                                            type="date"
                                            {...register('targetDate')}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">Reminders</label>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            {...register('reminders.frequency')}
                                            className="block w-40 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="none">No reminders</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>

                                        <input
                                            type="time"
                                            {...register('reminders.time')}
                                            className="block w-32 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                        />

                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                {...register('reminders.enabled')}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">Enable reminders</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Goal'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
} 