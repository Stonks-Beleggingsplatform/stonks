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

    if (loading) return <div className="p-8 text-center text-gray-600 font-medium">Loading exchange data...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Fee Management</h1>
                    <p className="mt-1 text-sm text-gray-500 font-medium">Configure exchange data, transaction, maintenance, and order fees.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    Apply All Changes
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg font-medium flex items-center shadow-sm animate-fade-in ${message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                    {message.type === 'success' ? (
                        <svg className="h-5 w-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    ) : (
                        <svg className="h-5 w-5 mr-3 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    )}
                    {message.text}
                </div>
            )}

            <div className="bg-white shadow-lg border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Exchange</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Currency</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction (%)</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Maintenance (%)</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Order (%)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exchanges.map((exchange) => (
                            <tr key={exchange.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="text-sm font-bold text-indigo-700">
                                        {exchange.name}
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                        {exchange.currency}
                                    </span>
                                </td>
                                <td className="px-6 py-6">
                                    <textarea
                                        rows={1}
                                        value={exchange.description}
                                        onChange={(e) => handleFieldChange(exchange.id, 'description', e.target.value)}
                                        className="block w-full min-w-[200px] text-sm text-gray-900 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="e.g. European exchange, high fees"
                                    />
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center group">
                                        <div className="relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.transaction_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'transaction_fee', e.target.value)}
                                                className="block w-28 pl-3 pr-8 rounded-lg border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.maintenance_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'maintenance_fee', e.target.value)}
                                                className="block w-28 pl-3 pr-8 rounded-lg border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                        <div className="relative rounded-md shadow-sm">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={exchange.order_fee}
                                                onChange={(e) => handleFieldChange(exchange.id, 'order_fee', e.target.value)}
                                                className="block w-28 pl-3 pr-8 rounded-lg border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">%</span>
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
                        className="fixed inset-0 bg-gray-900/60 transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Panel */}
                    <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-lg z-10">
                        <div className="bg-white px-6 pt-6 pb-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Confirm Fee Updates
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Are you sure you want to apply these changes to the global fee structure? This will affect all future transactions across the selected exchanges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3 mt-4">
                            <button
                                type="button"
                                onClick={saveAllFees}
                                className="inline-flex justify-center rounded-lg px-5 py-2.5 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Confirm Updates
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
