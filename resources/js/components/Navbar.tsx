import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation(); // the current slug or location of the page

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
                            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                                Deposit
                            </button>
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
