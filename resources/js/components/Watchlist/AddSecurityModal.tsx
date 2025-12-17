import React, {useState, useEffect} from 'react';
import api from '../../lib/axios';
import {Modal} from '../Modal';

interface Security {
    id: number;
    ticker: string;
    name: string;
    company?: string;
}

interface AddSecurityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    watchlistId: number;
    existingSecurityIds?: number[];
}

export function AddSecurityModal({
                                     isOpen,
                                     onClose,
                                     onSuccess,
                                     watchlistId,
                                     existingSecurityIds = []
                                 }: AddSecurityModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [securities, setSecurities] = useState<Security[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [selectedSecurity, setSelectedSecurity] = useState<Security | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim().length > 0) {
                searchSecurities(searchTerm);
            } else {
                setSecurities([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const searchSecurities = async (term: string) => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get(`/securities/search/${encodeURIComponent(term)}`);
            const filteredSecurities = response.data.filter(
                (security: Security) => !existingSecurityIds.includes(security.id)
            );
            setSecurities(filteredSecurities);
        } catch (error) {
            console.error('Error fetching securities:', error);
            setError('Failed to search securities');
            setSecurities([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (security: Security) => {
        setSelectedSecurity(security);
    };

    const handleAdd = async () => {
        if (!selectedSecurity) return;

        setIsAdding(true);
        setError('');

        try {
            // PUT naar /watchlist/{id}/securities/add met securities array
            await api.put(`/watchlist/${watchlistId}/securities/add`, {
                securities: [
                    {ticker: selectedSecurity.ticker}
                ]
            });
            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Failed to add security:', err);
            setError(err.response?.data?.message || 'Failed to add security to watchlist');
        } finally {
            setIsAdding(false);
        }
    };

    const handleClose = () => {
        setSearchTerm('');
        setSecurities([]);
        setSelectedSecurity(null);
        setError('');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Add Security">
            {/* Error Message */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Search Input */}
            <div className="mb-4">
                <div className="relative">
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, ticker, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        autoFocus
                    />
                </div>
            </div>

            {/* Results List */}
            <div className="border border-gray-200 rounded-lg max-h-[300px] overflow-y-auto mb-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : securities.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {securities.map((security) => (
                            <button
                                key={security.id}
                                onClick={() => handleSelect(security)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                    selectedSecurity?.id === security.id
                                        ? 'bg-blue-50 border-l-4 border-blue-500'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-sm text-gray-900">
                                            {security.ticker}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {security.name}
                                        </div>
                                        {security.company && security.company !== security.name && (
                                            <div className="text-xs text-gray-500">
                                                {security.company}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : searchTerm.trim().length > 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                        No securities found
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-8 text-gray-400">
                        Start typing to search...
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={handleClose}
                    disabled={isAdding}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAdd}
                    disabled={!selectedSecurity || isAdding}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedSecurity && !isAdding
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    {isAdding ? 'Adding.. .' : 'Add Security'}
                </button>
            </div>
        </Modal>
    );
}
