const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { ApiError } = require("./utils/response");

/**
 * Express Application Configuration
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */

const app = express();

// Body and Cookie Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all in dev mode for flexibility
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Request Logger (Lightweight)
app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        if (process.env.NODE_ENV !== "test") {
            console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
        }
    });
    next();
});

// Health Check Endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        platform: "EvalMatrix AI",
        version: "2.0.0",
        author: "Shubham Pandey",
        email: "shubham230884@gmail.com",
        github: "https://github.com/ShubhamPandey121",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())} seconds`
    });
});

// API Routes
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

// 404 Route Handler
app.use((req, res, next) => {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global Centralized Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
    const message = err.message || "An unexpected server error occurred.";
    const errors = err.errors || [];

    if (statusCode >= 500) {
        console.error("🔥 Server Error:", err);
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

module.exports = app;
