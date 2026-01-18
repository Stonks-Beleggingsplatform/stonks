import './bootstrap';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import SecurityShow from './components/Security/SecurityShow';
import StockShow from './components/BuyOrder/Stockshow';
import WatchlistIndex from './components/Watchlist/WatchlistIndex';
import WatchlistCreate from './components/Watchlist/WatchlistCreate';
import Portfolio from './components/Portfolio';
import WatchlistEdit from './components/Watchlist/WatchlistEdit';
import WatchlistShow from './components/Watchlist/WatchlistShow';
import ProtectedLayout from './components/ProtectedLayout.tsx';
import AdminFees from './components/AdminFees';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
                    <Navbar />
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Home />} />
                        <Route element={<ProtectedLayout />}>
                            <Route path="/portfolio" element={<Portfolio />} />
                        </Route>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />

                        {/* Protected routes */}
                        <Route element={<ProtectedLayout />}>
                            <Route path="/portfolio" element={<Portfolio />} />
                            <Route path="/securities/:ticker" element={<SecurityShow />} />
                            <Route path="/stocks/:ticker" element={<StockShow />} />

                            <Route path="/watchlists" element={<WatchlistIndex />} />
                            <Route path="/watchlists/create" element={<WatchlistCreate />} />
                            <Route path="/watchlists/:id" element={<WatchlistShow />} />
                            <Route path="/watchlists/:id/edit" element={<WatchlistEdit />} />
                          
                            <Route path="/admin/fees" element={<AdminFees />} />
                        </Route>

                        {/* 404 */}
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
