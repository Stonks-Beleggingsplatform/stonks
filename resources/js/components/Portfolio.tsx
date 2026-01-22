import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { Link } from 'react-router-dom';

interface Holding {
    id: number;
    security_id: number;
    ticker: string;
    quantity: number;
    purchase_price: number;
    avg_price: number;
    gain_loss: number;
}

interface Order {
    id: number;
    action: 'buy' | 'sell';
    type: string;
    status: string;
    quantity: number;
    price: number;
    security_id: number;
    ticker: string;
}

interface Portfolio {
    id: number;
    user_id: number;
    cash: number;
    total_value: number;
    total_return: number;
    holdings: Holding[];
    orders: Order[];
}

export default function Portfolio() {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const response = await api.get('/portfolio');
            setPortfolio(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load portfolio details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading portfolio details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h1 className="text-xl font-semibold">Portfolio not found</h1>
                </div>
            </div>
        );
    }
    
    const buyOrders = portfolio.orders?.filter(order => order.action === 'buy' && order.status === 'pending') || [];
    const sellOrders = portfolio.orders?.filter(order => order.action === 'sell' && order.status === 'pending') || [];

    return (
        <div>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Portfolio Summary */}
                <section className="mb-10 p-8 bg-black rounded-3xl text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Total Portfolio Value</h2>
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-5xl font-black tracking-tighter">
                                ${(portfolio.total_value / 100 || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h1>
                            <div className={`flex items-center text-sm font-bold px-2 py-1 rounded-lg ${(portfolio.total_return || 0) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                <span>{(portfolio.total_return / 100 || 0) >= 0 ? '↑' : '↓'} {Math.abs(portfolio.total_return || 0).toFixed(2)}%</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Cash</p>
                                <p className="text-lg font-bold">${(portfolio.cash / 100 || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invested</p>
                                <p className="text-lg font-bold">${((portfolio?.total_value / 100 || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Holdings Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Holdings</h2>
                    {(portfolio.holdings?.length ?? 0) === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No holdings yet</h3>
                            <p className="text-gray-600">Your portfolio is empty. Buy some securities to see your holdings.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {portfolio.holdings.map((holding) => (
                                        <tr key={holding.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        <Link to={`/securities/${holding.ticker}`} className="hover:underline">{holding.ticker}</Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{holding.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${holding.avg_price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${holding.purchase_price.toFixed(2)}</td>
                                            <td className={`px-6 py-4 whitespace-nowrap ${(holding.avg_price - holding.purchase_price) * holding.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {(((holding.avg_price - holding.purchase_price) / holding.purchase_price) * 100).toFixed(2)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Buy Orders Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Buy Orders</h2>
                    {buyOrders.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No buy orders yet</h3>
                            <p className="text-gray-600">You have not placed any buy orders yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-moment text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {buyOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        <Link to={`/securities/${order.ticker}`} className="hover:underline">{order.ticker}</Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${order.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Sell Orders Section */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Sell Orders</h2>
                    {sellOrders.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No sell orders yet</h3>
                            <p className="text-gray-600">You have not placed any sell orders yet.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sellOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="font-medium text-gray-900">
                                                        <Link to={`/securities/${order.ticker}`} className="hover:underline">{order.ticker}</Link>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">${order.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
