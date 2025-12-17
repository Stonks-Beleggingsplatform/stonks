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
import Portfolio from './components/Portfolio';
import ProtectedLayout from './components/ProtectedLayout.tsx';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route element={<ProtectedLayout />}>
                            <Route path="/portfolio" element={<Portfolio />} />
                            {/* <Route path="/portfolio/create" element={<PortfolioCreate />} /> */}
                        </Route>
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
