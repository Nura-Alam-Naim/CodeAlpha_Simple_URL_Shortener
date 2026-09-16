const { body, validationResult } = require('express-validator');

const validateUrlInput = [
    body('url')
        .isURL({ require_protocol: true, require_valid_protocol: true })
        .withMessage('Must be a valid URL starting with http:// or https://'),
    body('customCode')
        .optional({ checkFalsy: true })
        .isAlphanumeric()
        .withMessage('Custom code must be alphanumeric')
        .isLength({ min: 3, max: 10 })
        .withMessage('Custom code must be between 3 and 10 characters'),
    body('expiresInDays')
        .optional({ checkFalsy: true })
        .isInt({ min: 1, max: 365 })
        .withMessage('Expires in days must be an integer between 1 and 365'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400);
            return next(new Error(errors.array()[0].msg));
        }
        next();
    }
];

module.exports = { validateUrlInput };
