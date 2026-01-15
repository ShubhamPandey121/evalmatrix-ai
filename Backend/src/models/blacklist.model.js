const mongoose = require("mongoose");

/**
 * Blacklist Token Schema with TTL Auto-Expiry
 * Author: Shubham Pandey
 */
const blacklistTokenSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: [true, "Token is required for blacklist"],
            unique: true,
            index: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 60 * 60 * 24 * 7 // Automatically deletes document after 7 days
        }
    },
    {
        timestamps: true
    }
);

const TokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = TokenBlacklistModel;
