/**
 * asyncHandler
 * Wraps async route handlers to catch any errors and forward them to Express error middleware
 * Author: Shubham Pandey
 */
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
    };
};

module.exports = asyncHandler;
