import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";
import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    deleteInterviewReport,
    generateResumePdf,
    getInterviewStats,
    evaluateAnswer
} from "../services/interview.api.js";

/**
 * useInterview Hook
 * Central business logic hook for interview preparation actions
 * Author: Shubham Pandey
 */
export const useInterview = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        stats,
        setStats,
        error,
        setError
    } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            const createdReport = data.interviewReport || data;
            setReport(createdReport);
            // Refresh reports list
            setReports((prev) => [createdReport, ...prev.filter(r => r._id !== createdReport._id)]);
            return createdReport;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getReportById = async (interviewId) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInterviewReportById(interviewId);
            const fetchedReport = data.interviewReport || data;
            setReport(fetchedReport);
            return fetchedReport;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getReports = async (search = "") => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllInterviewReports(search);
            const list = data.interviewReports || data || [];
            setReports(list);
            return list;
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const deleteReport = async (interviewId) => {
        try {
            await deleteInterviewReport(interviewId);
            setReports((prev) => prev.filter((r) => r._id !== interviewId));
            if (report?._id === interviewId) {
                setReport(null);
            }
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const getResumePdf = async (interviewReportId) => {
        setLoading(true);
        try {
            const blobData = await generateResumePdf({ interviewReportId });
            const url = window.URL.createObjectURL(new Blob([blobData], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `ATS_Resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return true;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await getInterviewStats();
            setStats(data);
            return data;
        } catch (err) {
            console.warn("Stats fetch failed:", err.message);
        }
    };

    const submitAnswerEvaluation = async ({ question, candidateAnswer, expectedIntention, modelAnswer }) => {
        return await evaluateAnswer({ question, candidateAnswer, expectedIntention, modelAnswer });
    };

    return {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports,
        stats,
        error,
        setError,
        generateReport,
        getReportById,
        getReports,
        deleteReport,
        getResumePdf,
        fetchStats,
        submitAnswerEvaluation
    };
};
