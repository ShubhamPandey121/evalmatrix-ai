const { ApiError } = require("../utils/response");

/**
 * Zod validation middleware for request body, params, or query
 * Author: Shubham Pandey
 */
const validate = (schema, source = "body") => (req, res, next) => {
    try {
        const validated = schema.parse(req[source]);
        req[source] = validated;
        next();
    } catch (err) {
        if (err.errors && Array.isArray(err.errors)) {
            const formattedErrors = err.errors.map(e => ({
                field: e.path.join("."),
                message: e.message
            }));
            return next(new ApiError(400, formattedErrors[0]?.message || "Validation Error", formattedErrors));
        }
        return next(new ApiError(400, err.message || "Invalid input data"));
    }
};

module.exports = validate;
