import React from 'react';
import { Link } from 'react-router-dom';

export default function WatchlistIndex() {
    return (
        <div>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg: px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">My Watchlists</h1>
                        <p className="text-gray-600">Track your favorite stocks and monitor market trends</p>
                    </div>
                    <Link
                        to="/watchlist/create"
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover: bg-gray-800 transition-colors"
                    >
                        Create Watchlist
                    </Link>
                </div>

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
                            to="/watchlist/create"
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
            </main>
        </div>
    );
}
