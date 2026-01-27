const { generateInterviewReport, generateResumePdf, evaluateMockAnswer } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");
const UserModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { ApiResponse, ApiError } = require("../utils/response");

/**
 * Interview Controller
 * Comprehensive management of AI interview generation, retrieval, PDF downloads, and mock evaluation
 * Author: Shubham Pandey
 */

/**
 * Safely parse text from PDF or text buffer
 */
async function extractTextFromFile(file) {
    if (!file || !file.buffer) return "";

    try {
        const pdfParse = require("pdf-parse");
        if (pdfParse.PDFParse) {
            const parser = new pdfParse.PDFParse(Uint8Array.from(file.buffer));
            const parsed = await parser.getText();
            return parsed?.text || "";
        } else if (typeof pdfParse === "function") {
            const parsed = await pdfParse(file.buffer);
            return parsed?.text || "";
        }
    } catch (err) {
        console.warn("⚠️ PDF text extraction notice:", err.message);
    }

    try {
        return file.buffer.toString("utf-8");
    } catch {
        return "";
    }
}

/**
 * Generate a new comprehensive interview report
 * @route POST /api/interview/
 */
const generateInterViewReportController = asyncHandler(async (req, res) => {
    const { jobDescription, selfDescription = "" } = req.body;

    if (!jobDescription || jobDescription.trim().length < 15) {
        throw new ApiError(400, "Please provide a detailed target job description (at least 15 characters).");
    }

    let resumeText = "";
    if (req.file) {
        resumeText = await extractTextFromFile(req.file);
    }

    if (!resumeText && (!selfDescription || selfDescription.trim().length < 5)) {
        throw new ApiError(
            400,
            "Please provide either your resume file or a brief self-description of your experience."
        );
    }

    const aiReport = await generateInterviewReport({
        resume: resumeText,
        selfDescription: selfDescription.trim(),
        jobDescription: jobDescription.trim()
    });

    const interviewReport = await InterviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription: selfDescription.trim(),
        jobDescription: jobDescription.trim(),
        ...aiReport
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            { interviewReport },
            "Interview strategy and prep plan generated successfully."
        )
    );
});

/**
 * Get interview report by ID
 * @route GET /api/interview/report/:interviewId
 */
const getInterviewReportByIdController = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    const interviewReport = await InterviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    });

    if (!interviewReport) {
        throw new ApiError(404, "Interview plan not found or you don't have permission to access it.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { interviewReport },
            "Interview report fetched successfully."
        )
    );
});

/**
 * Get all interview reports for the authenticated user
 * @route GET /api/interview/
 */
const getAllInterviewReportsController = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const query = { user: req.user.id };

    if (search && search.trim()) {
        query.title = { $regex: search.trim(), $options: "i" };
    }

    const interviewReports = await InterviewReportModel.find(query)
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -preparationPlan");

    return res.status(200).json(
        new ApiResponse(
            200,
            { interviewReports },
            "Interview reports retrieved successfully."
        )
    );
});

/**
 * Delete an interview report
 * @route DELETE /api/interview/report/:interviewId
 */
const deleteInterviewReportController = asyncHandler(async (req, res) => {
    const { interviewId } = req.params;

    const deletedReport = await InterviewReportModel.findOneAndDelete({
        _id: interviewId,
        user: req.user.id
    });

    if (!deletedReport) {
        throw new ApiError(404, "Report not found or already deleted.");
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Interview report deleted successfully.")
    );
});

/**
 * Generate and download ATS-optimized Resume PDF
 * @route POST /api/interview/resume/pdf/:interviewReportId
 */
const generateResumePdfController = asyncHandler(async (req, res) => {
    const { interviewReportId } = req.params;

    const interviewReport = await InterviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    });

    if (!interviewReport) {
        throw new ApiError(404, "Interview report not found or unauthorized.");
    }

    const user = await UserModel.findById(req.user.id);
    const candidateName = user?.username || "Candidate";

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
        resume,
        jobDescription,
        selfDescription,
        candidateName
    });

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ATS_Resume_${interviewReportId}.pdf"`
    });

    return res.send(pdfBuffer);
});

/**
 * Get user interview analytics and preparation stats
 * @route GET /api/interview/stats
 */
const getInterviewStatsController = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const reports = await InterviewReportModel.find({ user: userId });

    const totalReports = reports.length;
    const avgScore = totalReports > 0
        ? Math.round(reports.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalReports)
        : 0;

    // Extract top skill gaps
    const gapMap = {};
    reports.forEach(r => {
        if (r.skillGaps && Array.isArray(r.skillGaps)) {
            r.skillGaps.forEach(g => {
                gapMap[g.skill] = (gapMap[g.skill] || 0) + 1;
            });
        }
    });

    const topGaps = Object.entries(gapMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, count }));

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalReports,
                averageMatchScore: avgScore,
                readinessLevel: avgScore >= 80 ? "Interview Ready" : avgScore >= 60 ? "On Track" : "Needs Preparation",
                topSkillGaps: topGaps
            },
            "User interview statistics fetched successfully."
        )
    );
});

/**
 * Evaluate candidate's practice response to a question
 * @route POST /api/interview/evaluate-answer
 */
const evaluateCandidateAnswerController = asyncHandler(async (req, res) => {
    const { question, candidateAnswer, expectedIntention, modelAnswer } = req.body;

    if (!question || !candidateAnswer) {
        throw new ApiError(400, "Question and candidate answer are required for evaluation.");
    }

    const evaluation = await evaluateMockAnswer({
        question,
        candidateAnswer,
        expectedIntention,
        modelAnswer
    });

    return res.status(200).json(
        new ApiResponse(200, { evaluation }, "Answer evaluated successfully.")
    );
});

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    generateResumePdfController,
    getInterviewStatsController,
    evaluateCandidateAnswerController
};
