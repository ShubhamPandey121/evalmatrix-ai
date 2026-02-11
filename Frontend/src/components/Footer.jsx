import React from "react";

/**
 * Global Footer Component
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */
const Footer = () => {
    return (
        <footer className="global-footer">
            <div className="footer-container">
                <div className="footer-left">
                    <span className="footer-brand">EvalMatrix AI</span>
                    <span className="footer-divider">&bull;</span>
                    <span className="footer-author">
                        Designed &amp; Developed with ❤️ by <a href="https://github.com/ShubhamPandey121" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}><strong>Shubham Pandey</strong></a>
                    </span>
                </div>

                <div className="footer-status">
                    <span className="status-dot" />
                    <span>Gemini AI Engine Online</span>
                </div>

                <div className="footer-right">
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy</a>
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a>
                    <a href="https://github.com/ShubhamPandey121" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <span>&copy; {new Date().getFullYear()} Shubham Pandey. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
