// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Function to check the user's status with Laravel Sanctum
    const fetchUser = async () => {
        try {
            // Make the request to the protected route
            const response = await api.get('/user');

            // If successful, the user is authenticated
            setUser(response.data);
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
        } catch (error) {
            // If the request fails (e.g., 401 Unauthorized), the user is not logged in.
            if (error.response && error.response.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage. removeItem('isAuthenticated');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Run the check when the component mounts
    useEffect(() => {
        // Check localStorage first for instant UI feedback
        const wasAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

        if (wasAuthenticated) {
            // Set authenticated immediately for better UX
            setIsAuthenticated(true);
            // Then verify with server
            fetchUser();
        } else {
            // Still check with server in case user has valid session
            fetchUser();
        }
    }, []);

    // Context value, including state and login/logout handlers
    const contextValue = {
        user,
        isAuthenticated,
        isLoading,
        fetchUser,
        login: async (credentials) => {
            await api.get('/sanctum/csrf-cookie', { baseURL: '/' });
            await api.post('/login', credentials);
            localStorage.setItem('isAuthenticated', 'true');
            await fetchUser();
        },
        register: async (data) => {
            await api. get('/sanctum/csrf-cookie', { baseURL: '/' });
            await api.post('/register', data);
            localStorage.setItem('isAuthenticated', 'true');
            await fetchUser();
        },
        logout: async () => {
            try {
                await api.post('/logout');
            } catch (error) {
                // Even if logout fails, clear local state
                console.error('Logout error:', error);
            } finally {
                localStorage.removeItem('isAuthenticated');
                setUser(null);
                setIsAuthenticated(false);
            }
        }
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a Custom Hook for Easy Access
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;