import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You need to install this: npm install jwt-decode

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                // Decode token to get user info. Note: This doesn't verify the token.
                // Verification happens on the backend.
                const decodedUser = jwtDecode(token);
                setUser(decodedUser);
                localStorage.setItem('token', token);
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
                localStorage.removeItem('token');
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}