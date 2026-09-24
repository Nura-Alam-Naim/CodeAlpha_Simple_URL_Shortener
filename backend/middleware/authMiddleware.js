const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hahahaThisisNothing';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);
            
            req.user = decoded; // { id, username }
            
            next();
        } catch (error) {
            console.error('JWT Verify Error:', error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Optional protect middleware for when user can be guest or logged in
const optionalProtect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Ignore token failure for optional protect
        }
    }
    next();
};

module.exports = { protect, optionalProtect };
