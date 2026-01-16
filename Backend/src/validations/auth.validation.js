const { z } = require("zod");

/**
 * Authentication Input Validations
 * Author: Shubham Pandey
 */

const registerSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .trim()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must not exceed 30 characters"),
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email address format"),
    password: z
        .string({ required_error: "Password is required" })
        .min(6, "Password must be at least 6 characters long")
});

const loginSchema = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email("Invalid email address format"),
    password: z
        .string({ required_error: "Password is required" })
        .min(1, "Password is required")
});

const updateProfileSchema = z.object({
    username: z.string().trim().min(3).max(30).optional(),
    email: z.string().trim().email().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateProfileSchema
};
