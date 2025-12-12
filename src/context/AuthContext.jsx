import { createContext, useState, useEffect } from 'react';
import api from '../../axios/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to check if token is expired
    const isTokenExpired = (token) => {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            // Add 60 second buffer to prevent edge cases
            return payload.exp < (currentTime + 60);
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    };

    // Function to refresh access token (simplified since axios interceptor handles it)
    const refreshToken = async () => {
        try {
            const storedTokens = localStorage.getItem('tokens');
            if (!storedTokens) throw new Error('No refresh token available');
            
            const { refresh } = JSON.parse(storedTokens);
            if (!refresh || isTokenExpired(refresh)) {
                throw new Error('Refresh token expired');
            }

            // The axios interceptor will handle the actual refresh
            // This function is mainly for manual refresh calls
            const response = await api.post('token/refresh/', { refresh });
            const { access } = response.data;

            // Update stored tokens
            const newTokens = { access, refresh };
            localStorage.setItem('access_token', access);
            localStorage.setItem('tokens', JSON.stringify(newTokens));
            setTokens(newTokens);

            console.log('Token refreshed successfully');
            return access;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            throw error;
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const storedTokens = localStorage.getItem('tokens');
                const accessToken = localStorage.getItem('access_token');
                
                console.log('=== AUTH DEBUG ===');
                console.log('Stored user:', storedUser);
                console.log('Stored tokens:', storedTokens);
                console.log('Access token:', accessToken);
                console.log('==================');
                
                // Check if we have valid stored data
                if (storedUser && storedUser !== 'undefined' && storedTokens && accessToken) {
                    const userData = JSON.parse(storedUser);
                    const tokenData = JSON.parse(storedTokens);
                    
                    setUser(userData);
                    setTokens(tokenData);
                } else {
                    console.log('Missing or invalid auth data, clearing storage');
                    logout();
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                logout();
            }
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post('login/', { email, password });
            console.log('Login response:', response.data);
            
            if (response.data) {
                const { access, refresh, user: userData } = response.data;
                
                // Store all auth data
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('tokens', JSON.stringify({ access, refresh }));
                
                // Update state
                setUser(userData);
                setCurrentUser(userData);
                setTokens({ access, refresh });
                
                return { success: true, message: 'Login Successful', user: userData };
            }
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response ? error.response.data : error.message,
                message: 'Login failed. Please check your credentials.'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (first_name, last_name, email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post('register/', {
                first_name,
                last_name,
                email,
                password
            });
            
            if (response.data) {
                const { access, refresh, user: userData } = response.data;
                
                // Store all auth data
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('tokens', JSON.stringify({ access, refresh }));
                
                // Update state
                setUser(userData);
                setCurrentUser(userData);
                setTokens({ access, refresh });
                
                return {
                    success: true,
                    message: 'Registration successful!'
                };
            }
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.response ? error.response.data : error.message,
                message: 'Registration failed, please try again.'
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Clear all stored data
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokens');
        
        // Reset state
        setUser(null);
        setTokens(null);
        setCurrentUser(null);
        setIsLoading(false);
        
        console.log('User logged out');
        return { success: true, message: 'Logout successful' };
    };

    const fetchCurrentUser = async () => {
        // Prevent multiple simultaneous calls
        if (isLoading) {
            console.log('Already fetching user, skipping...');
            return;
        }

        try {
            setIsLoading(true);
            console.log('Fetching current user...');
            
            // The axios interceptor will handle token refresh automatically
            const response = await api.get('current-user/');
            console.log('Current user response:', response.data);
            setCurrentUser(response.data.user);
            return response;
        } catch (error) {
            console.error('Failed to fetch current user:', error);
            
            // If all token refresh attempts fail, the interceptor will redirect to login
            // So we only need to handle other types of errors here
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                throw error;
            }
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        tokens,
        currentUser,
        isLoading,
        login,
        register,
        logout,
        fetchCurrentUser,
        refreshToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};