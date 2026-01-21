const multer = require("multer");
const { ApiError } = require("../utils/response");

/**
 * File Upload Middleware for Resumes
 * Supports PDF and text documents up to 5MB
 * Author: Shubham Pandey
 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith(".pdf")) {
        cb(null, true);
    } else {
        cb(new ApiError(400, "Invalid file format. Please upload a PDF file (.pdf)"), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter
});

module.exports = upload;
