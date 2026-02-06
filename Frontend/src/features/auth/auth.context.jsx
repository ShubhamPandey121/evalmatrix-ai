import { createContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from "./services/auth.api.js";

/**
 * Authentication Context & State Provider
 * Centralized session management and user state
 * Author: Shubham Pandey
 */

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Fetch user on initial app mount
    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            try {
                const data = await getMe();
                if (isMounted && data?.user) {
                    setUser(data.user);
                }
            } catch (err) {
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const login = async ({ email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await apiLogin({ email, password });
            setUser(data.user);
            return data.user;
        } catch (err) {
            setAuthError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ username, email, password }) => {
        setLoading(true);
        setAuthError(null);
        try {
            const data = await apiRegister({ username, email, password });
            setUser(data.user);
            return data.user;
        } catch (err) {
            setAuthError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await apiLogout();
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    const clearError = () => setAuthError(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading,
                authError,
                clearError,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
