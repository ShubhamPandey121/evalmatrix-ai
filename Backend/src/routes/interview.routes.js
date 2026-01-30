const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");
const validate = require("../middlewares/validate.middleware");
const { generateReportSchema, evaluateAnswerSchema } = require("../validations/interview.validation");

/**
 * Interview Routes
 * Author: Shubham Pandey
 */

const interviewRouter = express.Router();

// Generate new interview plan
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    validate(generateReportSchema),
    interviewController.generateInterViewReportController
);

// Get all interview reports of logged in user
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
);

// Get user interview preparation analytics
interviewRouter.get(
    "/stats",
    authMiddleware.authUser,
    interviewController.getInterviewStatsController
);

// Get interview report by ID
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
);

// Delete an interview report
interviewRouter.delete(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.deleteInterviewReportController
);

// Generate and download ATS-optimized Resume PDF
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
);

// Practice Mode: Evaluate candidate's practice response to an interview question
interviewRouter.post(
    "/evaluate-answer",
    authMiddleware.authUser,
    validate(evaluateAnswerSchema),
    interviewController.evaluateCandidateAnswerController
);

module.exports = interviewRouter;
