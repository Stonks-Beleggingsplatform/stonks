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
        } catch (error) {
            // If the request fails (e.g., 401 Unauthorized), the user is not logged in.
            if (error.response && error.response.status === 401) {
                setUser(null);
                setIsAuthenticated(false);
                document.cookie = "logged_in=; path=/; max-age=0";
            } else {
                // Log other errors (CORS, network failure, etc.)
                //console.error("Error fetching user:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Run the check when the component mounts
    useEffect(() => {
        const loggedIn = document.cookie.split('; ').find(row => row.startsWith('logged_in='));
        if (loggedIn) {
            fetchUser();
        } else {
            setIsLoading(false);
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
            document.cookie = "logged_in=true; path=/; max-age=31536000; SameSite=Lax";
            await fetchUser();
        },
        register: async (data) => {
            await api.get('/sanctum/csrf-cookie', { baseURL: '/' });
            await api.post('/register', data);
            document.cookie = "logged_in=true; path=/; max-age=31536000; SameSite=Lax";
            await fetchUser();
        },
        logout: async () => {
            await api.post('/logout');
            document.cookie = "logged_in=; path=/; max-age=0";
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={contextValue} >
            {children}
        </AuthContext.Provider >
    );
};

// 3. Create a Custom Hook for Easy Access
export const useAuth = () => {
    return useContext(AuthContext);
};