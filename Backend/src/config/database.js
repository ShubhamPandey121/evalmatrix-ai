const mongoose = require("mongoose");

/**
 * MongoDB Database Connection Manager
 * Author: Shubham Pandey
 */
async function connectToDB() {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/interview_ai";

    try {
        mongoose.connection.on("connected", () => {
            console.log("✅ MongoDB successfully connected to:", mongoose.connection.name);
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err.message);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
        });

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });

        return mongoose.connection;
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        console.info("💡 Tip: Ensure MongoDB is running locally or provide a valid MONGO_URI in .env");
    }
}

module.exports = connectToDB;
