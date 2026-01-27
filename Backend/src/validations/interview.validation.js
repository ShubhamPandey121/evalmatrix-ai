const { z } = require("zod");

/**
 * Interview Input Validations
 * Author: Shubham Pandey
 */

const generateReportSchema = z.object({
    jobDescription: z
        .string({ required_error: "Job description is required" })
        .trim()
        .min(20, "Job description must be at least 20 characters long"),
    selfDescription: z
        .string()
        .trim()
        .optional()
        .default("")
});

const evaluateAnswerSchema = z.object({
    question: z.string({ required_error: "Question is required" }).trim().min(5),
    candidateAnswer: z.string({ required_error: "Candidate answer is required" }).trim().min(5),
    expectedIntention: z.string().optional(),
    modelAnswer: z.string().optional()
});

module.exports = {
    generateReportSchema,
    evaluateAnswerSchema
};
