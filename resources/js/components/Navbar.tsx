import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get('/api/user').then(response => {
            setUser(response.data);
        }).catch(() => {
            // User not logged in
        });
    }, []);

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
                        <Link to="/markets" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Markets</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-600 hidden sm:block">
                        {user ? `Hello, ${user.name}` : 'Guest'}
                    </span>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Deposit
                    </button>
                </div>
            </div>
        </header>
    );
}
