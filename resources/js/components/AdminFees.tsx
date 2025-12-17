import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Exchange {
    id: number;
    name: string;
    fee_amount: number;
}

export default function AdminFees() {
    const [exchanges, setExchanges] = useState<Exchange[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const response = await axios.get('/api/admin/fees');
            setExchanges(response.data);
        } catch (error) {
            console.error('Failed to fetch fees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFeeChange = (id: number, amount: string) => {
        setExchanges(exchanges.map(ex =>
            ex.id === id ? { ...ex, fee_amount: amount === '' ? 0 : parseFloat(amount) } : ex
        ));
    };

    const saveAllFees = async () => {
        try {
            const fees = exchanges.map(ex => ({
                exchange_id: ex.id,
                amount: ex.fee_amount
            }));

            await axios.post('/api/admin/fees', { fees });
            setMessage({ text: 'All fees updated successfully', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to update fees', type: 'error' });
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard: Fee Management</h1>
                <button
                    onClick={saveAllFees}
                    className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Save Changes
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                    {exchanges.map((exchange) => (
                        <li key={exchange.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                                {exchange.name}
                            </div>
                            <div className="flex items-center space-x-4">
                                <label className="text-sm text-gray-500">Standard Fee:</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={exchange.fee_amount}
                                    onChange={(e) => handleFeeChange(exchange.id, e.target.value)}
                                    className="block w-32 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                />
                                <p>%</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
