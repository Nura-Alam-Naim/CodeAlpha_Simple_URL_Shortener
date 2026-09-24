const express = require('express');
const router = express.Router();
const {
    shortenUrl,
    getStats,
    getAllUrls,
    deleteUrl,
    deactivateUrl,
    activateUrl
} = require('../controllers/urlController');
const { validateUrlInput } = require('../middleware/validator');
const shortenLimiter = require('../middleware/rateLimiter');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

// POST /api/shorten
router.post('/shorten', shortenLimiter, optionalProtect, validateUrlInput, shortenUrl);

// GET /api/urls
router.get('/urls', optionalProtect, (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}, getAllUrls);

// GET /api/stats/:shortCode
router.get('/stats/:shortCode', optionalProtect, getStats);

// DELETE /api/urls/:shortCode (Hard Delete)
router.delete('/urls/:shortCode', optionalProtect, deleteUrl);

// PUT /api/urls/:shortCode/deactivate
router.put('/urls/:shortCode/deactivate', optionalProtect, deactivateUrl);

// PUT /api/urls/:shortCode/activate
router.put('/urls/:shortCode/activate', optionalProtect, activateUrl);

module.exports = router;
