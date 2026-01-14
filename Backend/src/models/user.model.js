const mongoose = require("mongoose");

/**
 * User Schema & Model
 * Author: Shubham Pandey
 */
const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username must not exceed 30 characters"]
        },
        email: {
            type: String,
            required: [true, "Email address is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"]
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
