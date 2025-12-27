import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { Modal } from '../../Modal.tsx';

interface Watchlist {
    id: number;
    name:  string;
    description?:  string;
    securities_count:  number;
}

interface AddToWatchlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    securityTicker: string;
    securityName: string;
}

export function AddToWatchlistModal({
                                        isOpen,
                                        onClose,
                                        securityTicker,
                                        securityName
                                    }: AddToWatchlistModalProps) {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWatchlistIds, setSelectedWatchlistIds] = useState<Set<number>>(new Set());
    const [initialWatchlistIds, setInitialWatchlistIds] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            fetchWatchlists();
        }
    }, [isOpen]);

    const fetchWatchlists = async () => {
        try {
            const response = await api. get('/watchlist');
            const allWatchlists = response. data;
            setWatchlists(allWatchlists);

            // Check which watchlists already contain this security
            const watchlistsWithSecurity = new Set<number>();

            for (const watchlist of allWatchlists) {
                try {
                    const detailResponse = await api.get(`/watchlist/${watchlist.id}`);
                    const securities = detailResponse.data.securities || [];

                    if (securities. some((s:  any) => s.ticker === securityTicker)) {
                        watchlistsWithSecurity.add(watchlist.id);
                    }
                } catch (err) {
                    console.error(`Failed to fetch watchlist ${watchlist.id}:`, err);
                }
            }

            setInitialWatchlistIds(watchlistsWithSecurity);
            setSelectedWatchlistIds(new Set(watchlistsWithSecurity));
        } catch (err) {
            console.error('Failed to fetch watchlists:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleWatchlist = (watchlistId: number) => {
        const newSelected = new Set(selectedWatchlistIds);
        if (newSelected.has(watchlistId)) {
            newSelected.delete(watchlistId);
        } else {
            newSelected.add(watchlistId);
        }
        setSelectedWatchlistIds(newSelected);
    };

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            // Find watchlists to add to (selected but not initially in)
            const toAdd = Array.from(selectedWatchlistIds).filter(id => !initialWatchlistIds.has(id));

            // Find watchlists to remove from (initially in but not selected)
            const toRemove = Array.from(initialWatchlistIds).filter(id => !selectedWatchlistIds.has(id));

            // Add to watchlists
            for (const watchlistId of toAdd) {
                await api.put(`/watchlist/${watchlistId}/securities/add`, {
                    securities: [{ ticker: securityTicker }]
                });
            }

            // Remove from watchlists
            for (const watchlistId of toRemove) {
                await api.put(`/watchlist/${watchlistId}/securities/remove`, {
                    securities: [{ ticker: securityTicker }]
                });
            }

            if (toAdd.length > 0 || toRemove.length > 0) {
                alert('Watchlists updated successfully! ');
            }
            onClose();
        } catch (err:   any) {
            console. error('Failed to update watchlists:', err);
            alert(err.response?.data?. message || 'Failed to update watchlists');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add to Watchlist"
            maxWidth="md"
        >
            <p className="text-sm text-gray-600 mb-4">
                Select watchlists for <span className="font-semibold">{securityTicker}</span> ({securityName})
            </p>

            {isLoading ? (
                <div className="text-center py-8 text-gray-600">Loading watchlists...</div>
            ) : watchlists.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You don't have any watchlists yet</p>
                    <a
                        href="/watchlists/create"
                        className="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover: bg-gray-800 transition-colors"
                    >
                        Create Watchlist
                    </a>
                </div>
            ) : (
                <>
                    <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                        {watchlists.map((watchlist) => {
                            const isSelected = selectedWatchlistIds.has(watchlist.id);
                            return (
                                <button
                                    key={watchlist.id}
                                    onClick={() => toggleWatchlist(watchlist.id)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-start gap-3 ${
                                        isSelected
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 flex items-center justify-center transition-all ${
                                        isSelected
                                            ? 'bg-black border-black'
                                            : 'border-gray-300'
                                    }`}>
                                        {isSelected && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Watchlist Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900">{watchlist. name}</div>
                                        {watchlist.description && (
                                            <div className="text-sm text-gray-500 mt-1 truncate">
                                                {watchlist.description}
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">
                                            {watchlist.securities_count} securities
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 rounded-lg bg-black text-white hover: bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </>
            )}
        </Modal>
    );
}
