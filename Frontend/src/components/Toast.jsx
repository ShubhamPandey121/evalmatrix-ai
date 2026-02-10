import React from "react";

/**
 * Toast Notification Banner
 * Author: Shubham Pandey
 */
const Toast = ({ message, type = "info", onClose }) => {
    if (!message) return null;

    return (
        <div className={`toast-banner toast--${type}`}>
            <span className="toast-icon">
                {type === "success" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                )}
                {type === "error" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                )}
                {type === "info" && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                )}
            </span>
            <span className="toast-text">{message}</span>
            {onClose && (
                <button className="toast-close" onClick={onClose}>
                    &times;
                </button>
            )}
        </div>
    );
};

export default Toast;
