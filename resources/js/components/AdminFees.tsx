import { useEffect, useState } from 'react';
import api from '../lib/axios';

interface Exchange {
    id: number;
    name: string;
    description: string;
    currency: string;
    transaction_fee: number;
    maintenance_fee: number;
    order_fee: number;
}

export default function AdminFees() {
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const response = await api.get('/admin/fees');
            setExchanges(response.data);
        } catch (error) {
            console.error('Failed to fetch fees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (id: number, field: string, value: string) => {
        setExchanges(exchanges.map(ex =>
            ex.id === id ? {
                ...ex,
                [field]: (field.endsWith('_fee'))
                    ? (value === '' ? 0 : parseFloat(value))
                    : value
            } : ex
        ));
    };

    const saveAllFees = async () => {
        setIsModalOpen(false);
        try {
            const fees = exchanges.map(ex => ({
                exchange_id: ex.id,
                description: ex.description,
                transaction_fee: ex.transaction_fee,
                maintenance_fee: ex.maintenance_fee,
                order_fee: ex.order_fee
            }));

            await api.post('/admin/fees', { fees });
            setMessage({ text: 'All fees updated successfully', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to update fees', type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading exchange data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Fee Management</h1>
                    <p className="text-gray-600">Configure exchange data, transaction, maintenance, and order fees</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Apply All Changes
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg text-sm font-medium border ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Exchange</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Currency</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Trans. (%)</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Maint. (%)</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Order (%)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exchanges.map((exchange) => (
                            <tr key={exchange.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">
                                        {exchange.name}
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                        {exchange.currency}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <textarea
                                        rows={1}
                                        value={exchange.description}
                                        onChange={(e) => handleFieldChange(exchange.id, 'description', e.target.value)}
                                        className="block w-full min-w-[200px] text-sm text-gray-900 border-gray-200 rounded-lg focus:ring-black focus:border-black transition-all"
                                        placeholder="Description..."
                                    />
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.transaction_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'transaction_fee', e.target.value)}
                                                className="block w-24 px-3 py-2 border-gray-200 rounded-lg text-gray-900 focus:ring-black focus:border-black sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.maintenance_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'maintenance_fee', e.target.value)}
                                                className="block w-24 px-3 py-2 border-gray-200 rounded-lg text-gray-900 focus:ring-black focus:border-black sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.order_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'order_fee', e.target.value)}
                                                className="block w-24 px-3 py-2 border-gray-200 rounded-lg text-gray-900 focus:ring-black focus:border-black sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                                                <span className="text-gray-400 text-xs">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Panel */}
                    <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-md z-10">
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-2xl">⚠️</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Confirm Fee Updates
                                </h3>
                                <p className="text-gray-600">
                                    Are you sure you want to apply these changes to the global fee structure? This will affect all future transactions.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={saveAllFees}
                                    className="w-full bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Confirm Updates
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
