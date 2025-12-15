import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';

export default function WatchlistCreate() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.post('/watchlist/create', {
                name,
                description,
                is_public:  isPublic,
            });

            // Redirect to the watchlist detail page or back to watchlists overview
            navigate('/watchlists');
        } catch (err:  any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(err.message || 'An error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/watchlists')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Back to Watchlists</span>
                    </button>
                    <h1 className="text-2xl font-bold mb-2">Create New Watchlist</h1>
                    <p className="text-gray-600">Create a watchlist to track your favorite stocks</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Watchlist Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                maxLength={255}
                                placeholder="e.g., Tech Stocks, Growth Portfolio"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target. value)}
                                rows={4}
                                placeholder="Add a description to help you remember what this watchlist is for..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus: ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !name.trim()}
                                className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Watchlist'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/watchlists')}
                                disabled={isSubmitting}
                                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-2xl">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 Tips for creating watchlists</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Give your watchlist a clear, descriptive name</li>
                        <li>• Use descriptions to document your investment strategy or criteria</li>
                        <li>• Create separate watchlists for different investment themes or time horizons</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
