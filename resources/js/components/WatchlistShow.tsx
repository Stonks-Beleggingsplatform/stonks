import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Security {
    id:  number;
    ticker: string;
    name: string;
    price?: number;
}

interface Watchlist {
    id: number;
    name: string;
    description?: string;
    user:  User;
    securities: Security[] | null;
    securities_count: number;
    created_at: string;
    updated_at: string;
}

export default function WatchlistShow() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [watchlist, setWatchlist] = useState<Watchlist | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchWatchlist();
        }
    }, [id]);

    const fetchWatchlist = async () => {
        try {
            const response = await api.get(`/watchlist/${id}`);
            setWatchlist(response.data);
        } catch (err:  any) {
            if (err.response?.status === 404) {
                setError('Watchlist not found');
            } else if (err.response?.status === 403) {
                setError('You do not have permission to view this watchlist');
            } else {
                setError(err.response?.data?.message || 'Failed to load watchlist');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading watchlist...</div>
                </div>
            </div>
        );
    }

    if (error || !watchlist) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm: px-6 lg:px-8 py-8">
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
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/watchlists')}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Back to Watchlists</span>
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{watchlist.name}</h1>
                            {watchlist.description && (
                                <p className="text-gray-600">{watchlist.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>{watchlist.securities_count} stocks</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Link
                                to={`/watchlists/${id}/edit`}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => {/* TODO: Add stock modal */}}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover: bg-gray-800 transition-colors"
                            >
                                + Add Stock
                            </button>
                        </div>
                    </div>
                </div>

                {/* Securities List */}
                {watchlist.securities && watchlist.securities.length > 0 ?  (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ticker
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {watchlist.securities.map((security) => (
                                    <tr key={security.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {security.ticker}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{security.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="text-sm text-gray-900">
                                                {security.price !== undefined ? `$${security.price.toFixed(2)}` : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button
                                                onClick={() => {/* TODO: Remove stock */}}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📈</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No stocks yet</h3>
                            <p className="text-gray-600 mb-6">
                                Start building your watchlist by adding stocks you want to track
                            </p>
                            <button
                                onClick={() => {/* TODO: Add stock modal */}}
                                className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <span>+</span>
                                <span>Add Your First Stock</span>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
