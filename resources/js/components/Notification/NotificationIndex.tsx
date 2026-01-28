import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import { Modal } from '../Modal';

interface NotificationConditionForm {
    field: string;
    operator: string;
    value: string;
    notifiable_type: string;
    ticker: string;
}

export default function NotificationIndex() {
    const [notifications, setNotifications] = useState<App.DTO.NotificationDTO[]>([]);
    const [conditions, setConditions] = useState<App.DTO.NotificationConditionDTO[]>([]);
    const [activeTab, setActiveTab] = useState<'notifications' | 'conditions'>('notifications');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState('');

    // Search state for finding securities
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<App.DTO.SecurityDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedSecurity, setSelectedSecurity] = useState<App.DTO.SecurityDTO | null>(null);

    // Form state
    const [formData, setFormData] = useState<NotificationConditionForm>({
        field: 'price',
        operator: '>=',
        value: '',
        notifiable_type: '',
        ticker: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            searchSecurities(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [notificationsRes, conditionsRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/conditions'),
            ]);
            setNotifications(notificationsRes.data);
            setConditions(conditionsRes.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    const searchSecurities = async (term: string) => {
        setIsSearching(true);
        try {
            const response = await api.get(`/securities/search/${encodeURIComponent(term)}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching securities:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectSecurity = (security: App.DTO.SecurityDTO) => {
        setSelectedSecurity(security);
        const type = security.ticker.length > 4 ? 'crypto' : 'stock';
        setFormData({
            ...formData,
            notifiable_type: type,
            ticker: security.ticker,
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleCreateCondition = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess('');

        try {
            await api.post('/notifications/conditions/create', {
                field: formData.field,
                operator: formData.operator,
                value: parseFloat(formData.value),
                notifiable_type: formData.notifiable_type,
                ticker: formData.ticker,
            });

            setSubmitSuccess('Notification condition created successfully!');
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            setSubmitError(err.response?.data?.message || 'Failed to create condition');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCondition = async (conditionId: number) => {
        if (!confirm('Are you sure you want to delete this alert condition? This will also remove all associated notifications.')) {
            return;
        }

        try {
            await api.delete(`/notifications/conditions/${conditionId}`);
            setSubmitSuccess('Condition deleted successfully!');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete condition');
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setSelectedSecurity(null);
        setSearchTerm('');
        setSearchResults([]);
        setSubmitError('');
        setFormData({
            field: 'price',
            operator: '>=',
            value: '',
            notifiable_type: '',
            ticker: '',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const getOperatorSymbol = (operator: string) => {
        const symbols: { [key: string]: string } = {
            '=': '=',
            '!=': '≠',
            '<': '<',
            '>': '>',
            '<=': '≤',
            '>=': '≥',
        };
        return symbols[operator] || operator;
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading notifications...</div>
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
                        <h1 className="text-2xl font-bold mb-2">Notifications</h1>
                        <p className="text-gray-600">Manage your price alerts and notification conditions</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Create Alert
                    </button>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
                        <span>{submitSuccess}</span>
                        <button onClick={() => setSubmitSuccess('')} className="text-green-700 hover:text-green-900">
                            ✕
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="-mb-px flex gap-8">
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'notifications'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Triggered Alerts
                            {notifications.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs font-bold">
                                    {notifications.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('conditions')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'conditions'
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Alert Conditions
                            {conditions.length > 0 && (
                                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs font-bold">
                                    {conditions.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'notifications' ? (
                    // Notifications Feed
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Triggered Notifications</h2>
                        {notifications.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">🔔</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No triggered notifications</h3>
                                    <p className="text-gray-600">
                                        When your alert conditions are met, they will appear here
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Security
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Condition
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Triggered
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {notifications.map((notification) => (
                                        <tr key={notification.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/securities/${notification.subject.ticker}`}
                                                    className="flex items-center gap-3 hover:opacity-80"
                                                >
                                                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📊</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">
                                                            {notification.subject.ticker}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {notification.subject.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-md border border-gray-200">
                                                            {notification.field}
                                                        </span>
                                                    <span className="text-lg font-bold text-gray-900">
                                                            {getOperatorSymbol(notification.operator)}
                                                        </span>
                                                    <span className="font-bold text-gray-900">
                                                            {formatPrice(notification.value)}
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 max-w-xs">
                                                    {notification.message}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(notification.created_at)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    // Conditions Management
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Alert Conditions</h2>
                        {conditions.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">⚙️</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No alert conditions yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Create your first price alert condition to start monitoring securities
                                    </p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="inline-flex items-center gap-2 bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        <span>+</span>
                                        <span>Create Your First Condition</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Security
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Field
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Condition
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                    {conditions.map((condition) => (
                                        <tr key={condition.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    to={`/securities/${condition.security.ticker}`}
                                                    className="flex items-center gap-3 hover:opacity-80"
                                                >
                                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">📊</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">
                                                            {condition.security.ticker}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {condition.security.name}
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-md border border-gray-200">
                                                        {condition.field}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-gray-900">
                                                            {getOperatorSymbol(condition.operator)}
                                                        </span>
                                                    <span className="font-bold text-gray-900">
                                                            {formatPrice(condition.value)}
                                                        </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {formatDate(condition.created_at)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => handleDeleteCondition(condition.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">🎯 Price Alerts</h4>
                        <p className="text-sm text-gray-600">
                            Get notified when a security reaches your target price
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">📈 Real-time Monitoring</h4>
                        <p className="text-sm text-gray-600">
                            Conditions are checked continuously in real-time
                        </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">🔔 Stay Informed</h4>
                        <p className="text-sm text-gray-600">
                            Never miss important price movements again
                        </p>
                    </div>
                </div>
            </main>

            {/* Create Condition Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                title="Create Price Alert"
                maxWidth="2xl"
            >
                <form onSubmit={handleCreateCondition} className="space-y-6">
                    {submitError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {submitError}
                        </div>
                    )}

                    {/* Security Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Select Security
                        </label>
                        {selectedSecurity ? (
                            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <span className="text-lg">📊</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{selectedSecurity.ticker}</div>
                                        <div className="text-sm text-gray-600">{selectedSecurity.name}</div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedSecurity(null);
                                        setFormData({
                                            ...formData,
                                            notifiable_type: '',
                                            ticker: '',
                                        });
                                    }}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by ticker or name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                            <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></div>
                                        </div>
                                    )}
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                                        {searchResults.map((security, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleSelectSecurity(security)}
                                                className="w-full p-3 hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="font-bold text-gray-900">{security.ticker}</div>
                                                    <div className="text-sm text-gray-500">{security.name}</div>
                                                </div>
                                                <div className="font-mono text-sm font-bold text-gray-900">
                                                    {formatPrice(security.price)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Field Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Field to Monitor
                        </label>
                        <select
                            value={formData.field}
                            onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        >
                            <option value="price">Price</option>
                            <option value="volume">Volume</option>
                            <option value="market_cap">Market Cap</option>
                        </select>
                    </div>

                    {/* Operator Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Operator
                        </label>
                        <select
                            value={formData.operator}
                            onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                        >
                            <option value=">=">Greater than or equal to (≥)</option>
                            <option value="<=">Less than or equal to (≤)</option>
                            <option value=">">Greater than (&gt;)</option>
                            <option value="<">Less than (&lt;)</option>
                            <option value="=">Equal to (=)</option>
                            <option value="!=">Not equal to (≠)</option>
                        </select>
                    </div>

                    {/* Value Input */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Target Value
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="0.00"
                                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting || !selectedSecurity || !formData.value}
                            className="flex-1 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Alert'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
