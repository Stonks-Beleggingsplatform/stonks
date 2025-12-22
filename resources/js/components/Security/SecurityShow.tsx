import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../lib/axios';

// Base Security interface
interface Exchange {
    id: number;
    name: string;
}

interface Company {
    name: string;
    sectors: string[];
    employee_count: number;
    market_cap: number;
    email: string;
    phone: string;
    street: string;
    zip_code: string;
    city: string;
    country: string;
    about: string;
}

interface BaseSecurity {
    id: number;
    ticker: string;
    name: string;
    price: number;
    exchange?:  Exchange;
    dto_type:  'stock' | 'crypto' | 'bond' | 'security';
}

// Stock specific
interface Stock extends BaseSecurity {
    dto_type: 'stock';
    pe_ratio: number;
    dividend_yield: number;
    company?: Company;
}

// Crypto specific
interface Crypto extends BaseSecurity {
    dto_type: 'crypto';
    type: 'coin' | 'token' | 'nft';
}

// Bond specific
interface Bond extends BaseSecurity {
    dto_type: 'bond';
    nominal_value: number;
    coupon_rate: number;
    maturity_date: string;
}

type Security = Stock | Crypto | Bond | BaseSecurity;

export default function SecurityShow() {
    const { ticker } = useParams<{ ticker: string }>();
    const navigate = useNavigate();
    const [security, setSecurity] = useState<Security | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (ticker) {
            fetchSecurity();
        }
    }, [ticker]);

    const fetchSecurity = async () => {
        try {
            const response = await api.get(`/securities/${ticker}`);
            setSecurity(response.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                setError('Security not found');
            } else {
                setError(err.response?.data?.message || 'Failed to load security');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('en-US', {
            minimumFractionDigits:  2,
            maximumFractionDigits: 2
        })}`;
    }

    const formatMarketCap = (marketCap: number) => {
        if (marketCap >= 1_000_000_000_000) {
            return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
        } else if (marketCap >= 1_000_000_000) {
            return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
        } else if (marketCap >= 1_000_000) {
            return `$${(marketCap / 1_000_000).toFixed(2)}M`;
        }
        return `$${marketCap.toLocaleString()}`;
    };

    const renderSecurityDetails = () => {
        if (!security) return null;

        switch (security. dto_type) {
            case 'stock':
                return <StockDetails security={security as Stock} formatMarketCap={formatMarketCap} />;
            case 'crypto':
                return <CryptoDetails security={security as Crypto} />;
            case 'bond':
                return <BondDetails security={security as Bond} />;
            default:
                return <BaseSecurityDetails />;
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-gray-600">Loading security... </div>
                </div>
            </div>
        );
    }

    if (error || !security) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
                >
                    <span>←</span>
                    <span>Back</span>
                </button>
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
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4 flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{security. ticker}</h1>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full uppercase">
                                    {security.dto_type}
                                </span>
                            </div>
                            <p className="text-xl text-gray-600 mb-1">{security.name}</p>
                            {security.exchange && (
                                <p className="text-sm text-gray-500">{security.exchange.name}</p>
                            )}
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">
                                {formatPrice(security.price)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Type Specific Details */}
                {renderSecurityDetails()}
            </main>
        </div>
    );
}
// Stock Details Component
function StockDetails({ security, formatMarketCap }: { security: Stock; formatMarketCap: (n: number) => string }) {
    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 md: grid-cols-3 gap-6">
                    <div>
                        <span className="text-sm text-gray-500">P/E Ratio</span>
                        <p className="text-2xl font-bold text-gray-900">{security.pe_ratio.toFixed(2)}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Dividend Yield</span>
                        <p className="text-2xl font-bold text-gray-900">{security.dividend_yield.toFixed(2)}%</p>
                    </div>
                    {security.company && (
                        <div>
                            <span className="text-sm text-grayfunc-500">Market Cap</span>
                            <p className="text-2xl font-bold text-gray-900">{formatMarketCap(security.company.market_cap)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Company Information */}
            {security.company && (
                <>
                    {/* About */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">About {security.company.name}</h2>
                        <p className="text-gray-700 leading-relaxed">{security.company.about}</p>
                    </div>

                    {/* Company Details */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Company Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-sm text-gray-500">Company Name</span>
                                <p className="text-gray-900 font-medium">{security.company.name}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Employees</span>
                                <p className="text-gray-900 font-medium">{security. company.employee_count. toLocaleString()}</p>
                            </div>
                            {security.company.sectors && security.company.sectors.length > 0 && (
                                <div className="md:col-span-2">
                                    <span className="text-sm text-gray-500">Sectors</span>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {security.company.sectors.map((sector, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                                            >
                                                {sector}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact & Location */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Contact & Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-sm text-gray-500">Email</span>
                                <a
                                    href={`mailto:${security.company.email}`}
                                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors block"
                                >
                                    {security.company.email}
                                </a>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Phone</span>
                                <a
                                    href={`tel:${security.company.phone}`}
                                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors block"
                                >
                                    {security.company.phone}
                                </a>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-sm text-gray-500">Address</span>
                                <p className="text-gray-900 font-medium">
                                    {security.company. street}<br />
                                    {security.company.zip_code} {security.company. city}<br />
                                    {security.company.country}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Crypto Details Component
function CryptoDetails({ security }: { security: Crypto }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Crypto Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <span className="text-sm text-gray-500">Type</span>
                    <p className="text-gray-900 font-medium capitalize">{security.type}</p>
                </div>
            </div>
        </div>
    );
}

// Bond Details Component
function BondDetails({ security }: { security: Bond }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Bond Information</h2>
            <div className="grid grid-cols-1 md: grid-cols-2 gap-6">
                <div>
                    <span className="text-sm text-gray-500">Nominal Value</span>
                    <p className="text-gray-900 font-medium">${security.nominal_value.toLocaleString()}</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Coupon Rate</span>
                    <p className="text-gray-900 font-medium">{security.coupon_rate}%</p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Maturity Date</span>
                    <p className="text-gray-900 font-medium">
                        {new Date(security.maturity_date).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Base Security Details (fallback)
function BaseSecurityDetails() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-gray-600">No additional details available for this security type.</p>
        </div>
    );
}
