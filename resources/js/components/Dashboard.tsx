import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { } = useAuth();
    const [portfolio, setPortfolio] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/portfolio');
                setPortfolio(response.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-400 font-medium animate-pulse">Loading dashboard...</div>
            </div>
        );
    }

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
                                <p className="text-lg font-bold">${(portfolio.cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Invested</p>
                                <p className="text-lg font-bold">${((portfolio?.total_value / 100 || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-8">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Link to="/markets" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all font-bold text-gray-700">
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            Buy
                        </Link>
                        <Link to="/portfolio" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all font-bold text-gray-700">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            Sell
                        </Link>
                        <Link to="/deposit" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-100 transition-all font-bold text-gray-700">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                            Deposit
                        </Link>
                        <Link to="/portfolio" className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all font-bold text-gray-700">
                            <div className="w-12 h-12 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            History
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
