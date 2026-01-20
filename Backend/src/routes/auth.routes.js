const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema, updateProfileSchema } = require("../validations/auth.validation");

/**
 * Authentication Routes
 * Author: Shubham Pandey
 */

const authRouter = Router();

// Register a new user
authRouter.post("/register", validate(registerSchema), authController.registerUserController);

// Login existing user
authRouter.post("/login", validate(loginSchema), authController.loginUserController);

// Logout user and invalidate token
authRouter.get("/logout", authController.logoutUserController);
authRouter.post("/logout", authController.logoutUserController);

// Get currently logged-in user profile
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);

// Update user profile
authRouter.put("/profile", authMiddleware.authUser, validate(updateProfileSchema), authController.updateProfileController);

module.exports = authRouter;
