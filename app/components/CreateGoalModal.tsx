'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CreateGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateGoalModal({ isOpen, onClose, onSuccess }: CreateGoalModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        targetValue: '',
        currentValue: '',
        unit: '',
        targetDate: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    targetValue: parseFloat(formData.targetValue),
                    currentValue: formData.currentValue ? parseFloat(formData.currentValue) : 0,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create goal');
            }

            onSuccess();
            onClose();
            setFormData({
                title: '',
                description: '',
                category: 'Other',
                targetValue: '',
                currentValue: '',
                unit: '',
                targetDate: ''
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to create goal');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                                            Create New Goal
                                        </Dialog.Title>
                                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                            {error && (
                                                <div className="rounded-md bg-red-50 p-4 mb-4">
                                                    <p className="text-sm text-red-700">{error}</p>
                                                </div>
                                            )}
                                            <div>
                                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                                    Title
                                                </label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={formData.title}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                                    Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    id="description"
                                                    required
                                                    rows={3}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                                    Category
                                                </label>
                                                <select
                                                    name="category"
                                                    id="category"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={formData.category}
                                                    onChange={handleChange}
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">
                                                        Target Value
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="targetValue"
                                                        id="targetValue"
                                                        required
                                                        step="any"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={formData.targetValue}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700">
                                                        Current Value
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="currentValue"
                                                        id="currentValue"
                                                        step="any"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                        value={formData.currentValue}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                                                    Unit
                                                </label>
                                                <input
                                                    type="text"
                                                    name="unit"
                                                    id="unit"
                                                    required
                                                    placeholder="e.g., kg, miles, minutes"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={formData.unit}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700">
                                                    Target Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="targetDate"
                                                    id="targetDate"
                                                    required
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                    value={formData.targetDate}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Creating...' : 'Create Goal'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                                    onClick={onClose}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
} 