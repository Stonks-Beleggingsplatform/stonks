import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { Modal } from '../Modal';

export default function WatchlistEdit() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState<App.DTO.WatchlistDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Form state
    const [name, setName] = useState('');

    useEffect(() => {
        if (id) {
            fetchWatchlist();
        }
    }, [id]);

    const fetchWatchlist = async () => {
        try {
            const response = await api.get(`/watchlist/${id}`);
            setWatchlist(response.data);
            setName(response. data.name);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Watchlist not found');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to edit this watchlist');
            } else {
                setError(err.response?.data?.message || 'Failed to load watchlist');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Watchlist name is required');
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            await api.put(`/watchlist/${id}/update`, {
                name: name.trim(),
            });

            // Navigate back to watchlist detail page
            navigate(`/watchlists/${id}`);
        } catch (err: any) {
            console.error('Failed to update watchlist:', err);
            setError(err.response?.data?.message || 'Failed to update watchlist');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        setError('');

        try {
            await api.delete(`/watchlist/${id}/delete`);
            // Navigate back to watchlists overview
            navigate('/watchlists');
        } catch (err: any) {
            console.error('Failed to delete watchlist:', err);
            setError(err.response?.data?.message || 'Failed to delete watchlist');
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading watchlist...</div>
                </div>
            </div>
        );
    }

    if (error && !watchlist) {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
                <button
                    onClick={() => navigate('/watchlists')}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
                >
                    <span>←</span>
                    <span>Back to Watchlists</span>
                </button>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div>
            <main className="max-w-3xl mx-auto px-4 sm: px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/watchlists/${id}`)}
                        className="text-sm text-gray-600 hover: text-gray-900 transition-colors mb-4 flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Back to Watchlist</span>
                    </button>

                    <h1 className="text-2xl font-bold">Edit Watchlist</h1>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                placeholder="e.g., Tech Stocks"
                                required
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                Delete Watchlist
                            </button>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => navigate(`/watchlists/${id}`)}
                                    disabled={isSaving}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || ! name.trim()}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        isSaving || !name.trim()
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-black text-white hover: bg-gray-800'
                                    }`}
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Watchlist"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to delete <strong>{watchlist?. name}</strong>?
                        This action cannot be undone.
                    </p>

                    {watchlist && watchlist.securities_count > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                            This watchlist contains {watchlist.securities_count} {watchlist.securities_count === 1 ? 'security' :  'securities'}.
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isDeleting}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled: opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDeleting
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            {isDeleting ? 'Deleting.. .' : 'Delete Watchlist'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
