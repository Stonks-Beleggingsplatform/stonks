import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Modal } from './Modal';

interface User {
    name: string;
    email: string;
    role?: string;
    balance?: number;
}

interface AuthContextType {
    user: User | null;
    balance: number;
    logout: () => void;
}

export default function Navbar() {
    const { user, balance, logout } = useAuth() as unknown as AuthContextType;
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<App. DTO.SecurityDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    // Debounced search
    useEffect(() => {
        if (! searchTerm. trim()) {
            setSearchResults([]);
            return;
        }

        const delayDebounce = setTimeout(() => {
            searchSecurities(searchTerm);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

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

    const handleResultClick = (ticker: string) => {
        setSearchTerm('');
        setIsModalOpen(false);
        navigate(`/securities/${ticker}`);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };

    const formatPrice = (price: number) => {
        return `$${price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Stonks</span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors">Dashboard</Link>
                            <Link to="/portfolio" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Portfolio</Link>
                            <Link to="/watchlists" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Watchlists</Link>
                            <Link to="/transactions" className="text-sm font-medium text-gray-500 hover: text-gray-900 transition-colors">Transactions</Link>
                            <Link to="/markets" className="text-sm font-medium text-gray-500 hover: text-gray-900 transition-colors">Markets</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {/* Search Button */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Search securities... </span>
                                </button>

                                <span className="text-sm font-medium text-gray-600 hidden sm:block">
                                    Hello, {user.name}
                                </span>
                                <button onClick={handleLogout} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                    Logout
                                </button>
                                <Link to="/deposit" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Deposit
                                </Link>
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Balance</span>
                                    <span className="text-sm font-bold text-green-600">
                                    ${(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <Modal isOpen={isModalOpen} onClose={handleModalClose} title="Search Securities" maxWidth="xl">
                {/* Search Input */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by ticker or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                            className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-black rounded-full"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                    {isSearching ?  (
                        <div className="py-12 text-center text-gray-500">
                            <div className="animate-spin h-8 w-8 border-3 border-gray-300 border-t-black rounded-full mx-auto mb-3"></div>
                            <p className="text-sm">Searching... </p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-2">
                            {searchResults. map((security, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleResultClick(security.ticker)}
                                    className="w-full p-4 hover:bg-gray-50 transition-colors rounded-lg text-left flex items-center justify-between group border border-gray-200"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-gray-900 text-base">
                                                {security. ticker}
                                            </span>
                                            <span className="text-sm text-gray-400">•</span>
                                            <span className="text-sm text-gray-600 truncate">
                                                {security. name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Price</div>
                                                <div className="text-lg font-semibold text-gray-900">
                                                    {formatPrice(security.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover: text-gray-600 transition-colors flex-shrink-0"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    ) : searchTerm ? (
                        <div className="py-12 text-center text-gray-500">
                            <div className="text-4xl mb-3">🔍</div>
                            <p className="text-sm font-medium mb-1">No securities found</p>
                            <p className="text-xs text-gray-400">Try searching with a different term</p>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            <div className="text-4xl mb-3">💼</div>
                            <p className="text-sm font-medium mb-1">Start searching</p>
                            <p className="text-xs text-gray-400">Enter a ticker symbol or company name</p>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
}
