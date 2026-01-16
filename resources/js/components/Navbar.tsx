import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface User {
    name: string;
    email: string;
    role?: string;
    balance?: number;
}

interface AuthContextType {
    user: User | null;
    logout: () => void;
}

export default function Navbar() {
    const { user, logout } = useAuth() as unknown as AuthContextType;

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                        <Link to="/markets" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Markets</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin/fees" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Admin Fees</Link>
                        )}
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
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
                                    ${(user.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
    );
}
