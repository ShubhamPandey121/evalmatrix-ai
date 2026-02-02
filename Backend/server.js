require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");

/**
 * Server Initialization & Graceful Shutdown
 * Author: Shubham Pandey <shubham230884@gmail.com>
 * GitHub: https://github.com/ShubhamPandey121
 */

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Connect to MongoDB
        await connectToDB();

        const server = app.listen(PORT, () => {
            console.log("==================================================");
            console.log("🚀 EvalMatrix AI - Backend API Server");
            console.log(`👤 Owner & Creator : Shubham Pandey (shubham230884@gmail.com)`);
            console.log(`🌐 Server Running  : http://localhost:${PORT}`);
            console.log(`🩺 Health Check    : http://localhost:${PORT}/api/health`);
            console.log(`⚙️  Environment     : ${process.env.NODE_ENV || "development"}`);
            console.log("==================================================");
        });

        // Graceful Shutdown
        const shutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log("🔒 HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}

startServer();
