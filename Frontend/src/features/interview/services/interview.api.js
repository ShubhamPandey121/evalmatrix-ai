import axios from "axios";

/**
 * Interview API Service
 * Author: Shubham Pandey
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

// Interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("interview_ai_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Generate interview report from job description, self description, and resume file
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription = "", resumeFile = null }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);

    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    try {
        const response = await api.post("/api/interview/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data?.data || response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to generate interview strategy");
    }
};

/**
 * Get interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    try {
        const response = await api.get(`/api/interview/report/${interviewId}`);
        return response.data?.data || response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to fetch interview report");
    }
};

/**
 * Get all interview reports for current user
 */
export const getAllInterviewReports = async (search = "") => {
    try {
        const url = search ? `/api/interview/?search=${encodeURIComponent(search)}` : "/api/interview/";
        const response = await api.get(url);
        return response.data?.data || response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to load past reports");
    }
};

/**
 * Delete an interview report
 */
export const deleteInterviewReport = async (interviewId) => {
    try {
        const response = await api.delete(`/api/interview/report/${interviewId}`);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to delete report");
    }
};

/**
 * Download ATS-tailored Resume PDF
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    try {
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
            responseType: "blob"
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to generate resume PDF");
    }
};

/**
 * Fetch user analytics & prep stats
 */
export const getInterviewStats = async () => {
    try {
        const response = await api.get("/api/interview/stats");
        return response.data?.data || response.data;
    } catch (err) {
        console.warn("Could not fetch interview stats:", err.message);
        return { totalReports: 0, averageMatchScore: 0, readinessLevel: "Getting Started", topSkillGaps: [] };
    }
};

/**
 * Practice Mode: Evaluate candidate's practice response
 */
export const evaluateAnswer = async ({ question, candidateAnswer, expectedIntention = "", modelAnswer = "" }) => {
    try {
        const response = await api.post("/api/interview/evaluate-answer", {
            question,
            candidateAnswer,
            expectedIntention,
            modelAnswer
        });
        return response.data?.data?.evaluation || response.data?.evaluation;
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to evaluate answer");
    }
};
