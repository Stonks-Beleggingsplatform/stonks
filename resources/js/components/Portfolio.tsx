import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

interface Portfolio {
    id: number;
    name: string;
    description?: string;
    user_id: number;
    securities_count?: number;
}

export default function PortfolioIndex() {
    const [portfolios, setPortfolio] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const response = await api.get('/portfolio');
            console.log(response.data)
            setPortfolio(response.data);
        } catch (err:  any) {
            setError(err.response?.data?.message || 'Failed to load portfolio');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading portfolio...</div>
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
                        <h1 className="text-2xl font-bold mb-2">My Portfolio</h1>
                        <p className="text-gray-600">Monitor your holdings here.</p>
                    </div>
                </div>

                {/* Portfolio List or Empty State */}
                {portfolios.length === 0 ? (
                    <>
                        {/* Empty State */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items in portfolio yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Buy your first security to start trading stocks and building your investment strategy
                                </p>
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
                                    Create multiple portfolios for different strategies, sectors, or investment goals
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
                        {/* Portfolios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {portfolios.map((portfolio) => (
                                <Link
                                    key={portfolio.id}
                                    to={`/watchlists/${portfolio.id}`}
                                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    {portfolio.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                            {portfolio.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{portfolio.securities_count || 0} securities</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}