import './bootstrap';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';

import { AuthProvider } from './context/AuthContext';
import Register from './components/Register';
import Login from './components/Login';
import SecurityShow from './components/Security/SecurityShow';
import WatchlistIndex from './components/Watchlist/WatchlistIndex';
import WatchlistCreate from './components/Watchlist/WatchlistCreate';
import WatchlistEdit from './components/Watchlist/WatchlistEdit';
import WatchlistShow from './components/Watchlist/WatchlistShow';
import { useAuth } from './context/AuthContext';
import ProtectedLayout from './components/ProtectedLayout.tsx';
import AdminFees from './components/AdminFees';
import Dashboard from './components/Dashboard';

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
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}

function AppRoutes() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-400 font-medium">Loading session...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected routes */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/securities/:ticker" element={<SecurityShow />} />

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
    );
}

const appElement = document.getElementById('app');
if (appElement) {
    const root = ReactDOM.createRoot(appElement);
    root.render(<App />);
}
