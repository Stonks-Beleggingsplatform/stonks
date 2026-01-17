import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export default function Deposit() {
    const { balance, fetchBalance } = useAuth();
    const [amount, setAmount] = useState('50');
    const [iban, setIban] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSimulated, setIsSimulated] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    // Dutch IBAN regular expression
    const dutchIbanRegex = /^NL\d{2}[A-Z]{4}\d{10}$/;
    const isValidIban = dutchIbanRegex.test(iban.replace(/\s/g, '').toUpperCase());

    const presets = ['10', '50', '100', '500'];

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleDeposit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidIban || !amount || parseFloat(amount) <= 0) return;
        setShowConfirm(true);
    };

    const executeDeposit = async () => {
        setShowConfirm(false);
        setIsLoading(true);
        setMessage(null);

        try {
            if (isSimulated) {
                await api.post('/deposit/simulate', {
                    amount: parseFloat(amount),
                    iban: iban.replace(/\s/g, '').toUpperCase()
                });
                setMessage({ type: 'success', text: `Successfully deposited $${amount} from ${iban} (Simulated)` });
                await fetchBalance();
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                const response = await api.post('/deposit/session', {
                    amount: parseFloat(amount),
                    iban: iban.replace(/\s/g, '').toUpperCase()
                });
                if (response.data.url) {
                    window.location.href = response.data.url;
                }
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'An error occurred during deposit.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100-64px)] bg-gray-50 py-12 px-6 lg:px-8 relative">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Deposit Funds</h1>
                    <p className="mt-2 text-gray-600">Add capital to your Stonks portfolio</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header with Balance */}
                    <div className="bg-black p-8 text-white">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Current Balance</p>
                        <p className="text-4xl font-black">${(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>

                    <form onSubmit={handleDeposit} className="p-8 space-y-6">
                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-medium border animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* IBAN Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest text-[10px]">IBAN</label>
                            <input
                                type="text"
                                value={iban}
                                onChange={(e) => setIban(e.target.value.toUpperCase())}
                                placeholder="NL00 BANK 0123 4567 89"
                                className={`w-full px-4 py-4 rounded-xl border outline-none focus:ring-2 transition-all font-mono tracking-wider ${iban && !isValidIban ? 'border-red-300 focus:ring-red-500 bg-red-50' :
                                    isValidIban ? 'border-green-300 focus:ring-green-500 bg-green-50' :
                                        'border-gray-200 focus:ring-black'
                                    }`}
                            />
                            {iban && !isValidIban && (
                                <p className="mt-2 text-xs text-red-500 font-bold">Format: NL00 BANK 0123 4567 89</p>
                            )}
                        </div>

                        {/* Amount Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest text-[10px]">Select Amount</label>
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                {presets.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setAmount(p)}
                                        className={`py-3 rounded-xl font-bold transition-all border ${amount === p ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                                            }`}
                                    >
                                        ${p}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Custom amount"
                                    className="w-full pl-8 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        {/* Mode Toggle */}
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Simulate Payment</p>
                                    <p className="text-xs text-gray-500">Enable for easy demoing (No real money)</p>
                                </div>
                                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSimulated}
                                        onChange={() => setIsSimulated(!isSimulated)}
                                    />
                                    <div className={`w-12 h-6 rounded-full transition-colors ${isSimulated ? 'bg-indigo-200' : 'bg-gray-200'}`} />
                                    <div className={`absolute left-1 top-1 w-4 h-4 transition duration-200 ease-in-out transform bg-white rounded-full ${isSimulated ? 'translate-x-6 !bg-black' : ''}`} />
                                </div>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !amount || parseFloat(amount) <= 0 || !isValidIban}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {isLoading ? 'Processing...' : (isSimulated ? 'Instant Deposit' : 'Deposit via Stripe')}
                        </button>

                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            Secure 256-bit SSL Encrypted Transaction
                        </p>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Deposit</h3>
                            <p className="text-gray-500 mt-2">Please review your transaction details</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</span>
                                <span className="text-lg font-black text-gray-900">${parseFloat(amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">From IBAN</span>
                                <span className="text-xs font-mono font-bold text-gray-700">{iban.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Method</span>
                                <span className="text-xs font-bold text-indigo-600 px-2 py-1 bg-indigo-50 rounded-md">
                                    {isSimulated ? 'Instant Simulation' : 'Stripe Checkout'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={executeDeposit}
                                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg transform active:scale-95"
                            >
                                Confirm & Deposit
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="w-full bg-white text-gray-400 py-3 rounded-2xl font-bold hover:text-gray-600 transition-all"
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
