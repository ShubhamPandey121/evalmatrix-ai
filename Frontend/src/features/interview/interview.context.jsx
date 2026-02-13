import { createContext, useState } from "react";

/**
 * Interview Context
 * Author: Shubham Pandey
 */

export const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(null);
    const [reports, setReports] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <InterviewContext.Provider
            value={{
                report,
                setReport,
                reports,
                setReports,
                stats,
                setStats,
                loading,
                setLoading,
                error,
                setError,
            }}
        >
            {children}
        </InterviewContext.Provider>
    );
};
