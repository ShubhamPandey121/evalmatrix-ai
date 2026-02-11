import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth.js";

/**
 * Global Navigation Header Component
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */
const Navbar = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const onLogout = async () => {
        await handleLogout();
        navigate("/login");
    };

    if (!user) return null;

    const initial = (user.username || "S").charAt(0).toUpperCase();

    return (
        <header className="global-navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <div className="brand-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <div className="brand-text">
                        <span className="brand-title">Eval<span className="highlight">Matrix</span></span>
                        <span className="brand-badge">AI v2.0</span>
                    </div>
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="nav-link nav-link--active">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                            <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                        Dashboard
                    </Link>
                </nav>

                <div className="navbar-user">
                    <div
                        className="user-profile-trigger"
                        onClick={() => setDropdownOpen(o => !o)}
                        title="Account options"
                    >
                        <div className="user-avatar">{initial}</div>
                        <div className="user-info">
                            <span className="username">{user.username || "Shubham Pandey"}</span>
                            <span className="user-role">Candidate Pro</span>
                        </div>
                        <svg className={`chevron-icon ${dropdownOpen ? "chevron-icon--open" : ""}`} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                    </div>

                    {dropdownOpen && (
                        <div className="user-dropdown">
                            <div className="dropdown-header">
                                <p className="dropdown-username">{user.username}</p>
                                <p className="dropdown-email">{user.email}</p>
                                <span className="owner-badge">Created by Shubham Pandey</span>
                            </div>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item dropdown-item--logout" onClick={onLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
