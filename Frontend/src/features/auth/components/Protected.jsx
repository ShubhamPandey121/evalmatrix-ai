import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js";
import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer.jsx";

/**
 * Protected Route Wrapper with Shell Layout
 * Author: Shubham Pandey
 */
const Protected = ({ children }) => {
    const { loading, user } = useAuth();

    if (loading) {
        return (
            <main className="loading-screen">
                <div className="spinner" />
                <h2>Initializing your session...</h2>
                <p>Authenticating credentials securely</p>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Navbar />
            <main className="app-main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Protected;
