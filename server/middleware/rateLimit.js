const rateLimit = require('express-rate-limit');

const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        message: "Too many registration attempts from this IP. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
  registerLimiter
};