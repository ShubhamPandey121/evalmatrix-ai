const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TokenBlacklistModel = require("../models/blacklist.model");
const asyncHandler = require("../utils/asyncHandler");
const { ApiResponse, ApiError } = require("../utils/response");

/**
 * Authentication Controller
 * Manages user registration, login, logout, profile fetching, and profile updates
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
};

const generateToken = (user) => {
    const secret = process.env.JWT_SECRET || "evalmatrix_ai_shubham_pandey_super_secret_jwt_key_2026";
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        secret,
        { expiresIn: "1d" }
    );
};

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const registerUserController = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "Please provide username, email, and password.");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await UserModel.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }]
    });

    if (existingUser) {
        if (existingUser.email === normalizedEmail) {
            throw new ApiError(409, "An account with this email address already exists.");
        }
        throw new ApiError(409, "This username is already taken. Please choose another.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword
    });

    const token = generateToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            },
            "User registered successfully"
        )
    );
});

/**
 * Log in an existing user
 * @route POST /api/auth/login
 */
const loginUserController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide both email and password.");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const token = generateToken(user);
    res.cookie("token", token, COOKIE_OPTIONS);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            },
            "Logged in successfully"
        )
    );
});

/**
 * Log out user and blacklist token
 * @route GET /api/auth/logout
 */
const logoutUserController = asyncHandler(async (req, res) => {
    let token = req.token || req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
        await TokenBlacklistModel.findOneAndUpdate(
            { token },
            { token },
            { upsert: true }
        );
    }

    res.clearCookie("token", COOKIE_OPTIONS);

    return res.status(200).json(
        new ApiResponse(200, null, "Logged out successfully")
    );
});

/**
 * Fetch current authenticated user
 * @route GET /api/auth/get-me
 */
const getMeController = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id).select("-password");

    if (!user) {
        throw new ApiError(404, "User profile not found.");
    }

    return res.status(200).json(
        new ApiResponse(200, { user }, "User profile retrieved successfully")
    );
});

/**
 * Update authenticated user's profile
 * @route PUT /api/auth/profile
 */
const updateProfileController = asyncHandler(async (req, res) => {
    const { username, email } = req.body;
    const updates = {};

    if (username) updates.username = username.trim();
    if (email) updates.email = email.toLowerCase().trim();

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No profile updates provided.");
    }

    const user = await UserModel.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json(
        new ApiResponse(200, { user }, "Profile updated successfully")
    );
});

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    updateProfileController
};
