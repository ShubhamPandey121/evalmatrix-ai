const jwt = require("jsonwebtoken");
const TokenBlacklistModel = require("../models/blacklist.model");
const { ApiError } = require("../utils/response");

/**
 * Enhanced JWT Authentication Middleware
 * Supports both Authorization Header (Bearer token) and Cookie token
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */
async function authUser(req, res, next) {
    try {
        let token = null;

        // 1. Check Authorization header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // 2. Fallback to cookie
        if (!token && req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new ApiError(401, "Authentication token is missing. Please log in."));
        }

        // 3. Check if token is in blacklist
        const isBlacklisted = await TokenBlacklistModel.findOne({ token });
        if (isBlacklisted) {
            return next(new ApiError(401, "Token has been revoked/logged out. Please log in again."));
        }

        // 4. Verify token
        const secret = process.env.JWT_SECRET || "evalmatrix_ai_shubham_pandey_super_secret_jwt_key_2026";
        const decoded = jwt.verify(token, secret);

        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return next(new ApiError(401, "Your session has expired. Please log in again."));
        }
        return next(new ApiError(401, "Invalid authentication token."));
    }
}

module.exports = { authUser };
