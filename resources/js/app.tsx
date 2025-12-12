import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import Watchlists from './components/Watchlists';
import WatchlistCreate from './components/WatchlistCreate';
import ProtectedLayout from './components/ProtectedLayout.tsx';

function Portfolio() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
            <p className="text-gray-600">This is a placeholder for the portfolio page.</p>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/portfolio" element={<Portfolio />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedLayout />}>
                            <Route path="/watchlists" element={<Watchlists />} />
                            <Route path="/watchlist/create" element={<WatchlistCreate />} />
                        </Route>

                        {/* Add a 404 for React here */}
                        <Route path="*" element={<div className="p-8 text-center"><h1>404 - Not Found</h1></div>} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

const appElement = document.getElementById('app');
if (appElement) {
    const root = ReactDOM.createRoot(appElement);
    root.render(<App />);
}
