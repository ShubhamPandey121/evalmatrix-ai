import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";

/**
 * useAuth Hook
 * Author: Shubham Pandey
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const {
        user,
        setUser,
        loading,
        setLoading,
        authError,
        clearError,
        login,
        register,
        logout
    } = context;

    return {
        user,
        setUser,
        loading,
        setLoading,
        authError,
        clearError,
        handleLogin: login,
        handleRegister: register,
        handleLogout: logout,
        login,
        register,
        logout
    };
};
