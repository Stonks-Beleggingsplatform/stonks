import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

interface Watchlist {
    id: number;
    name: string;
    description?:  string;
    user_id:  number;
    created_at:  string;
    updated_at:  string;
    securities_count?:  number;
}

export default function WatchlistIndex() {
    const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchWatchlists();
    }, []);

    const fetchWatchlists = async () => {
        try {
            const response = await api.get('/watchlist');
            setWatchlists(response.data);
        } catch (err:  any) {
            setError(err.response?.data?.message || 'Failed to load watchlists');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading watchlists...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm: px-6 lg:px-8 py-8">
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">My Watchlists</h1>
                        <p className="text-gray-600">Track your favorite stocks and monitor market trends</p>
                    </div>
                    <Link
                        to="/watchlists/create"
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Create Watchlist
                    </Link>
                </div>

                {/* Watchlists List or Empty State */}
                {watchlists.length === 0 ? (
                    <>
                        {/* Empty State */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No watchlists yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Create your first watchlist to start tracking stocks and building your investment strategy
                                </p>
                                <Link
                                    to="/watchlists/create"
                                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    <span>+</span>
                                    <span>Create Your First Watchlist</span>
                                </Link>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">📈 Track Performance</h4>
                                <p className="text-sm text-gray-600">
                                    Monitor real-time price changes and performance metrics for your favorite stocks
                                </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 Stay Organized</h4>
                                <p className="text-sm text-gray-600">
                                    Create multiple watchlists for different strategies, sectors, or investment goals
                                </p>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">🔔 Get Alerts</h4>
                                <p className="text-sm text-gray-600">
                                    Set up notifications for price movements and important market events
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Watchlists Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {watchlists.map((watchlist) => (
                                <Link
                                    key={watchlist.id}
                                    to={`/watchlists/${watchlist.id}`}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{watchlist.name}</h3>
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    {watchlist.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {watchlist.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{watchlist.securities_count || 0} securities</span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Add New Card */}
                        <Link
                            to="/watchlists/create"
                            className="mt-4 block bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 hover:bg-gray-100 transition-all"
                        >
                            <div className="text-gray-400 text-3xl mb-2">+</div>
                            <div className="text-sm font-medium text-gray-600">Create New Watchlist</div>
                        </Link>
                    </>
                )}
            </main>
        </div>
    );
}
