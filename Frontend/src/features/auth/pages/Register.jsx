import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

/**
 * Modern Register View
 * Author: Shubham Pandey
 */
const Register = () => {
    const { register, loading, authError, clearError } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError("");

        if (!username.trim() || !email.trim() || !password) {
            setLocalError("Please fill out all required fields.");
            return;
        }

        if (username.trim().length < 3) {
            setLocalError("Username must be at least 3 characters long.");
            return;
        }

        if (password.length < 6) {
            setLocalError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setLocalError("Passwords do not match.");
            return;
        }

        try {
            await register({
                username: username.trim(),
                email: email.trim(),
                password
            });
            navigate("/");
        } catch (err) {
            setLocalError(err.message || "Failed to create account. Please try again.");
        }
    };

    const activeError = localError || authError;

    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <div className="brand-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <h1>Interview<span className="highlight">AI</span> <span className="pro-badge">PRO</span></h1>
                    <p className="auth-subtitle">AI-Powered Career Strategy &amp; Interview Coaching</p>
                    <span className="owner-credit">Platform by Shubham Pandey</span>
                </div>

                <div className="form-container">
                    <h2>Create Your Account</h2>
                    <p className="form-caption">Start generating tailored interview plans &amp; ATS resumes in seconds</p>

                    {activeError && (
                        <div className="auth-alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <span>{activeError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="input-group">
                            <label htmlFor="username">Full Name / Username</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                </span>
                                <input
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (activeError) setLocalError("");
                                    }}
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="e.g. Shubham Pandey"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2"/>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                    </svg>
                                </span>
                                <input
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (activeError) setLocalError("");
                                    }}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="e.g. shubham230884@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                </span>
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (activeError) setLocalError("");
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Minimum 6 characters"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(s => !s)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                            <line x1="2" x2="22" y1="2" y2="22"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 11 3 3L22 4"/>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                    </svg>
                                </span>
                                <input
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (activeError) setLocalError("");
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Re-type password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="button primary-button auth-submit-btn"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-small" /> Creating Account...
                                </>
                            ) : (
                                "Create Free Account"
                            )}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </main>
    );
};

export default Register;
