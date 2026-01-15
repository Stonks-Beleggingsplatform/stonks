import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

export default function TransactionIndex() {
    const [transactions, setTransactions] = useState<App.DTO.TransactionDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data);
        } catch (err:  any) {
            setError(err.response?.data?.message || 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTransactionTypeColor = (type: string) => {
        switch (type) {
            case 'buy':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'sell':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'deposit':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'withdrawal':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'dividend':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getTransactionTypeIcon = (type: string) => {
        switch (type) {
            case 'buy':
                return '📈';
            case 'sell':
                return '📉';
            case 'deposit':
                return '💰';
            case 'withdrawal':
                return '💸';
            case 'dividend':
                return '💵';
            default:
                return '💳';
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading transactions...</div>
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

    return (
        <div>
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Transaction History</h1>
                        <p className="text-gray-600">View all your transactions and account activity</p>
                    </div>
                </div>

                {/* Transactions List or Empty State */}
                {transactions.length === 0 ? (
                    <>
                        {/* Empty State */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">📊</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Start trading to see your transaction history here
                                </p>
                                <Link
                                    to="/portfolio"
                                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    <span>Go to Portfolio</span>
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Transactions Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Value
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Exchange Rate
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {transactions.map((transaction, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl">{getTransactionTypeIcon(transaction.type)}</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionTypeColor(transaction.type)}`}>
                                                            {transaction.type. charAt(0).toUpperCase() + transaction.type.slice(1)}
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {transaction. amount.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatPrice(transaction.price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatPrice(transaction.amount * transaction.price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {transaction.exchange_rate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(transaction.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <span className="text-xl">📈</span>
                                    </div>
                                    <div className="text-sm text-gray-500">Total Transactions</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                        <span className="text-xl">💰</span>
                                    </div>
                                    <div className="text-sm text-gray-500">Buys</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {transactions.filter(t => t.type === 'buy').length}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                        <span className="text-xl">📉</span>
                                    </div>
                                    <div className="text-sm text-gray-500">Sells</div>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {transactions.filter(t => t.type === 'sell').length}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
