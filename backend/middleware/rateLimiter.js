const rateLimit = require('express-rate-limit');

const shortenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

module.exports = shortenLimiter;
