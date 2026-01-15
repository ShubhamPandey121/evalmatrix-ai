const mongoose = require("mongoose");

/**
 * Interview Report Schema & Model
 * Comprehensive structure for AI-generated interview prep & career roadmaps
 * Author: Shubham Pandey
 */

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Technical question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        },
        difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium"
        },
        category: {
            type: String,
            default: "Core Concepts"
        }
    },
    { _id: true }
);

const starFrameworkSchema = new mongoose.Schema(
    {
        situation: { type: String, default: "" },
        task: { type: String, default: "" },
        action: { type: String, default: "" },
        result: { type: String, default: "" }
    },
    { _id: false }
);

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Behavioral question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        },
        starFramework: {
            type: starFrameworkSchema,
            default: () => ({})
        }
    },
    { _id: true }
);

const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "Skill is required"]
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "Severity is required"]
        },
        recommendation: {
            type: String,
            default: ""
        }
    },
    { _id: false }
);

const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "Day is required"]
        },
        focus: {
            type: String,
            required: [true, "Focus is required"]
        },
        tasks: [
            {
                type: String,
                required: [true, "Task is required"]
            }
        ]
    },
    { _id: true }
);

const interviewReportSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: [true, "Report must belong to a user"],
            index: true
        },
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true
        },
        targetCompany: {
            type: String,
            default: "General Industry",
            trim: true
        },
        jobDescription: {
            type: String,
            required: [true, "Job description is required"]
        },
        resume: {
            type: String,
            default: ""
        },
        selfDescription: {
            type: String,
            default: ""
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100,
            default: 75
        },
        fitSummary: {
            type: String,
            default: ""
        },
        technicalQuestions: [technicalQuestionSchema],
        behavioralQuestions: [behavioralQuestionSchema],
        skillGaps: [skillGapSchema],
        preparationPlan: [preparationPlanSchema]
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

const InterviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = InterviewReportModel;
